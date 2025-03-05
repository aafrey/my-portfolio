<!-- <script src="../global.js"></script> -->
<script>
    // src="../global.js"
    import projects from "$lib/projects.json";
    import Project from "$lib/Project.svelte"; // Import the component
  </script>
<h1>{ projects.length } Projects</h1>
<!-- <div class="projects">
    {#each projects as p}
        <Project data={p} />
    {/each}
</div> -->
<div class="projects">
    {#each projects.slice(0, 3) as p}
        <Project data={p} />
    {/each}
</div>

<!-- 

<html lang="en", class = "home"></html>
        <div class="projects">
    {#each projects as p}
        <article>
            <h2>{p.title}</h2>
            <img src={p.image} alt="">
            <p>{p.description}</p>
        </article>
        {/each}
    </div> -->