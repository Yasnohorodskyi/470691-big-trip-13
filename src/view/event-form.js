import dayjs from "dayjs";
import {EVENT_TYPES} from "../utils/event-types";

import AbstractView from "./abstract";

const createEventFormTemplate = (event = {}) => {
  const {type = EVENT_TYPES[0], destinationName = ``, price = ``, offers = [], destinationInfo, startDate, endDate} = event;

  const DATE_FORMAT = `DD/MM/YY HH:MM`;
  const startDateFormatted = dayjs(startDate).format(DATE_FORMAT);
  const endDateFormatted = dayjs(endDate).format(DATE_FORMAT);

  const offersFragment = offers.map((offer) => (`
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.type}-1" type="checkbox" name="event-offer-${offer.type}" ${offer.isSelected ? `checked=""` : ``}>
      <label class="event__offer-label" for="event-offer-${offer.type}-1">
        <span class="event__offer-title">${offer.name}</span>
        +€&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `)).join(``);

  const typesFragment = EVENT_TYPES.map((eventType) => (`
    <div class="event__type-item">
      <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${eventType === type ? `checked=""` : ``}>
      <label class="event__type-label  event__type-label--${eventType.toLowerCase()}" for="event-type-${eventType}-1">${eventType}</label>
    </div>
  `)).join(``);


  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${typesFragment}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDateFormatted}">
            —
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDateFormatted}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              €
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">

          ${createOffersTemplate(offersFragment)}

          ${createDestinationTemplate(destinationInfo)}
        </section>
      </form>
    </li>`
  );
};

const createDestinationTemplate = (destinationInfo) => {
  if (!destinationInfo) {
    return ``;
  }

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destinationInfo.description}</p>
    ${createPhotosTemplate(destinationInfo.photos)}
    </section>`
  );
};

const createOffersTemplate = (offers) => {
  if (offers.length === 0) {
    return ``;
  }

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offers}
      </div>
    </section>`
  );
};


const createPhotosTemplate = (photos) => {
  if (photos.length === 0) {
    return ``;
  }

  const photosFragment = photos.map((photo) => (`
    <img class="event__photo" src="${photo}" alt="Event photo">
  `)).join(``);

  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${photosFragment}
      </div>
    </div>`
  );
};

export default class EventForm extends AbstractView {
  constructor(event) {
    super();

    this._event = event;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._closeFormHandler = this._closeFormHandler.bind(this);
  }

  getTemplate() {
    return createEventFormTemplate(this._event);
  }

  _closeFormHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  setCloseFormHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._closeFormHandler);
  }

}


