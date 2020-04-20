<script>
  import { createEventDispatcher } from "svelte";
  import meetups from "../../meetups-store.js";
  import Button from "../UI/Button.svelte";
  import Badge from "../UI/Badge.svelte";
  import LoadingSpinner from "../UI/LoadingSpinner.svelte";

  export let id, title, subtitle, imageUrl, description, address, email, isFav;

  let isLoading = false;

  const dispatch = createEventDispatcher();

  function toggleFavourite() {
    isLoading = true;
    fetch(`https://svelte-meetups-fdbaf.firebaseio.com/meetups/${id}.json`, {
      method: "PATCH",
      body: JSON.stringify({ isFavourite: !isFav }),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(
            "An error ocured while updating data. Please try again"
          );
        }
        meetups.toggleFavourite(id);
      })
      .catch(err => console.error(err))
      .finally(() => (isLoading = false));
  }
</script>

<style>
  article {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    border-radius: 5px;
    background: white;
    margin: 1rem;
  }

  header,
  .content,
  footer {
    padding: 1rem;
  }

  .image {
    width: 100%;
    height: 14rem;
  }

  .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  h1 {
    font-size: 1.25rem;
    margin: 0.5rem 0;
    font-family: "Roboto Slab", sans-serif;
  }

  h1.is-favorite {
    background: #01a129;
    color: white;
    padding: 0 0.5rem;
    border-radius: 5px;
  }

  h2 {
    font-size: 1rem;
    color: #808080;
    margin: 0.5rem 0;
  }

  p {
    font-size: 1.25rem;
    margin: 0;
  }

  div {
    text-align: right;
  }

  .content {
    height: 4rem;
  }
</style>

<article>
  <header>
    <h1>
      {title}
      {#if isFav}
        <Badge>FAVOURITE</Badge>
      {/if}
    </h1>
    <h2>{subtitle}</h2>
    <p>{address}</p>
  </header>
  <div class="image">
    <img src={imageUrl} alt={title} />
  </div>
  <div class="content">
    <p>{description}</p>
  </div>
  <footer>
    <Button mode="outline" type="button" on:click={() => dispatch('edit', id)}>
      Edit
    </Button>
    <Button href="/{id}">Show Details</Button>
    {#if isLoading}
      <span>Changing...</span>
      <!-- <LoadingSpinner /> -->
    {:else}
      <Button
        mode="outline"
        color={isFav ? null : 'success'}
        type="button"
        on:click={toggleFavourite}>
        {isFav ? 'Unfavourite' : 'Favourite'}
      </Button>
    {/if}
  </footer>
</article>
