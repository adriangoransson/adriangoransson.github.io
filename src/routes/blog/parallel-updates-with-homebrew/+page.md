---
title: Parallel updates with Homebrew
date: 2024-06-01
---

Update 2024-10-06: Concurrent downloads seems to be on the roadmap (tracking
issue [#18278]) and implemented for `brew fetch`. The option for now is
["undocumented and unsupported"][hidden] but it's great to see it happen!

<script>
import demo from './demo.mp4';
</script>

[Homebrew][homebrew], or simply just brew, is a package manager primarily for
macOs.

Homebrew used to be very slow, but over the years its maintainers have
implemented a number of optimizations. The most significant of which is probably
the [migration to a JSON package index][homebrew-4.0] instead of using locally
evaluated Ruby package scripts tracked in an enormous git repo that you would
have to pull every time you tried to update your packages. It's still not very
fast, but it is much faster than it used to be! 🎉

However, one of my main gripes with Homebrew is the lack of parallelization when
upgrading or installing packages. This is especially noticeable when you don't
update your packages for a little while, or when downloading a package with many
dependencies. Homebrew will download everything in sequence before getting to
the thing you're actually interested in.

There have been attempts to request and implement this, and while initial
reactions from the maintainers were positive ([#1865], [#3107]),
they seem to have changed their stance on it since then ([#12489]).

Personally, I don't really buy the argument that Github's servers would be put
under such heavy stress by allowing users to download packages in parallel.

## A simple fix

Since I don't know Ruby, the easiest way I could manage to circumvent the slow
sequential downloads is by running running brew's `fetch` subcommand in parallel
as sort of a primer before running `brew upgrade`.

```sh
#!/bin/sh

brew update

brew outdated --json "$@" \
    | jq -r '.formulae + .casks | .[].name' \
    | xargs -P0 -L1 brew fetch

brew upgrade "$@"
```

Here, we construct a list of package names using `brew outdated --json` and
`jq`. We then pipe the results to `xargs` which will parallelize with as many
processes as possible (`-P0`) for every one line of input (`-L1`). Finally, we
run `brew upgrade` which will recognize that the required files have already
been fetched and proceed directly to installation. The variable `$@` is used to
pass on every argument the script receives to `brew outdated` and `brew
upgrade`.

This script can be made into a [brew alias] if we save it to
`~/.brew-aliases/parupgrade`. It is then simply used like so:

```sh
$ brew parupgrade [formula|cask ...]
```

You might have to make the file executable first. That's it.

Enjoy parallel downloads!&nbsp;🥳

## How does it perform?

To benchmark this solution, I grabbed a random selection of formulae/casks off
of my system like so:

```sh
$ brew ls | shuf | head -n "$n" > packages
```

Where `$n` corresponds to the number of packages. For each `$n`, I ran three
different randomized selections.

I used [hyperfine] to benchmark `brew fetch` when ran in sequence versus in
parallel. To construct (and parallelize) the command, `xargs` was used. The
fetch subcommand will only download the package it is provided, since we're not
using the `--deps` flag. Using it would only lead to trouble anyhow, if (or
when, rather) multiple packages share a dependency.

```sh
$ hyperfine --prepare='brew cleanup --prune=all' --warmup 2 \
    '<packages xargs brew fetch' \
    '<packages xargs -P0 -L1 brew fetch'
```

The results are taken straight from hyperfine, and based on ten runs each.

<div class="table-container">

| Test # | Packages (`$n`) | Sequential | Parallel | Speedup |
| -----: | --------------: | ---------: | -------: | ------: |
|      1 |               3 |    3.094 s |  1.978 s |   1.56x |
|      2 |               3 |    6.402 s |  4.850 s |   1.32x |
|      3 |               3 |    3.726 s |  2.433 s |   1.53x |
|      4 |               5 |    4.303 s |  1.897 s |   2.27x |
|      5 |               5 |    4.725 s |  2.495 s |   1.89x |
|      6 |               5 |   10.247 s |  5.855 s |   1.75x |
|      7 |              10 |    7.724 s |  2.820 s |   2.74x |
|      8 |              10 |   14.870 s |  7.818 s |   1.90x |
|      9 |              10 |    7.938 s |  2.915 s |   2.72x |

</div>

Even though the speedup might not always be impressive, it should be noted that
the parallel runs were _consistently_ faster. We also see that the relative
speedup increases with the number of packages. This suggests that the overhead
of executing `brew fetch` is more significant with fewer packages. Not
surprising perhaps considering that `brew fetch --help` (a no-op subcommand!), runs
in ~400 ms on my machine (M1 Macbook Pro).

I think there could be substantial speed gains if parallelized downloads were
handled by Homebrew instead.

This benchmark does not account for the fact that the script first will have to
run `brew outdated` first to figure out what packages it should fetch. This
subcommand is slow at around 1400 ms on my machine, and will probably defeat the
benefits of parallel fetching when the amount of packages to update is small.

### Caveats

Parallelizing commands with `xargs` will echo the output of all executed
commands simultaneously (output interleaving). Because `brew fetch` shows
dynamic progress bars it will result in completely jumbled output. My advice is
to either dismiss the output or use a parallelization enabler that can handle
it.

Lastly, the version above treats every outdated package the same, even if they
are built from source (with `brew install --HEAD`).

## How I use it

To resolve the caveats just mentioned, my own version of this script:

- will download the correct `--HEAD` version of a package if you are building a
  package from source.
- echoes the about-to-be-downloaded packages
- suppresses the dynamic output of `brew fetch`, instead echoing updates when
  each individual fetch is complete.

It's not much, but it makes the experience a little nicer.

<details>
<summary>Expand code</summary>

```sh
#!/bin/sh

fetch_head=
for arg in "$@"
do
    if [ "$arg" = '--fetch-HEAD' ]
    then
        fetch_head=1
        break
    fi
done

brew update
outdated=$(brew outdated --json "$@")

jq_transform='if .current_version | startswith("HEAD")
    then .name+" --HEAD"
    else .name
end'
updates=$(echo "$outdated" \
    | grep '^[{} ]' \
    | jq -r ".formulae + .casks | .[] | $jq_transform")

if [ -z "$fetch_head" ]
then
    updates=$(echo "$updates" | grep -v ' --HEAD$')
fi

if [ -z "$updates" ]
then
    exit
fi

echo "$outdated" | jq -r '.formulae + .casks
    | map(.name)
    | sort
    | join(", ")
    | "Downloading " + .'

echo "$updates" \
    | xargs -P0 -L1 -I{} sh -c \
    'brew fetch {} > /dev/null && echo "  ✓ {}"'

brew upgrade "$@"
```

</details>

Here's a quick demo!

<div class="expand-width">

<video controls src={demo}/>

</div>

Notice that brew tries to fetch every package, but reports them as already
downloaded and proceeds.

## Conclusion

Homebrew is slow. Parallelizing part of the workload can make it slightly less
slow.

[#18278]: https://github.com/Homebrew/brew/issues/18278
[hidden]: https://github.com/Homebrew/brew/pull/17756#issuecomment-2335179823
[homebrew]: https://brew.sh/
[homebrew-4.0]: https://brew.sh/2023/02/16/homebrew-4.0.0/
[#1865]: https://github.com/Homebrew/brew/issues/1865
[#3107]: https://github.com/Homebrew/brew/pull/3107
[#12489]: https://github.com/Homebrew/brew/issues/12489
[brew alias]: https://github.com/Homebrew/homebrew-aliases
[hyperfine]: https://github.com/sharkdp/hyperfine/
