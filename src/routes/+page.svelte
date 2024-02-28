<script>
	import me from '$lib/me.jpg';
</script>

<svelte:head>
	<title>Adrian Göransson</title>
</svelte:head>

<header>
	<img src={me} alt="" />
	<h1>Adrian Göransson</h1>
	<span>Developer, developer, developer</span>
</header>

<main>
	<p>Hi there! 👋</p>

	<p>
		I'm a passionate and experienced software engineer with an MSc. in Computer Science and
		Engineering. I'm based in Stockholm, Sweden and am currently building things at
		<a href="https://opti.se">Opti</a>, a financial robo-advisor where I'm learning a lot about
		*hand waving* <em>the&nbsp;economy</em>.
	</p>

	<p>
		I like to build stuff mostly in Go, Rust, and Typescript, but I'm comfortable with a lot of
		different tech stacks. Check out my <a href="/adrian_goransson_cv.pdf">resumé</a> for more details.
	</p>

	<section id="links">
		<span><a href="https://github.com/adriangoransson">github</a></span>
		<span><a href="https://www.linkedin.com/in/adriangoransson">linkedin</a></span>
		<span><a href="mailto:adrian@adrg.se">adrian@adrg.se</a></span>
	</section>
</main>

<style>
	header {
		text-align: center;
		padding-top: 3%;
		margin: 0 auto 15px;
	}

	header img {
		max-width: 180px;
		border-radius: 50%;
	}

	header span {
		color: var(--secondary-text-color);
	}

	#links span::before {
		content: '// ';
	}

	@media screen and (max-width: 550px) {
		#links span {
			display: block;
			margin: 0.6em 0;
		}
	}
</style>
