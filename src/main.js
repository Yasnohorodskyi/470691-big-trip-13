
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import SiteMenuView from "./view/menu";
import StatisticsView from "./view/stats";
import TripPresenter from "./presenter/trip";
import FilterPresenter from "./presenter/filter";
import EventsModel from "./model/events";
import FilterModel from "./model/filter";
import OffersModel from "./model/offers";
import {sortByDate} from "./utils/sort";
import {remove, render} from "./utils/render";
import {MenuItem} from "./utils/menu-item";
import {UpdateType} from "./utils/update-type";
import {FilterType} from "./utils/filter";
import Api from "./api";
import {disableNewEventButton} from "./utils/common";
import DestinationsModel from "./model/destinations";

dayjs.extend(customParseFormat);

const AUTHORIZATION = `Basic dkggfgfflpr0gghhb`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const eventsModel = new EventsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const siteMenuComponent = new SiteMenuView();

const mainTripElement = document.querySelector(`.trip-main`);
const tripControlsElement = document.querySelector(`.trip-main__trip-controls`);
const tripEventsContainer = document.querySelector(`.trip-events`);
const pageBodyContainerElement = document.querySelector(`.page-main .page-body__container`);
const api = new Api(END_POINT, AUTHORIZATION);
const tripPresenter = new TripPresenter(mainTripElement, tripEventsContainer, eventsModel, filterModel, offersModel, destinationsModel, api);
const filterPresenter = new FilterPresenter(tripControlsElement, filterModel);

tripPresenter.init();

let statisticsComponent = null;

Promise.allSettled([api.getEvents(), api.getDestinations(), api.getOffers()]).then(([events, destinations, offers]) => {
  if (offers.status === `rejected` || destinations.status === `rejected`) {
    disableNewEventButton(true);
    tripPresenter.setError();
    throw new Error(`Failed to fetch destinations or offers`);
  }

  destinationsModel.setDestinations(UpdateType.INIT, destinations.value);
  offersModel.setOffers(UpdateType.INIT, offers.value);
  disableNewEventButton(false);

  if (events.status === `rejected`) {
    throw new Error(`Failed to fetch points`);
  }

  eventsModel.setEvents(UpdateType.INIT, events.value);
  events.value.sort(sortByDate);
  render(tripControlsElement, siteMenuComponent);
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  filterPresenter.init();
})
  .catch((e) => {
    eventsModel.setEvents(UpdateType.INIT, []);
    throw e;
  });

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, () => {
  tripPresenter.createEvent();
});

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.show();
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      tripPresenter.hide();
      statisticsComponent = new StatisticsView(eventsModel.getEvents());
      render(pageBodyContainerElement, statisticsComponent);
      break;
  }
};
