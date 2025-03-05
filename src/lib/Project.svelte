<script>
    export let data = {}; // Accepts a project object as a prop
</script>

<article>
    <h2>{data.title}</h2>
    <img src={data.image} alt="Project image">
    <p>{data.description}</p>
</article>