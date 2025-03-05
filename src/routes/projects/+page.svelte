<!-- <script src="../global.js"></script> -->
<script>
    // src="../global.js"
    import projects from "$lib/projects.json";
    import Project from "$lib/Project.svelte"; // Import the component
  </script>
<h1>Featured Projects</h1>
<div class="projects">
    {#each projects.slice(0, 3) as p}
    <Project data={p} hLevel="3" />
    {/each}
</div>