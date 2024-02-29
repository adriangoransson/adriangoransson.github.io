---
title: Starting a blog because you want to build something with X
date: 2024-02-29
---

<script>
	import Counter from './Counter.svelte'
</script>

Ah, such a cliché in the world of software development.

I'm a big fan of [Svelte][svelte] and its "app framework"
[Sveltekit][sveltekit]. For years I've had an eye on the latest developments
and blog posts. I just really appreciate the philosophy behind it. A blog post
from a couple of years ago, [Write less code][write-less-code], in particular
had a big impact on me, making me see boilerplate code everywhere...&nbsp;😶

When Svelte 5 was announced last fall, I was excited. There were promises of
even better developer experience and performance, my two favorite things! So I
tried out the Alpha version with Sveltekit.

## Svelte 5 micro review

With the introduction of [runes][runes] in Svelte 5, Svelte has gotten a little
bit more to type. The old ways of hijacking a --- funky, yet clever ---
superset of Javascript is out, and compiler macros (runes) are in! On the whole,
I like it as it feels easier to determine where reactivity is used.

```js
// The old way with "plain Javascript".
let a = 'reactive';
export let b; // `b` is a prop.
$: c = `${a} or ${b}`; // Computed value is prefixed with `$:`.

// The new way, with runes!
let a = $state('reactive');
let { b } = $props();
let c = $derived(`${a} or ${b}`);
```

It can be a bit more boilerplate-y in some ways, e.g. if you're using Typescript
or JSDoc you have to type out prop names twice.

```ts
let { a, b } = $props<{ a: number; b: string }>();
```

Aside from that, `$props()` is really nice. If you are writing a component to
wrap an HTML element, you don't need to expose every attribute of the underlying
element as a prop. Accept a rest prop and spread it out on the element instead.
The rest prop can even be typed using `svelte/elements`, giving component users
transparent autocomplete to the HTML element attributes.

```svelte
<script>
	let { value, ...attrs } = $props();
</script>

<button {...attrs}>
	{value}
</button>
```

I'm still not convinced that I understand the `$derived()` rune and its
reactivity rules entirely, but I'll hopefully get there with some trial & error.

## The problem with cool new tech

There's nothing to build!

Ok, well, sure, there are probably loads of stuff. But I want to start off with
something small, where I can extend it later if I want to.

I tried porting a couple of old projects, including a Vue 2 project, to Svelte
5 just to get a feel for it. It feels nice, but it's too small. It's been in
the back of my head for many years to start a blog, which would be perfect.

Only halfway into writing this first post do I actually realize that I'm not
using any Svelte 5 features, like, at all.&nbsp;😅 I'm hardly even using Svelte. Most
components (page routes) are written in Markdown and rendered with
[mdsvex][mdsvex]. But so far, I don't have any plans on interactive content.
Very uncool. Let's fix that before we continue.

<div class="block">
	<Counter/>
</div>

Sure, running a Sveltekit app requires some setup in comparison to a CMS or
regular static site generator, but you can still get off the ground relatively
fast, considering how flexible it is.

It's not for lack of technical implementation that I haven't been writing
before, though. The actual reasons for that are very simple:

## Time spent on the blog, rather than on the content

I know that I will spend much more time on small technical details _around_ the
blog, rather than on the actual writing. It's much easier, and there is always
some small insignificant thing that _needs_ doing! Then I can feel really good
about the tiny commit I just made for the rest of the day.&nbsp;🤗

## Writing is really difficult

Oh, right, this is a pretty big reason. Collecting your thoughts into something
that even resembles a coherent piece of writing is challenging. And what do
_I_ really have to say that anyone in the world would find important enough to
spend time reading?

Still, I do remember the last semester at university with a friend, writing our
[masters thesis][thesis] quite fondly. Yes, it was really stressful and hard
and we kept constantly changing lanes on what the final product would be, but
once you got into some writing flow it was actually really enjoyable, and I
miss that!

## Starting off

As you can probably tell, I've decided to try to write more.&nbsp;🎉 If not for
anyone else, then for my own sake. I have a couple of ideas for future posts,
so this will ~~probably~~ hopefully not be one of those "I'm starting a new
blog" posts where it's also the _only_ post.

Thanks for reading!

[svelte]: https://svelte.dev
[sveltekit]: https://kit.svelte.dev
[write-less-code]: https://svelte.dev/blog/write-less-code
[runes]: https://svelte.dev/blog/runes
[mdsvex]: https://mdsvex.pngwn.io/
[thesis]: https://lup.lub.lu.se/student-papers/search/publication/9078076

<style>
	.block{
		padding: 10px;
	}
</style>
