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
      { url: "/my-portfolio/", title: "Home" },
      { url: "./projects", title: "Projects" },
      { url: "./contact", title: "Contact" },
      { url: "./resume", title: "Resume" }, 
      { url: "https://github.mit.edu/aafrey", title: "GitHub" }, 
    ];
  </script>
  
  <nav>
    {#each pages as p}
      <a
        href={p.url}
        class:current={$page.route.id === p.url}
        target={p.url.startsWith("http") ? "_blank" : null}
      >
        {p.title}
      </a>
    {/each}
  </nav>

  <!-- <label class="color-scheme">
		Theme:
		<select id="theme-selector">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="automatic">Automatic</option>
        </select>
	</label> -->

  <div class="color-scheme">
    <label for="theme-selector">Theme:</label>
    <select id="theme-selector" bind:value={colorScheme}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="automatic">Automatic</option>
    </select>
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
  </style>
  
  <slot />