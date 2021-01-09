
import {generateEventList} from "./mock/event";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import SiteMenuView from "./view/menu";
import StatisticsView from "./view/stats";
import TripPresenter from "./presenter/trip";
import FilterPresenter from "./presenter/filter";
import EventsModel from "./model/events";
import FilterModel from "./model/filter";
import {sortByDate} from "./utils/sort";
import {render} from "./utils/render";
import {MenuItem} from "./utils/menu-item";
import {UpdateType} from "./utils/update-type";
import {FilterType} from "./utils/filter";

dayjs.extend(customParseFormat);

const eventsModel = new EventsModel();

const filterModel = new FilterModel();

const siteMenuComponent = new SiteMenuView();

const mainTripElement = document.querySelector(`.trip-main`);
const tripControlsElement = document.querySelector(`.trip-main__trip-controls`);
const tripEventsContainer = document.querySelector(`.trip-events`);
const pageBodyContainerElement = document.querySelector(`.page-main .page-body__container`);
const events = generateEventList();
const tripPresenter = new TripPresenter(mainTripElement, tripEventsContainer, eventsModel, filterModel);
const filterPresenter = new FilterPresenter(tripControlsElement, filterModel);

render(tripControlsElement, siteMenuComponent);

eventsModel.setEvents(events);
events.sort(sortByDate);

const statisticsComponent = new StatisticsView(eventsModel.getEvents());
render(pageBodyContainerElement, statisticsComponent);

tripPresenter.init();
filterPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createTask();
});

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      statisticsComponent.hide();
      tripPresenter.show();
      break;
    case MenuItem.STATISTICS:
      // tripPresenter.destroy();
      statisticsComponent.show();
      tripPresenter.hide();
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);


