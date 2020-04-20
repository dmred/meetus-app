<script>
  import { createEventDispatcher } from "svelte";
  import Modal from "./Modal.svelte";

  const dispatch = createEventDispatcher();

  export let message;
</script>

<Modal title="An error occured" on:cancel={() => dispatch('ignore')}>
  <p>{message}</p>
</Modal>
