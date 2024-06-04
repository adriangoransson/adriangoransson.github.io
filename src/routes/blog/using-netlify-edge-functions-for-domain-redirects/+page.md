---
title: Using Netlify Edge functions for domain redirects
date: 2024-03-02
---

Up until recently, this website was hosted on [adriang.se][adriang]. Yes, I
know what you're thinking: "God, what a boring domain name", and you would be
absolutely right.

So I got adrg.se instead, which is more cryptic, space efficient, and cool. At
least one of those statements is true.

## The problem

I wanted my old domain to still work, but redirect visitors to the new domain.
That should be no problem, I thought, I'll just set up a redirect in my DNS
provider's control panel. I vaguely remember such an option on most DNS/web
hosting providers that I've used in the past, so I was surprised to find out
that I couldn't find such a feature now.

Maybe it's not a thing anymore.&nbsp;🤷

## Possible solutions

One solution could be to switch to a DNS provider that supports this feature,
but the one I have is pretty decent otherwise, and I don't think I can be
bothered really.

Another would be to use a service like [forwarddomain.net][forwarddomain],
which uses a `TXT` record on your domain to configure it which I thought was
clever. However, that is an external service and I don't want to have to keep
up to date with possible changes in configuration or their terms of service.

## What I did instead

Netlify has very generous (free) pricing for their "edge functions". Edge
functions are basically small, serverless [Deno][deno] scripts that you can run
on your Netlify site, served on the Netlify CDN. This is not an ad, and there
are similar options by other providers --- such as Vercel and Cloudflare --- I'm
just using Netlify because it's what I know. I also think that they do a great
job of making deploys from git repos easy, with hardly no configuration
necessary.

Anyway, the edge function is really just this tiny snippet of code:

```ts
export default async (req: Request) => {
	const url = new URL(req.url);
	const transformed = `${REDIRECT_HOST}${url.pathname}`;

	console.log(`${req.url} → ${transformed}`);

	return Response.redirect(transformed, 301);
};
```

And this configuration (`netlify.toml`) to use the function as a catch-all
handler.

```toml
[[edge_functions]]
  function = "redirect"
  path = "/*"
```

That's it! The entire thing. Now I just had to set up DNS entries to point to
Netlify, and I was done.

## Deploy it yourself

If you are interested in using this, I've published the code on [Github][repo].
You could also use the button below to immediately deploy a copy on Netlify.

<a class="no-link-style"
   href="https://app.netlify.com/start/deploy?repository=https://github.com/adriangoransson/netlify-redirector"
   rel="nofollow">
<img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify">
</a>

[adriang]: https://adriang.se
[forwarddomain]: https://forwarddomain.net/
[deno]: https://deno.com
[repo]: https://github.com/adriangoransson/netlify-redirector/
