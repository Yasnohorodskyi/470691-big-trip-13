import dayjs from "dayjs";

import SiteMenuView from "./view/menu";
import TripSortView from "./view/trip-sort";
import TaskListView from "./view/list.js";
import TripFiltersView from "./view/trip-filters";
import TripInfoView from "./view/trip-info";
import TripPriceView from "./view/trip-price";
import EventFormView from "./view/event-form";
import EventView from "./view/event";
import EmptyListView from "./view/list-empty";

import {generateEventList} from "./mock/event";

import {render, RenderPosition, replace} from "./utils/render";
import {ESC_BUTTON_CODE} from "./constants/button-codes";


const mainTripElement = document.querySelector(`.trip-main`);
render(mainTripElement, new TripInfoView(), RenderPosition.AFTERBEGIN);

const tripInfoElement = document.querySelector(`.trip-info`);
render(tripInfoElement, new TripPriceView(), RenderPosition.BEFOREEND);

const tripControlsElement = document.querySelector(`.trip-main__trip-controls`);
render(tripControlsElement, new SiteMenuView(), RenderPosition.BEFOREEND);
render(tripControlsElement, new TripFiltersView(), RenderPosition.BEFOREEND);

const tripEventsContainer = document.querySelector(`.trip-events`);
render(tripEventsContainer, new TripSortView(), RenderPosition.AFTERBEGIN);
render(tripEventsContainer, new TaskListView(), RenderPosition.BEFOREEND);

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

const renderEvent = (eventsListContainer, event) => {
  const eventComponent = new EventView(event);
  const eventFormComponent = new EventFormView(event);

  const replaceEventToForm = () => {
    replace(eventsListContainer, eventFormComponent, eventComponent);
  };

  const replaceFormToEvent = () => {
    replace(eventsListContainer, eventComponent, eventFormComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === ESC_BUTTON_CODE) {
      evt.preventDefault();
      replaceFormToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  eventComponent.setEditClickHandler(() => {
    replaceEventToForm();

    document.addEventListener(`keydown`, onEscKeyDown);
  });

  eventFormComponent.setCloseFormHandler(() => {
    replaceFormToEvent();

    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  eventFormComponent.setFormSubmitHandler(() => {
    replaceFormToEvent();
  });

  render(eventsListContainer, eventComponent, RenderPosition.BEFOREEND);
};

if (events.length === 0) {
  render(tripEventsListContainer, new EmptyListView(), RenderPosition.AFTERBEGIN);
} else {
  events.forEach((event) => {
    renderEvent(tripEventsListContainer, event);
  });
}

