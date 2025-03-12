<script>
    import { page } from "$app/stores";
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
  
  <slot />