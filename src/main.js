import {createTripInfoTemplate} from "./view/trip-info.js";
import {createMainMenuTemplate} from "./view/menu.js";
import {createTripFiltersTemplate} from "./view/trip-filters.js";
import {createTripSortTemplate} from "./view/trip-sort.js";
import {createPointTemplate} from "./view/list.js";
import {createFormEditTemplate} from "./view/form-edit.js";
import {createFormAddTemplate} from "./view/form-create.js";
import {createTripPriceTemplate} from "./view/trip-price.js";

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const mainTripElement = document.querySelector(`.trip-main`);
render(mainTripElement, createTripInfoTemplate(), `afterbegin`);

const tripInfoElement = document.querySelector(`.trip-info`);
render(tripInfoElement, createTripPriceTemplate(), `beforeend`);

const tripControlsElement = document.querySelector(`.trip-main__trip-controls`);
render(tripControlsElement, createMainMenuTemplate(), `beforeend`);
render(tripControlsElement, createTripFiltersTemplate(), `beforeend`);

const tripEventsContainer = document.querySelector(`.trip-events`);
render(tripEventsContainer, createTripSortTemplate(), `afterbegin`);
render(tripEventsContainer, createPointTemplate(), `beforeend`);

const tripEventsListContainer = document.querySelector(`.trip-events__list`);
render(tripEventsListContainer, createFormEditTemplate(), `afterbegin`);
render(tripEventsListContainer, createFormAddTemplate(), `beforeend`);

