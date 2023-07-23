<script>
export let data;

</script>

<div>
    <h1>Blog + Page</h1>
    <p>Blog + Page</p>
</div>

<div>
    {#each data.props.posts as post}
    <li><a href="/blog/{post.id}">{post.title}</a></li>
      
    {/each}
</div>

<style>

</style>