<script>
    import { page } from "$app/stores";
    let colorScheme = "light dark"; // Initialize the color scheme
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

  <label class="color-scheme">
		Theme:
		<select id="theme-selector">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="automatic">Automatic</option>
        </select>
	</label>

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