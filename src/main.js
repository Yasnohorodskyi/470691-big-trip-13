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

import {ESC_BUTTON_CODE, renderElement, RenderPosition} from "./utils/utils";


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

const renderEvent = (eventsListContainer, event) => {
  const eventComponent = new EventView(event);
  const eventFormComponent = new EventFormView(event);

  const replaceEventToForm = () => {
    eventsListContainer.replaceChild(eventFormComponent.getElement(), eventComponent.getElement());
  };

  const replaceFormToEvent = () => {
    eventsListContainer.replaceChild(eventComponent.getElement(), eventFormComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
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

  renderElement(eventsListContainer, eventComponent.getElement(), RenderPosition.BEFOREEND);
};

if (events.length === 0) {
  renderElement(tripEventsListContainer, new EmptyListView().getElement(), RenderPosition.AFTERBEGIN);
} else {
  events.forEach((event) => {
    renderEvent(tripEventsListContainer, event);
  });
}

