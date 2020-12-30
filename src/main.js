
import {generateEventList} from "./mock/event";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import TripPresenter from "./presenter/trip";
import EventsModel from "./model/events";
import {sortByDate} from "./utils/sort";

dayjs.extend(customParseFormat);

const mainTripElement = document.querySelector(`.trip-main`);
const tripControlsElement = document.querySelector(`.trip-main__trip-controls`);
const tripEventsContainer = document.querySelector(`.trip-events`);
const events = generateEventList();
const tripPresenter = new TripPresenter(mainTripElement, tripControlsElement, tripEventsContainer, eventsModel);

events.sort(sortByDate);
tripPresenter.init(events);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);
