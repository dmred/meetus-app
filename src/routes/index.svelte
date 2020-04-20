<script context="module">
  export function preload(page) {
    console.log(page);

    return this.fetch(
      "https://svelte-meetups-fdbaf.firebaseio.com/meetups.json"
    )
      .then(res => {
        if (!res.ok) {
          throw new Error("Error while getting meetups");
        }
        return res.json();
      })
      .then(data => {
        const fetchedMeetups = [];
        for (const key in data) {
          fetchedMeetups.push({ id: key, ...data[key] });
        }

        return { fetchedMeetups: fetchedMeetups };

        // setTimeout(() => {
        //   isLoading = false;
        //   meetups.setMeetups(loadedMeetups);
        // }, 1000);
      })
      .catch(err => {
        error = err;
        isLoading = false;
        console.error(err);

        this.error(500, "Could not fetch meetups");
      });
  }
</script>

<script>
  import { createEventDispatcher, onMount, onDestroy } from "svelte";
  import { scale } from "svelte/transition";
  import { flip } from "svelte/animate";

  import MeetupItem from "../components/Meetup/MeetupItem.svelte";
  import MeetupFilter from "../components/Meetup/MeetupFilter.svelte";
  import Button from "../components/UI/Button.svelte";
  import EditMeetup from "../components/Meetup/EditMeetup.svelte";
  import LoadingSpinner from "../components/UI/LoadingSpinner.svelte";

  import meetups from "../meetups-store.js";

  export let fetchedMeetups;

  let loadedMeetups = [];
  let editMode = false;
  let editedId;
  let isLoading;
  let unsubscribe;

  const dispatch = createEventDispatcher();

  let favsOnly = false;

  $: filteredMeetups = favsOnly
    ? fetchedMeetups.filter(m => m.isFavourite)
    : fetchedMeetups;

  onMount(() => {
    meetups.set(fetchedMeetups);
    unsubscribe = meetups.subscribe(mts => (fetchedMeetups = mts));
  });

  onDestroy(() => {
    if (unsubscribe) unsubscribe();
  });

  function setFilter(event) {
    favsOnly = event.detail === 1;
  }

  function saveMeetup() {
    editMode = false;
    editedId = null;
  }

  function cancelEdit() {
    editMode = false;
    editedId = null;
  }

  function startEdit(event) {
    editMode = true;
    editedId = event.detail;
  }

  function startAdd() {
    editMode = true;
  }

  function clearError() {
    console.log("object");
    error = null;
  }
</script>

<style>
  #meetups {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
  }
  #meetup-controls {
    margin: 1rem;
    display: flex;
    justify-content: space-between;
  }

  @media (min-width: 768px) {
    #meetups {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  #no-meetups {
    margin: 1rem;
  }
</style>

<svelte:head>
  <title>MeetUS</title>
</svelte:head>

{#if editMode}
  <EditMeetup id={editedId} on:save={saveMeetup} on:cancel={cancelEdit} />
{/if}
{#if isLoading}
  <LoadingSpinner />
{:else}
  <section id="meetup-controls">
    <MeetupFilter on:select={setFilter} />
    <Button on:click={startAdd}>New Meetup</Button>
  </section>
  {#if filteredMeetups.length === 0}
    <p id="no-meetups">No meetups found, please add some!</p>
  {/if}
  <section id="meetups">
    {#each filteredMeetups as meetup (meetup.id)}
      <div animate:flip={{ duration: 500 }} transition:scale>
        <MeetupItem
          id={meetup.id}
          title={meetup.title}
          subtitle={meetup.subtitle}
          imageUrl={meetup.imageUrl}
          description={meetup.description}
          address={meetup.address}
          email={meetup.contactEmail}
          isFav={meetup.isFavourite}
          on:edit={startEdit} />
      </div>
    {/each}

  </section>
{/if}
