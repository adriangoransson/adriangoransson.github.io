---
title: 'Dotfiles digest: git'
date: 2024-03-01
---

There has been a slight buzz of git related content lately. From Scott Chacon's
[So you think you know Git][chacon] to Julia Evans' article on [Popular git
config options][evans]. Both are very much worth your time if you use git
somewhat often. I use git almost every day and I think it's really great
(Survivorship bias? Never heard of it), so this feels like great timing to make
a post annotating my own configuration, which I have checked in to my [dotfiles
repository][gitconfig].

The point of this "series" (if I ever do another one!) is to document some of
the choices I have made in configuring tools I use regularly. Both for my own
benefit (some of these options were set a _long_ time ago) and for beginners who
are looking for a good starting point in their config. I like to keep my custom
configuration pretty small.

It's also a pretty good motivation to keep my dotfiles clean and checked
in.&nbsp;😬

## Global configuration

This is `$HOME/.config/git/config`. It's common to use `$HOME/.gitconfig` too,
but I think this is a bit neater because I use multiple configuration files.
More on that below.

```ini
[user]
	name = Adrian Göransson
```

Well, that's just me!

```ini
[alias]
	ch = checkout
	ci = commit
	df = diff
	l  = log
	ph = push
	pl = pull
	sh = show
	st = status

	rb  = rebase
	rbi = rebase -i --keep-base

	f  = fetch
	fa = fetch --all

	r  = reset
	rh = reset --hard

	dfst = diff --stat
```

Okay, something more substantial! These are some of my most commonly used
commands, which is why I've configured aliases for easier use. I prefer
configuring these aliases in git as opposed to having shell aliases for every
subcommand like `gl` or `gph`. Using `g` as an alias for git is plenty enough
for me.

Most of these aliases are pretty basic. `fetch --all` fetches from all remotes
if you have multiple configured. Rebase with `--keep-base` may not be very
common though, so let me try to explain what it does!

### Rebasing with `--keep-base`

Some familiarity with rebasing is assumed here, otherwise check out the git
book [chapter on rebasing][git-book-rebasing]. With that out of the way, let's
consult the [manual][rebase-manual].

> "[`--keep-base`] is useful in the case where one is developing a feature on top
> of an upstream branch. While the feature is being worked on, the upstream
> branch may advance and it may not be the best idea to keep rebasing on top of
> the upstream but to keep the base commit as-is."

I think this is a pretty good explanation actually! For a bit more in-depth with visualizations, expand the section below.

<details>
<summary>More on <code>git rebase --keep-base</code></summary>

You have a feature branch creatively named `feature` that continues from `main`
on commit `E`. You create a couple of commits and push your changes for review
by your team. The simplified commit graph looks like this.

```
      A---B---C feature
     /
D---E main
```

While you wait for your code to get reviewed, you start working on something
else. While you were developing `feature`, commits `F` and `G` were merged to
`main`, resulting in the following graph.

```
      A---B---C feature
     /
D---E---F---G main
```

After some time, your `feature` branch has been reviewed and you want to make
changes in response. You might find yourself in a place where you want to
rewrite the commit history (in your feature branch, don't do this on a shared
branch like `main`!), in which case you would use `rebase`. In this case, we
are editing commit `B`, creating `B₂` in its place.

However, as your `main` has advanced, `rebase` will try to create this graph.

```
              A---B₂---C feature
             /
D---E---F---G main
```

If commits `F` and `G` happen to conflict with your work, you will get to
handle those as well as the potential conflicts that you may have created going
from `B₂` → `C`. That can get _really_ messy. If you have to go several rounds
of review and `main` keeps advancing, this can get frustrating quickly. What
you probably would want to do instead, is use `--keep-base`, yielding this
graph.

```
      A---B₂---C feature
     /
D---E---F---G main
```

In my experience, the conflicts towards the merge target are best handled when
the code has passed review and you are ready to merge. Only then do you merge
to `main`, handling the potential conflicts during the merge, instead of during
rebases.

```
      A---B₂---C feature
     /          \
D---E-----F------G main
```

</details>

In my team, we have moved away from editing commit history and force pushing
during review, and are instead using `fixup!` commits to mark _where_ history
is going to get rewritten once the branch passes review. To do so with less
effort, I have used [git-fixup][git-fixup] and [git-absorb][git-absorb].

### Returning to dotfiles

```ini
[commit]
	verbose = true
```

Commit with verbose mode is really nice. Your commit message editor gets
populated with the about-to-be-committed diff as a comment, giving you a last
look at what is being committed.

