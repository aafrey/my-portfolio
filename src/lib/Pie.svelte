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
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

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

</script>

<!-- Container for Pie Chart and Legend -->
<div class="container">
    <!-- Pie Chart -->
    <svg viewBox="-50 -50 100 100">
        {#each arcs as arc, index}
        <path 
            d={arc.path} 
            fill={selectedIndex === index ? "#ff1493" : arc.color} 
            class:selected={selectedIndex === index}
            on:click={() => {
                selectedIndex = selectedIndex === index ? -1 : index
                selectedYear = selectedIndex !== null ? arc.label : null; // Update year filtering
            }}
        />
        {/each}
    </svg>

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
    /* Apply smooth transitions to pie chart slices */
    path {
        transition: d 300ms ease-in-out, fill 300ms ease-in-out;
    }

    /* When a path is selected, make all non-selected paths 50% opacity */
    svg:has(.selected) path:not(.selected) {
    opacity: 50%;
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
</style>