<script>
        import projects from "$lib/projects.json";
        import Project from "$lib/Project.svelte"; // Import the component

        import { onMount } from "svelte";

        let githubData = null;
        let loading = true;
        let error = null;

        onMount(async () => {
            try {
                const response = await fetch("https://api.github.com/users/aafrey");
                githubData = await response.json();
            } catch (err) {
                error = err;
            }
            loading = false;
        });
</script>
        <h1>Aigneis Frey</h1>
        <p>Hi! I'm an Aero/Astro student at MIT interested in autonomous systems, robotics, embedded systems, etc. I also love to run and ski! </p>
        <img src="images/skiing.jpeg" alt="Me skiing last year in Mammoth, CA!" />
        <h1>Featured Projects</h1>
        <div class="projects">
            {#each projects.slice(0, 3) as p}
            <Project data={p} hLevel="3" />
            {/each}
                
            <!-- GitHub Stats at the bottom -->
            <section class="stats">
                {#if loading}
                    <p>Loading...</p>
                {:else if error}
                    <p class="error">Something went wrong: {error.message}</p>
                {:else}
                    <section>
                        <h2>My GitHub Stats</h2>
                        <dl>
                            <dt>Followers</dt>
                            <dd>{githubData.followers}</dd>
                            <dt>Following</dt>
                            <dd>{githubData.following}</dd>
                            <dt>Public Repositories</dt>
                            <dd>{githubData.public_repos}</dd>
                        </dl>
                    </section>
                {/if}
                </section>
        </div>

        <style>
                /* Style the article container */
                .projects {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(15em, 1fr));
                gap: 1rem;
                padding: 1rem;
                align-items: start;
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