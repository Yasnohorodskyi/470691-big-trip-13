import dayjs from "dayjs";

import SiteMenuView from "./view/menu";
import TripSortView from "./view/trip-sort";
import TaskListView from "./view/list.js";
import TripFiltersView from "./view/trip-filters";
import TripInfoView from "./view/trip-info";
import TripPriceView from "./view/trip-price";
import EventFormView from "./view/event-form";
import EventView from "./view/event";

import {generateEventList} from "./mock/event";

import {renderElement, RenderPosition} from "./utils/utils";


const mainTripElement = document.querySelector(`.trip-main`);
renderElement(mainTripElement, new TripInfoView().getElement(), RenderPosition.AFTERBEGIN);

const tripInfoElement = document.querySelector(`.trip-info`);
renderElement(tripInfoElement, new TripPriceView().getElement(), RenderPosition.BEFOREEND);

const tripControlsElement = document.querySelector(`.trip-main__trip-controls`);
renderElement(tripControlsElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
renderElement(tripControlsElement, new TripFiltersView().getElement(), RenderPosition.BEFOREEND);

const tripEventsContainer = document.querySelector(`.trip-events`);
renderElement(tripEventsContainer, new TripSortView().getElement(), RenderPosition.AFTERBEGIN);
renderElement(tripEventsContainer, new TaskListView().getElement(), RenderPosition.BEFOREEND);

const tripEventsListContainer = document.querySelector(`.trip-events__list`);

// render event list from mocked data

const events = generateEventList();
events.sort((a, b) => {
  if (dayjs(a.startDate).isBefore(b.startDate)) {
    return -1;
  }

  if (dayjs(a.startDate).isAfter(b.startDate)) {
    return 1;
  }

  return 0;
});

events.forEach((event, index) => {
  if (index === 0) {
    renderElement(tripEventsListContainer, new EventFormView(event).getElement(), RenderPosition.BEFOREEND);
  } else {
    renderElement(tripEventsListContainer, new EventView(event).getElement(), RenderPosition.BEFOREEND);
  }
});

