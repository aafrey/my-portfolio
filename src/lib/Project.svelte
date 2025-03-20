<script>
    export let data = {}; // Accepts a project object as a prop
    export let hLevel = 2;
</script>

<article>
    <!-- Display the project title -->
    <svelte:element this={"h" + hLevel}>{data.title}</svelte:element>
    <!-- Display the project image -->
    <img src={data.image} alt="{data.title} project image" /> 
    <!-- Wrap description and year in a div for styling -->
    <div class="project-info">
        <p>{data.description}</p>
        {#if data.year}
            <p class="project-year">c. {data.year}</p>
        {/if}
    </div>
</article>

<style>
    /* Style the article container */
    article {
    background-color: var(--border-gray, #eee);
    padding: 1rem;
    border-radius: 5px;
    text-align: center;
    font-weight: bold;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    width: 100%; /* Ensures it fits inside the grid column */
}
    
    /* Ensure images scale properly */
    img {
        width: 100%;
        height: auto;
        object-fit: cover;
    }
    
    /* Heading styles */
    h1, h2, h3, h4 {
        margin: 0;
    }
    
    /* Keep text aligned properly */
    p {
        margin-top: 0;
        font-weight: normal;
    }
    </style>