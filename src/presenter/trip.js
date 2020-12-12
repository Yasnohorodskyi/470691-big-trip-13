import TripInfoView from "../view/trip-info";
import TripPriceView from "../view/trip-price";
import SiteMenuView from "../view/menu";
import TripFiltersView from "../view/trip-filters";
import TripSortView from "../view/trip-sort";
import EventListView from "../view/list.js";
import EmptyListView from "../view/list-empty";
import EventView from "../view/event";
import EventFormView from "../view/event-form";
import {render, RenderPosition, replace} from "../utils/render";
import {ESC_BUTTON_CODE} from "../utils/button-codes";

export default class TripPresenter {
  constructor(mainTripContainer, tripControlsContainer, tripEventsContainer) {
    this._mainTripContainer = mainTripContainer;
    this._tripControlsContainer = tripControlsContainer;
    this._tripEventsContainer = tripEventsContainer;

    this._tripInfoComponent = new TripInfoView();
    this._tripPriceComponent = new TripPriceView();
    this._siteMenuComponent = new SiteMenuView();
    this._tripFiltersComponent = new TripFiltersView();
    this._tripSortComponent = new TripSortView();
    this._eventListComponent = new EventListView();
    this._emptyListComponent = new EmptyListView();
  }

  init(events) {
    this._events = events.slice();

    render(this._mainTripContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    render(this._tripInfoComponent.getElement(), this._tripPriceComponent);
    render(this._tripControlsContainer, this._siteMenuComponent);
    render(this._tripControlsContainer, this._tripFiltersComponent);
    render(this._tripEventsContainer, this._eventListComponent);

    this._renderTripBoard();
  }

  _renderSort() {
    render(this._tripEventsContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEvent(eventsListContainer, event) {
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

    render(eventsListContainer, eventComponent);
  }

  _renderEventsList() {
    this._events.forEach((event) => {
      this._renderEvent(this._eventListComponent.getElement(), event);
    });
  }

  _renderNoEvents() {
    render(this._eventListComponent.getElement(), this._emptyListComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripBoard() {
    if (this._events.length === 0) {
      this._renderNoEvents();
    } else {
      this._renderEventsList();
    }

    this._renderSort();
  }
}
