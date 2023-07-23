
export async function load({ fetch, params }) {
	const res = await fetch('https://jsonplaceholder.typicode.com/posts');
	const posts = await res.json();

 
const blogPosts =  posts.find((post) => post.id === Number(params.slug));
	if (res.ok) {
		return {
			props: { blogPosts }
		};
	}

	return {
		status: res.status,
		error: new Error(`Could not load posts`)
	};
}
