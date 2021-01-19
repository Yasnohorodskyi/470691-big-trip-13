import TripInfoView from "../view/trip-info";
import TripPriceView from "../view/trip-price";
import TripSortView from "../view/trip-sort";
import EventListView from "../view/list.js";
import EmptyListView from "../view/list-empty";
import {remove, render, RenderPosition} from "../utils/render";
import EventPresenter from "./event";
import EventNewPresenter from "./event-new";
import LoadingView from "../view/loading";
import {sortByDate, sortByDuration, sortByPrice} from "../utils/sort";
import {SortType} from "../utils/sort-type";
import {UpdateType} from "../utils/update-type";
import {UserAction} from "../utils/user-action";
import {filter} from "../utils/filter";
import {FilterType} from "../utils/filter";
import {EVENT_TYPES} from "../utils/event-types";

export default class TripPresenter {
  constructor(mainTripContainer, tripEventsContainer, eventsModel, filterModel, offersModel, destinationsModel, api) {
    this._mainTripContainer = mainTripContainer;
    this._tripEventsContainer = tripEventsContainer;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._eventPresenter = {};
    this._currentSortType = SortType.DAY;
    this._isLoading = true;
    this._api = api;

    this._tripSortComponent = null;

    this._tripInfoComponent = new TripInfoView();
    this._tripPriceComponent = new TripPriceView();
    this._eventListComponent = new EventListView();
    this._emptyListComponent = new EmptyListView();
    this._loadingComponent = new LoadingView();

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);

    this._eventNewPresenter = new EventNewPresenter(this._eventListComponent, this._handleViewAction, this._offersModel, this._destinationsModel);
  }

  init() {
    render(this._tripEventsContainer, this._eventListComponent);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderTripBoard();
  }

  destroy() {
    this._clearTripBoard({resetSortType: true});

    remove(this._eventListComponent);
    remove(this._tripSortComponent);

    this._eventsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  show() {
    this._tripEventsContainer.classList.remove(`hide`);
  }

  hide() {
    this._tripEventsContainer.classList.add(`hide`);
  }

  _renderSort() {
    if (this._tripSortComponent !== null) {
      this._tripSortComponent = null;
    }

    this._tripSortComponent = new TripSortView(this._currentSortType);
    this._tripSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripEventsContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
  }

  _getEventWithOffers(event) {
    const offersForType = this._offersModel.getOffersByType(event.type);
    const offers = offersForType.map((offer) => {
      const localOffer = event.offers.find(({name}) => name === offer.name);
      return Object.assign({}, offer, {
        isSelected: localOffer ? localOffer.isSelected : false
      });
    });

    return Object.assign({}, event, {
      offers
    });
  }

  _renderEvent(eventsListContainer, event) {
    const eventPresenter = new EventPresenter(eventsListContainer, this._handleViewAction, this._handleModeChange, this._offersModel, this._destinationsModel);
    eventPresenter.init(this._getEventWithOffers(event));
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
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const events = this._getEvents();
    const eventCount = events.length;

    if (eventCount === 0) {
      this._renderNoEvents();
      return;
    }

    render(this._mainTripContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    render(this._tripInfoComponent.getElement(), this._tripPriceComponent);
    this._renderSort();
    this._renderEventsList();
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filteredEvents = filter[filterType](events);

    switch (this._currentSortType) {
      case SortType.DAY:
        return filteredEvents.slice().sort(sortByDate);
      case SortType.PRICE:
        return filteredEvents.slice().sort(sortByPrice);
      case SortType.DURATION:
        return filteredEvents.slice().sort(sortByDuration);
    }
    return filteredEvents;
  }

  _clearTripBoard({resetSortType = false} = {}) {
    this._eventNewPresenter.destroy();
    Object.values(this._eventPresenter).forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};

    remove(this._tripSortComponent);
    remove(this._emptyListComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _renderLoading() {
    render(this._tripEventsContainer, this._loadingComponent);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._api.updateEvent(update).then((response) => {
          this._eventsModel.updateEvent(updateType, this._getEventWithOffers(response));
        });
        break;
      case UserAction.ADD_EVENT:
        this._api.addEvent(update).then((response) => {
          this._eventsModel.addEvent(updateType, this._getEventWithOffers(response));
        });
        break;
      case UserAction.DELETE_EVENT:
        this._api.deleteEvent(update).then(() => {
          this._eventsModel.deleteEvent(updateType, update);
        });
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
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTripBoard();
        break;
    }
  }

  _handleModeChange() {
    this._eventNewPresenter.destroy();
    Object.values(this._eventPresenter).forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTripBoard();
    this._renderTripBoard();
  }

  createEvent() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    const newEvent = {
      type: EVENT_TYPES[0], destinationName: ``, price: ``, offers: [], destinationInfo: null
    };
    this._eventNewPresenter.init(this._getEventWithOffers(newEvent));
  }
}