```ini
[gpg]
	format = ssh
[commit]
	gpgSign = true
[tag]
	gpgSign = true
```

Always sign commits and tags. The few times I have used GPG it has always been a
hassle, but no more with SSH keys!

```ini
[init]
	defaultBranch = main
```

When creating a new git repository, use `main` as the default branch name.

```ini
[log]
	date = local
```

Show datetimes in my local time zone, instead of the timezone of the
committer/author.

```ini
[tag]
	sort = version:refname
```

Change the sort order of `git tag` to sort tags numerically and respect version
numbers. This way, `v10` comes after `v9` instead of `v1`.

A short example from one of my repositories.

```
default  |  version:refname
---------+-----------------
v0.1.0   |  v0.1.0
v0.1.1   |  v0.1.1
v0.1.10  |  v0.1.2
v0.1.11  |  v0.1.3
v0.1.2   |  v0.1.7
```

```ini
[branch]
	sort = -committerdate
```

Sort the output of `git branch` to show most recently committed to branches
first.

```ini
[rerere]
	enabled = true
```

I had heard tales of `rerere` (`REuse REcorded REsolution`) for a long time as
an invaluable tool to manage conflicts, but never bothered to read more about
it and discarded it, thinking it was something I had to learn and/or remember
to do manually. Turns out, after watching Scott Chacon's
[presentation][chacon], it was none of those things! Basically, with `rerere` ,
git remembers how you have handled a conflict earlier and tries to apply that
same resolution again if it can. This is a life saver if you, like me, often
use rebase to clean/rewrite your local history. In those cases, one small
conflict can stack up and become something that you have to solve when
reapplying every commit.

```ini
[include]
	path = config.local
```

Last, but not least, the `[include]` directive! Having your dotfiles checked in
to version control can pretty quickly get messy, since you may want to set
options that should only apply on a certain device. For me, I have different SSH
keys on my work laptop, and repository-specific configuration as well, which
doesn't make much sense on any of my other devices, or in version control. Sure,
sophisticated tools to manage your dotfiles (or even just git branches) may
solve this for you, but I appreciate the simplicity of just chucking things into
a plain git repository.

I do this with device-local files. With git, that means using `[include]`.
Basically, I have a separate git config file called `config.local` that git
will try to load. If the file doesn't exist, git won't complain, so it's safe
to keep the directive even on devices where you don't have a local
configuration file.

## Local configuration

So how does it look? Here's an excerpt:

```ini
[user]
	signingKey = ssh-ed25519 [...]

[gpg "ssh"]
	# $HOME does not work, so this is OS-specific :(
	allowedSignersFile = /Users/adrian/.ssh/authorized_signatures

[pager]
	diff = riff
	show = riff
	log = riff

[includeIf "hasconfig:remote.*.url:git@github.com:<organisation>/**"]
	path = work.local
```

Here we see the aforementioned SSH key configuration. I also use the excellent
[`riff`][riff] as a pager to highlight diffs. The reason that I have it
configured in `config.local` is that git doesn't play very nice if the
configured pager is not installed, so I prefer to set this option when I know
the command is available.

And finally, the powerful `includeIf` directive, which lets me conditionally
load another config file based on various conditions. In this case a remote URL!
Basically, when I `git clone <work repo>`, the repository is already configured
to use the configuration in `work.local` as defaults. Pretty useful if you have
a bunch of microservice repositories.

Right now, mine is pretty boring:

```ini
[user]
    email = <work email>
```

Because it is of great annoyance to me when I try to commit something in a new
repository and git hits me with this:

```
Author identity unknown

*** Please tell me who you are.

Run

  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"

to set your account's default identity.
Omit --global to set the identity only in this repository.
```

Maybe I'm just a very easily annoyed person, I don't know!

## Wrapping up

I hope that this post can be of use to someone, either a beginner or someone
who just hasn't thought about their git configuration for some time. With an
actively maintained project like git, cool new features are introduced quite
frequently. It's easy to miss out.

Until next time!

[chacon]: https://www.youtube.com/watch?v=aolI_Rz0ZqY
[evans]: https://jvns.ca/blog/2024/02/16/popular-git-config-options/
[gitconfig]: https://github.com/adriangoransson/dotfiles/blob/35010395861c26ee1cd862e95f0c72aeeac072c3/.config/git/config
[rebase-manual]: https://git-scm.com/docs/git-rebase
[git-fixup]: https://github.com/keis/git-fixup/
[git-absorb]: https://github.com/tummychow/git-absorb
[git-book-rebasing]: https://git-scm.com/book/en/v2/Git-Branching-Rebasing
[riff]: https://github.com/walles/riff
