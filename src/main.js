import dayjs from "dayjs";

import {generateEventList} from "./mock/event";

import TripPresenter from "./presenter/trip";

const mainTripElement = document.querySelector(`.trip-main`);
const tripControlsElement = document.querySelector(`.trip-main__trip-controls`);
const tripEventsContainer = document.querySelector(`.trip-events`);
const events = generateEventList();
const tripPresenter = new TripPresenter(mainTripElement, tripControlsElement, tripEventsContainer);

tripPresenter.init(events);
// render event list from mocked data

events.sort((a, b) => {
  if (dayjs(a.startDate).isBefore(b.startDate)) {
    return -1;
  }

  if (dayjs(a.startDate).isAfter(b.startDate)) {
    return 1;
  }

  return 0;
});

