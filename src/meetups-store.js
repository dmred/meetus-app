import { writable } from "svelte/store";

let nextId = 3;

const meetups = writable([]);

const customMeetupsStore = {
  subscribe: meetups.subscribe,
  set: meetups.set,
  setMeetups: (meetupsArray) => {
    meetups.set(meetupsArray);
  },
  addMeetup: (meetupData) => {
    const newMeetup = {
      //id: nextId++,
      ...meetupData,
      //isFavourite: false,
    };
    meetups.update((mts) => (mts = [...mts, newMeetup]));
  },
  updateMeetup: (id, meetupData) => {
    meetups.update((mts) => {
      const meetupIndex = mts.findIndex((i) => i.id === id);
      const updatedMeetup = { ...mts[meetupIndex], ...meetupData };
      const updatedMeetups = [...mts];
      updatedMeetups[meetupIndex] = updatedMeetup;
      return updatedMeetups;
    });
  },
  deleteMeetup: (id) => {
    meetups.update((mts) => {
      return mts.filter((i) => i.id !== id);
    });
  },
  toggleFavourite: (id) => {
    meetups.update((mts) => {
      const updatedMeetups = [...mts];

      const meetupToUpdate = updatedMeetups.find((e) => e.id === id);
      meetupToUpdate.isFavourite = !meetupToUpdate.isFavourite;
      const meetupToUpdateIndex = updatedMeetups.find((e) => e.id === id);
      updatedMeetups[meetupToUpdateIndex] = meetupToUpdate;
      return updatedMeetups;
    });
  },
};

export default customMeetupsStore;
