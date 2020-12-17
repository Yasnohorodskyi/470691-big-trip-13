
import {generateEventList} from "./mock/event";

import TripPresenter from "./presenter/trip";
import {sortByDate} from "./utils/sort";

const mainTripElement = document.querySelector(`.trip-main`);
const tripControlsElement = document.querySelector(`.trip-main__trip-controls`);
const tripEventsContainer = document.querySelector(`.trip-events`);
const events = generateEventList();
const tripPresenter = new TripPresenter(mainTripElement, tripControlsElement, tripEventsContainer);

events.sort(sortByDate);
tripPresenter.init(events);
// render event list from mocked data


