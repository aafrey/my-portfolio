<!-- <script src="../global.js"></script> -->
<script>
    // src="../global.js"
    import projects from "$lib/projects.json";
    import Project from "$lib/Project.svelte"; // Import the component
  </script>
<h1> Projects</h1>
<div class="projects">
    {#each projects as p}
    <Project data={p} />
    {/each}
</div>