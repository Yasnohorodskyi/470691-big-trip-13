import TripInfoView from "../view/trip-info";
import TripPriceView from "../view/trip-price";
import SiteMenuView from "../view/menu";
import TripFiltersView from "../view/trip-filters";
import TripSortView from "../view/trip-sort";
import EventListView from "../view/list.js";
import EmptyListView from "../view/list-empty";
import {render, RenderPosition} from "../utils/render";
import EventPresenter from "./event";

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
    const eventPresenter = new EventPresenter(eventsListContainer);
    eventPresenter.init(event);
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
