import TripInfoView from "../view/trip-info";
import TripPriceView from "../view/trip-price";
import SiteMenuView from "../view/menu";
import TripFiltersView from "../view/trip-filters";
import TripSortView from "../view/trip-sort";
import EventListView from "../view/list.js";
import EmptyListView from "../view/list-empty";
import {remove, render, RenderPosition} from "../utils/render";
import EventPresenter from "./event";
import {sortByDate, sortByDuration, sortByPrice} from "../utils/sort";
import {SortType} from "../utils/sort-type";
import {UpdateType} from "../utils/update-type";
import {UserAction} from "../utils/user-action";

export default class TripPresenter {
  constructor(mainTripContainer, tripControlsContainer, tripEventsContainer, eventsModel) {
    this._mainTripContainer = mainTripContainer;
    this._tripControlsContainer = tripControlsContainer;
    this._tripEventsContainer = tripEventsContainer;
    this._eventsModel = eventsModel;
    this._eventPresenter = {};
    this._currentSortType = SortType.DAY;

    this._tripSortComponent = null;

    this._tripInfoComponent = new TripInfoView();
    this._tripPriceComponent = new TripPriceView();
    this._siteMenuComponent = new SiteMenuView();
    this._tripFiltersComponent = new TripFiltersView();
    this._eventListComponent = new EventListView();
    this._emptyListComponent = new EmptyListView();

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
  }

  init() {
    render(this._mainTripContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    render(this._tripInfoComponent.getElement(), this._tripPriceComponent);
    render(this._tripControlsContainer, this._siteMenuComponent);
    render(this._tripControlsContainer, this._tripFiltersComponent);
    render(this._tripEventsContainer, this._eventListComponent);

    this._renderTripBoard();
  }

  _renderSort() {
    if (this._tripSortComponent !== null) {
      this._tripSortComponent = null;
    }

    this._tripSortComponent = new TripSortView(this._currentSortType);
    this._tripSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripEventsContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEvent(eventsListContainer, event) {
    const eventPresenter = new EventPresenter(eventsListContainer, this._handleViewAction, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderEventsList() {
    this._getEvents().forEach((event) => {
      this._renderEvent(this._eventListComponent, event);
    });
  }

  _renderNoEvents() {
    render(this._eventListComponent.getElement(), this._emptyListComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripBoard() {
    const events = this._getEvents();
    // console.log(events)
    const eventCount = events.length;

    if (eventCount === 0) {
      this._renderNoEvents();
      return;
    }

    this._renderSort();
    this._renderEventsList();
  }

  _getEvents() {
    switch (this._currentSortType) {
      case SortType.DAY:
        return this._eventsModel.getEvents().slice().sort(sortByDate);
      case SortType.PRICE:
        return this._eventsModel.getEvents().slice().sort(sortByPrice);
      case SortType.DURATION:
        return this._eventsModel.getEvents().slice().sort(sortByDuration);
    }
    return this._eventsModel.getEvents();
  }

  _clearTripBoard({resetSortType = false} = {}) {
    Object.values(this._eventPresenter).forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};

    remove(this._tripSortComponent);
    remove(this._emptyListComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTripBoard();
        this._renderTripBoard();
        break;
      case UpdateType.MAJOR:
        this._clearTripBoard({resetSortType: true});
        this._renderTripBoard();
        break;
    }
  }

  _handleModeChange() {
    Object.values(this._eventPresenter).forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === SortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTripBoard();
    this._renderTripBoard();
  }

}


