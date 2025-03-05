<!-- <script src="../global.js"></script> -->
<script>
    src="../global.js"
    import projects from "$lib/projects.json";
  </script>
<h1>Projects</h1>
<html lang="en", class = "home"></html>
        <div class="projects">
    {#each projects as p}
        <article>
            <h2>{p.title}</h2>
            <img src={p.image} alt="">
            <p>{p.description}</p>
        </article>
        {/each}
    </div>