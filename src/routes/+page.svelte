<script src="global.js"></script>
<h1>Aigneis Frey</h1>
        <p>Hi! I'm an Aero/Astro student at MIT interested in autonomous systems, robotics, embedded systems, etc. I also love to run and ski! </p>
        <img src="images/skiing.jpeg" alt="Me skiing last year in Mammoth, CA!" />
        <h1>Featured Projects</h1>
        <div class="projects">
            {#each projects.slice(0, 3) as p}
            <Project data={p} hLevel="3" />
            {/each}
        </div>