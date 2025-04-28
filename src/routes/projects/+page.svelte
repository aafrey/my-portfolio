<!-- <script src="../global.js"></script> -->
<script>
    // src="../global.js"
    import projects from "$lib/projects.json";
    import Project from "$lib/Project.svelte"; // Import the component
    import Pie from '$lib/Pie.svelte'; // import Pie per 1.1
    import * as d3 from 'd3';

    // Declare variable to hold search query
    let query = "";
    let selectedYear = null;

    // Group projects by year and count occurrences
    let rolledData = d3.rollups(projects, v => v.length, d => d.year);
  // Update filtering logic to include selectedYear
  let pieData;
    $: {
        pieData = rolledData.map(([year, count]) => ({
            value: count,
            label: year
        }));
    }
  $: filteredProjects = projects.filter(project => {
        let values = Object.values(project).join("\n").toLowerCase();
        return (!selectedYear || project.year === selectedYear) && 
               values.includes(query.toLowerCase());
    });

    let selectedYearIndex = -1;

    // Update selectedYear whenever a pie slice is selected
    $: selectedYear = selectedYearIndex > -1 ? pieData[selectedYearIndex].label : null;
  </script>
<h1> Projects</h1>

<!-- Search bar -->
<!-- <input type="search" bind:value={query}
       aria-label="Search projects"
       placeholder="🔍 Search projects..." /> -->
<div class="search-wrapper">
  <span aria-hidden="true" class="emoji">🔍</span>
  <input 
    type="search" 
    bind:value={query}
    aria-label="Search projects"
    placeholder="Search projects…" />
</div>

<Pie data={pieData} bind:selectedIndex={selectedYearIndex} />

<div class="projects">
    {#each filteredProjects as p}
    <Project data={p} />
    {/each}
</div>

<style>
  /* Search bar style: Make input full width */
  input[type="search"] {
      width: 100%;
      padding: 10px;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-bottom: 10px;
      padding-left: 2rem;
      
  }
  .search-wrapper {
  position: relative;
}
.emoji {
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 1rem;
}


</style>