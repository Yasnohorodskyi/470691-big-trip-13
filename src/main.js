import dayjs from "dayjs";

import {generateEventList} from "./mock/event";

import TripPresenter from "./presenter/trip";

const mainTripElement = document.querySelector(`.trip-main`);
const tripControlsElement = document.querySelector(`.trip-main__trip-controls`);
const tripEventsContainer = document.querySelector(`.trip-events`);
const events = generateEventList();
const tripPresenter = new TripPresenter(mainTripElement, tripControlsElement, tripEventsContainer);

tripPresenter.init(events);
// render event list from mocked data

events.sort((a, b) => {
  if (dayjs(a.startDate).isBefore(b.startDate)) {
    return -1;
  }

  if (dayjs(a.startDate).isAfter(b.startDate)) {
    return 1;
  }

  return 0;
});

// const renderEvent = (eventsListContainer, event) => {
//   const eventComponent = new EventView(event);
//   const eventFormComponent = new EventFormView(event);

//   const replaceEventToForm = () => {
//     replace(eventsListContainer, eventFormComponent, eventComponent);
//   };

//   const replaceFormToEvent = () => {
//     replace(eventsListContainer, eventComponent, eventFormComponent);
//   };

//   const onEscKeyDown = (evt) => {
//     if (evt.key === ESC_BUTTON_CODE) {
//       evt.preventDefault();
//       replaceFormToEvent();
//       document.removeEventListener(`keydown`, onEscKeyDown);
//     }
//   };

//   eventComponent.setEditClickHandler(() => {
//     replaceEventToForm();

//     document.addEventListener(`keydown`, onEscKeyDown);
//   });

//   eventFormComponent.setCloseFormHandler(() => {
//     replaceFormToEvent();

//     document.removeEventListener(`keydown`, onEscKeyDown);
//   });

//   eventFormComponent.setFormSubmitHandler(() => {
//     replaceFormToEvent();
//   });

//   render(eventsListContainer, eventComponent, RenderPosition.BEFOREEND);
// };

// if (events.length === 0) {
//   render(tripEventsListContainer, new EmptyListView(), RenderPosition.AFTERBEGIN);
// } else {
//   events.forEach((event) => {
//     renderEvent(tripEventsListContainer, event);
//   });
// }

