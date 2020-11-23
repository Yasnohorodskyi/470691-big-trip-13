import {createTripInfoTemplate} from "./view/trip-info.js";
import {createMainMenuTemplate} from "./view/menu.js";
import {createTripFiltersTemplate} from "./view/trip-filters.js";
import {createTripSortTemplate} from "./view/trip-sort.js";
import {createListTemplate} from "./view/list.js";
import {createEventFormTemplate} from "./view/event-form.js";
import {createTripPriceTemplate} from "./view/trip-price.js";
import {createEventTemplate} from "./view/event";

import {generateEventList} from "./mock/event";

const events = generateEventList();

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const mainTripElement = document.querySelector(`.trip-main`);
render(mainTripElement, createTripInfoTemplate(), `afterbegin`);

const tripInfoElement = document.querySelector(`.trip-info`);
render(tripInfoElement, createTripPriceTemplate());

const tripControlsElement = document.querySelector(`.trip-main__trip-controls`);
render(tripControlsElement, createMainMenuTemplate());
render(tripControlsElement, createTripFiltersTemplate());

const tripEventsContainer = document.querySelector(`.trip-events`);
render(tripEventsContainer, createTripSortTemplate(), `afterbegin`);
render(tripEventsContainer, createListTemplate());

const tripEventsListContainer = document.querySelector(`.trip-events__list`);

render(tripEventsListContainer, createEventTemplate(events[0]), `afterbegin`);
render(tripEventsListContainer, createEventFormTemplate(events[0]), `afterbegin`);
render(tripEventsListContainer, createEventFormTemplate());

