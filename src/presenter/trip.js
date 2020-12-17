import TripInfoView from "../view/trip-info";
import TripPriceView from "../view/trip-price";
import SiteMenuView from "../view/menu";
import TripFiltersView from "../view/trip-filters";
import TripSortView from "../view/trip-sort";
import EventListView from "../view/list.js";
import EmptyListView from "../view/list-empty";
import {render, RenderPosition} from "../utils/render";
import EventPresenter from "./event";
import {updateItem} from "../utils/common";
import {sortByDate, sortByDuration, sortByPrice} from "../utils/sort";
import {SortType} from "../utils/sort-type";

export default class TripPresenter {
  constructor(mainTripContainer, tripControlsContainer, tripEventsContainer) {
    this._mainTripContainer = mainTripContainer;
    this._tripControlsContainer = tripControlsContainer;
    this._tripEventsContainer = tripEventsContainer;
    this._eventPresenter = {};
    this._currentSortType = SortType.DAY;

    this._tripInfoComponent = new TripInfoView();
    this._tripPriceComponent = new TripPriceView();
    this._siteMenuComponent = new SiteMenuView();
    this._tripFiltersComponent = new TripFiltersView();
    this._tripSortComponent = new TripSortView();
    this._eventListComponent = new EventListView();
    this._emptyListComponent = new EmptyListView();

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(events) {
    this._events = events.slice();
    this._sourcedEvents = events.slice();

    render(this._mainTripContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    render(this._tripInfoComponent.getElement(), this._tripPriceComponent);
    render(this._tripControlsContainer, this._siteMenuComponent);
    render(this._tripControlsContainer, this._tripFiltersComponent);
    render(this._tripEventsContainer, this._eventListComponent);

    this._renderTripBoard();
  }

  _renderSort() {
    render(this._tripEventsContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
    this._tripSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderEvent(eventsListContainer, event) {
    const eventPresenter = new EventPresenter(eventsListContainer, this._handleEventChange, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderEventsList() {
    this._events.forEach((event) => {
      this._renderEvent(this._eventListComponent, event);
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

  _clearEventList() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};
  }

  _handleEventChange(updatedEvent) {
    this._events = updateItem(this._events, updatedEvent);
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
  }

  _handleModeChange() {
    Object.values(this._eventPresenter).forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (sortType === SortType.PRICE) {
      this._events.sort(sortByPrice);
    } else if (sortType === SortType.DAY) {
      this._events.sort(sortByDate);
    } else if (sortType === SortType.DURATION) {
      this._events.sort(sortByDuration);
    }

    this._clearEventList();
    this._renderEventsList();
  }

}


