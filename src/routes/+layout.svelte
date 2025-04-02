<script>
  import { page } from "$app/stores";
  let localStorage = globalThis?.localStorage ?? {}; // Access localStorage safely
  let colorScheme = localStorage.colorScheme ?? "light dark"; // Set default if no saved theme
  
  let root = globalThis?.document?.documentElement;

  // Reactive update for color scheme
  $: root?.style.setProperty("color-scheme", colorScheme);
  
  // Save color scheme to localStorage whenever it changes
  $: localStorage.colorScheme = colorScheme;

  let pages = [
  { url: "./", title: "Home" },  // Will resolve correctly based on the base path
  { url: "./projects", title: "Projects" },
  { url: "./contact", title: "Contact" },
  { url: "./resume", title: "Resume" },
  { url: "./meta", title: "Meta" },
  { url: "https://github.mit.edu/aafrey", title: "GitHub" }
];

  // Fetch GitHub data
  let githubStats = fetch("https://api.github.com/users/aafrey")
    .then(response => response.json())
    .catch(error => ({ error: error.message }));
</script>

<nav>
  {#each pages as p}
    <a
    href={p.url}
    class:active={"."+$page.route.id === p.url}
    target={p.url.startsWith("http") ? "_blank" : null}
    >
      {p.title}
    </a>
  {/each}
</nav>

<div class="color-scheme">
  <label for="theme-selector">Theme:</label>
  <select id="theme-selector" bind:value={colorScheme}>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
    <option value="automatic">Automatic</option>
  </select>
</div>

<div class="content-wrapper">
  <!-- Other content of page goes here -->
  <slot />
</div>

<style>
  .color-scheme {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 10;
  }

  label {
    font-size: 14px;
    font-weight: bold;
  }

  select {
    padding: 5px;
    font-size: 14px;
    border-radius: 5px;
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .github-stats {
    margin-top: auto; /* Pushes the stats to the bottom */
    padding: 20px;
    background-color: #f0f0f0;
  }
</style>