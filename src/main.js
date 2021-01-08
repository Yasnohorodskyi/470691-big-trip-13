
import {generateEventList} from "./mock/event";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import TripPresenter from "./presenter/trip";
import FilterPresenter from "./presenter/filter";
import EventsModel from "./model/events";
import FilterModel from "./model/filter";
import {sortByDate} from "./utils/sort";

dayjs.extend(customParseFormat);

const eventsModel = new EventsModel();

const filterModel = new FilterModel();

const mainTripElement = document.querySelector(`.trip-main`);
const tripControlsElement = document.querySelector(`.trip-main__trip-controls`);
const tripEventsContainer = document.querySelector(`.trip-events`);
const events = generateEventList();
const tripPresenter = new TripPresenter(mainTripElement, tripControlsElement, tripEventsContainer, eventsModel, filterModel);
const filterPresenter = new FilterPresenter(tripControlsElement, filterModel);

eventsModel.setEvents(events);
events.sort(sortByDate);

tripPresenter.init();
filterPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createTask();
});


