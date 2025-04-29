<script>
    import * as d3 from 'd3';
    export let data = []; // Accept data as a prop
    export let selectedYear = null; // Bind this to filter projects by year

    let arcData;
    let arcs;

    // Create a pie generator
    let sliceGenerator = d3.pie().value(d => d.value);

    // Create an arc generator
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

    // Assign colors dynamically
    // let colors = d3.scaleOrdinal(d3.schemeTableau10);
    // Accessibility: update color scheme
    $: colors = d3.scaleOrdinal()
        .domain(data.map((_, i) => i))
        .range(d3.quantize(d3.interpolateBlues, data.length));

    // Make `arcData` and `arcs` reactive
    $: {
        arcData = sliceGenerator(data);
        arcs = arcData.map(d => ({
            path: arcGenerator(d),
            color: colors(d.index),
            label: data[d.index].label,
            value: data[d.index].value
        }));
    }
    
    
    // Allow us to click wedges
    export let selectedIndex = null;

    // Accessibility: add live announcment
    let liveText = "";

    /* Add toggle wedge helper function */
    function toggleWedge(index, event) {
        if (!event.key || event.key === "Enter") {
            selectedIndex = selectedIndex === index ? -1 : index;
            selectedYear = selectedIndex !== null ? data[index].label : null;
            const d = data[index];
		    liveText = `${d.label}: ${d.value} projects selected.`;
        }
    }

    // Accessibility: add computed variable to pie chart
    let description = '';
    $: description = `A pie chart showing project counts by year. ${data.map(d => `${d.label}: ${d.value} projects`).join(', ')}.`;

    // Accessibility: add option to display only table or pie chart
    let showChart = true;

    function toggleView() {
        showChart = !showChart;
        liveText = showChart ? "Pie chart view shown." : "Table view shown.";
    }

</script>

<!-- Accessibility: add button to toggle between pie chart and table -->
<button 
  on:click={toggleView}
  aria-pressed={!showChart}
  aria-label="Toggle between pie chart and table view"
  class="toggle-button">
    {showChart ? 'Show Table' : 'Show Chart'}
</button>

