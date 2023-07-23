<script>
	import '../styles/global.css';

	if (typeof window !== 'undefined') {
		document.body.addEventListener(
			'touchmove',
			function (event) {
				event.preventDefault();
			},
			{ passive: false }
		);
	}
</script>

<nav>
	<a href="/">home</a>
	<a href="/about">about</a>
	<a href="/blog">blog</a> <a href="/modelViewer">modelViewer</a>
	<a href="/AR">ar</a>
	<a href="/THREE">three</a>
	<a href="/XState">xState</a>
</nav>
<main>
	<slot />
</main>
<footer>
	<p>footer</p>
</footer>

<style>
	nav {
		bottom: 0;
		width: 100%;
		position: fixed;
		background-color: #f1f1f1;
		padding: 20px;
		text-align: center;
		z-index: 99999;
	}
</style>
