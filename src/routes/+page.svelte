<script>
        import projects from "$lib/projects.json";
        import Project from "$lib/Project.svelte"; // Import the component
</script><h1>Aigneis Frey</h1>
        <p>Hi! I'm an Aero/Astro student at MIT interested in autonomous systems, robotics, embedded systems, etc. I also love to run and ski! </p>
        <img src="images/skiing.jpeg" alt="Me skiing last year in Mammoth, CA!" />
        <h1>Featured Projects</h1>
        <div class="projects">
            {#each projects.slice(0, 3) as p}
            <Project data={p} hLevel="3" />
            {/each}
        </div>

        <style>
                /* Style the article container */
                article {
                    background-color: var(--border-gray, #eee);
                    padding: 1rem;
                    border-radius: 5px;
                    text-align: center;
                    font-weight: bold;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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