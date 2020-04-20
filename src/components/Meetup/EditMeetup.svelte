<script>
  import meetups from "../../meetups-store.js";
  import { createEventDispatcher } from "svelte";
  import TextInput from "../UI/TextInput.svelte";
  import Button from "../UI/Button.svelte";
  import Modal from "../UI/Modal.svelte";
  import { isEmpty, isValidEmail } from "../../helpers/validation.js";

  export let id = null;

  let title = "",
    // titleValid = false,
    subtitle = "",
    // subtitleValid = false,
    description = "",
    // descriptionValid = false,
    imageUrl = "",
    // imageUrlValid = false,
    address = "",
    // addressValid = false,
    contactEmail = "";
  // contactEmailValid = false,
  // formValid = false;

  if (id) {
    const unsubscribe = meetups.subscribe(mts => {
      const selectedMeetup = mts.find(i => i.id === id);
      title = selectedMeetup.title;
      subtitle = selectedMeetup.subtitle;
      description = selectedMeetup.description;
      address = selectedMeetup.address;
      imageUrl = selectedMeetup.imageUrl;
      contactEmail = selectedMeetup.contactEmail;
    });

    unsubscribe();
  }

  $: titleValid = !isEmpty(title);
  $: subtitleValid = !isEmpty(subtitle);
  $: descriptionValid = !isEmpty(description);
  $: imageUrlValid = !isEmpty(imageUrl);
  $: addressValid = !isEmpty(address);
  $: contactEmailValid = !isEmpty(contactEmail) && isValidEmail(contactEmail);
  // $: contactEmailValid = isValidEmail(contactEmail);
  $: formValid =
    titleValid &&
    subtitleValid &&
    descriptionValid &&
    imageUrlValid &&
    addressValid &&
    contactEmailValid;

  const dispatch = createEventDispatcher();

  function submitForm() {
    const meetupData = {
      title: title,
      subtitle: subtitle,
      description: description,
      imageUrl: imageUrl,
      address: address,
      contactEmail: contactEmail
    };
    if (id) {
      fetch(`https://svelte-meetups-fdbaf.firebaseio.com/meetups/${id}.json`, {
        method: "PATCH",
        body: JSON.stringify(meetupData),
        headers: { "Content-Type": "application/json" }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(
              "An error ocured while updating data. Please try again"
            );
          }
          meetups.updateMeetup(id, meetupData);
        })
        .catch(err => consolee.error(err));
    } else {
      fetch("https://svelte-meetups-fdbaf.firebaseio.com/meetups.json", {
        method: "POST",
        body: JSON.stringify({ ...meetupData, isFavourite: false }),
        headers: { "content-type": "application/json" }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error("An error occured, please try again!");
          }
          return res.json();
        })
        .then(data =>
          meetups.addMeetup({
            id: data.name,
            ...meetupData,
            isFavourite: false
          })
        )
        .catch(err => console.error(err))
        .finally();
    }
    dispatch("save");
  }

  function deleteMeetup() {
    fetch(`https://svelte-meetups-fdbaf.firebaseio.com/meetups/${id}.json`, {
      method: "DELETE"
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(
            "An error ocured while updating data. Please try again"
          );
        }
        meetups.deleteMeetup(id);
      })
      .catch(err => console.error(err));

    dispatch("save");
  }

  function cancel() {
    dispatch("cancel");
  }
</script>

<style>
  form {
    width: 100%;
  }
</style>

<Modal title="Edit Meetup Data" on:cancel>
  <form on:submit|preventDefault={submitForm}>

    <TextInput
      id="title"
      label="Title"
      valid={titleValid}
      validityMessage="Please enter a valid title."
      value={title}
      on:input={event => (title = event.target.value)} />

    <TextInput
      id="subtitle"
      label="Subtitle"
      valid={subtitleValid}
      validityMessage="Please enter a valid subtitle."
      value={subtitle}
      on:input={event => (subtitle = event.target.value)} />
    <TextInput
      id="address"
      label="Address"
      valid={addressValid}
      validityMessage="Please enter a valid address."
      value={address}
      on:input={event => (address = event.target.value)} />
    <TextInput
      id="imageUrl"
      label="Image URL"
      valid={imageUrlValid}
      validityMessage="Please enter a valid imageUrl."
      value={imageUrl}
      on:input={event => (imageUrl = event.target.value)} />
    <TextInput
      id="contactEmail"
      label="Contact E-mail"
      valid={contactEmailValid}
      validityMessage="Please enter a valid contactEmail."
      type="email"
      value={contactEmail}
      on:input={event => (contactEmail = event.target.value)} />
    <TextInput
      controlType="textarea"
      rows="3"
      id="description"
      label="Description"
      valid={descriptionValid}
      validityMessage="Please enter a valid description."
      bind:value={description} />
  </form>
  <div slot="footer">
    <Button type="button" mode="outline" on:click={cancel}>Cancel</Button>
    <Button type="button" on:click={submitForm} disabled={!formValid}>
      Save
    </Button>
    {#if id}
      <Button type="button" on:click={deleteMeetup}>Delete</Button>
    {/if}
  </div>
</Modal>
