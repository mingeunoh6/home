<script>
     import Title from '$lib/title.svelte';
let title = "Weather";

const updateTitle = ()=> {
    title = "Weather2";
}
</script>



<Title />
<h1>about post</h1>
<div class="index">
    <h1>{title}</h1>
    <button on:click={updateTitle}>chante title</button>
    <input type="text" bind:value={title}>
</div>


<style>



</style>