<!-- Container for Pie Chart and Legend -->
{#if showChart}
<div class="container">
    <!-- Pie Chart -->
    <svg viewBox="-50 -50 100 100"
        role="img"
        aria-labelledby="pie-title pie-desc"
    >
        <title id="pie-title">Projects by Year</title>
        <desc id="pie-desc">{description}</desc>
        <!-- Accessibility: outline pie chart -->
        <circle class="pie-outline" r="50" />
        {#each arcs as arc, index}
        <!-- Accessibility updates to path -->
        <path tabindex="0"
            role="button"
            aria-label={arc.label + ": " + arc.value}
            d={arc.path} 
            fill={selectedIndex === index ? "#ff1493" : arc.color} 
            class:selected={selectedIndex === index}
            on:click={(e) => toggleWedge(index, e)}

            on:keyup={(e) => toggleWedge(index, e)}
        />
        {/each}
    </svg>

    <!-- Accessibility: add live text between svg and div -->
    <p aria-live="polite" class="sr-only">{liveText}</p>

    <!-- Legend -->
    <div class="legend">
        <ul>
            {#each arcs as arc, index}
                <li 
                    style="--color: { colors(index) }"
                    class="{selectedIndex === index ? 'selected' : ''}" 
                    on:click={() => {selectedIndex = selectedIndex === index ? -1 : index
                        selectedYear = selectedIndex !== null ? arc.label : null; // Update year filtering
                    }}
                >
                    <span class="swatch" 
                        style="background-color: {selectedIndex === index ? '#ff1493' : arc.color};">
                    </span>
                    <span 
                        style="color: {selectedIndex === index ? '#ff1493' : 'var(--text-color, black)'};">
                        {arc.label}: {arc.value}
                    </span>
                </li>
            {/each}
        </ul>
    </div>
</div>
{:else}
    <!-- Accessibility: add tabular format -->
    <table aria-label="Table showing project counts by year" class="data-table">
        <caption>Projects by Year</caption>
        <thead>
            <tr>
            <th id="year-header" scope="col">Year</th>
            <th id="projects-header" scope="col">Projects</th>
            </tr>
        </thead>      
        <tbody>
            {#each data as d, i}
            <tr>
                <th id="row-{i}" scope="row">{d.label}</th>
                <td aria-labelledby="row-{i} projects-header">{d.value}</td>
            </tr>
            {/each}
        </tbody>
    </table>
{/if}

<style>
    /* Main container to align pie chart and legend */
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 30px;  /* Increase space between chart and legend */
        flex-wrap: wrap;  /* Ensures proper wrapping on smaller screens */
    }

    /* Make sure the SVG scales properly */
    svg {
        max-width: 250px;
        height: auto;
        flex-shrink: 0;
    }
    
    /* Light Mode */
    @media (prefers-color-scheme: light) {
        .legend {
            --bg-color: white;
            --text-color: black;
            --border-color: gray;
        }
    }

    /* Dark Mode */
    @media (prefers-color-scheme: dark) {
        .legend {
            --bg-color: black;
            --text-color: white;
            --border-color: white;
        }
    }

    .legend {
        border: 1px solid white;
        padding: 10px;
        background: white;
        color: black;
        min-width: 150px;
        text-align: left;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
        border-radius: 5px;
        padding: 10px;
    }

    .legend ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .legend li {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        padding: 5px;
        transition: all 0.3s ease-in-out;
        border-radius: 5px;
    }

    .swatch {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        display: inline-block;
        transition: opacity 0.3s ease-in-out;
    }

    /* Selected legend item */
    .legend li.selected span {
        font-weight: bold;
    }

    @media (max-width: 600px) {
        .container {
            flex-direction: column;
            align-items: center;
        }
    }

    .legend li {
    transition: all 0.3s ease-in-out;
}

/* Only fade items when a selection exists */
ul:has(.selected) li:not(.selected) {
    opacity: 0.4;  /* Reduced fading */
}

/* Highlight the selected legend item */
/* .legend li.selected {
    font-weight: bold;
    color: var(--selected-color, black);
    background-color: var(--bg-selected, lightgray);
} */

    /* Make responsive */
    @media (max-width: 600px) {
        .container {
            flex-direction: column; /* Stack on small screens */
            align-items: center;
        }
    }
    svg {
	max-width: 20em;
	margin-block: 2em;

	/* Do not clip shapes outside the viewBox */
	overflow: visible;
    }

    /* Hovering ability */
    svg:has(path:hover) path:not(:hover) {
        opacity: 50%;
        }
        path:hover {
        opacity: 100% !important;
    }   

    /* Hovering ability */
    svg:has(.selected) path:not(.selected) {
        opacity: 50%;
        }
        path:hover {
        opacity: 100% !important;
    } 

    /* add visual confirmation of which pie chart slice is selected */
    svg:hover path:not(:hover), svg:focus-visible path:not(:focus-visible) { opacity: 50%; }

    /* path:focus-visible {
        outline: 2px solid #ff1493;
    } */

    /* Apply smooth transitions to pie chart slices */
    path {
        transition: d 300ms ease-in-out, fill 300ms ease-in-out;
        outline: none; 
    }

    /* When a path is selected, make all non-selected paths 50% opacity */
    svg:has(.selected) path:not(.selected) {
    opacity: 50%;
    }

    path:focus-visible {
        stroke: white;
        stroke-width: 2px;
        stroke-dasharray: 4; /* Adjust the dash length as needed */
        outline: none !important;
    }

    .selected {
        --color: oklch(60% 45% 0) !important;
        
        &:is(path) {
            fill: var(--color) !important;
        }
        
        &:is(li) {
            color: var(--color);
        }
    }

     /* Accessibility: live text */
     .sr-only {
        position: absolute;
        left: -9999px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    }

    /* Add styling for table */
    .data-table {
        margin-top: 1rem;
        margin-bottom: 1rem;
        border-collapse: collapse;
        width: 100%;
        max-width: 30em;
    }

    .data-table caption {
        font-weight: bold;
        margin-bottom: 0.5em;
        text-align: left;
    }

    .data-table th,
    .data-table td {
        border: 1px solid #ccc;
        padding: 0.5em;
        text-align: left;
    }

    .data-table th {
        background-color: #f0f0f0;
    }
    
    /* Accessibility: add pie chart outline */
    .pie-outline {
        stroke: black;
        fill: none;
        stroke-width: 1;
    }

</style>