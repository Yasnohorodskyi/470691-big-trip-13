import dayjs from "dayjs";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import {EVENT_TYPES} from "../utils/event-types";
import Smart from "./smart";

const DAYJS_DATE_FORMAT = `DD/MM/YY HH:mm`;

const createEventFormTemplate = (event = {}, allDestinations = [], isNewEvent = false) => {
  const {
    type = EVENT_TYPES[0],
    destinationName = ``,
    price = ``,
    offers = [],
    destinationInfo,
    isDisabled,
    isSaving,
    isDeleting
  } = event;

  const typesFragment = EVENT_TYPES.map((eventType) => (`
    <div class="event__type-item">
      <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${eventType === type ? `checked=""` : ``} ${isDisabled ? `disabled` : ``}>
      <label class="event__type-label  event__type-label--${eventType.toLowerCase()}" for="event-type-${eventType}-1">${eventType}</label>
    </div>
  `)).join(``);

  const destinationOptions = allDestinations.map((destination) => (`
    <option value="${destination.name}"></option>
  `)).join(``);

  const deleteButtonLabel = isDeleting ? `Deleting...` : `Delete`;

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? `disabled` : ``}>

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
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1" ${isDisabled ? `disabled` : ``}>
            <datalist id="destination-list-1">
              ${destinationOptions}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="" ${isDisabled ? `disabled` : ``}>
            —
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="" ${isDisabled ? `disabled` : ``}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              €
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}" min="1" ${isDisabled ? `disabled` : ``}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? `disabled` : ``}>${isSaving ? `Saving...` : `Save`}</button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? `disabled` : ``}>${isNewEvent ? `Cancel` : deleteButtonLabel}</button>
          ${isNewEvent ? `` : `<button class="event__rollup-btn" type="button" ${isDisabled ? `disabled` : ``}>
            <span class="visually-hidden">Open event</span>
          </button>`}
        </header>
        ${offers.length > 0 || destinationInfo ? `<section class="event__details">
          ${createOffersTemplate(offers, isDisabled)}

          ${createDestinationTemplate(destinationInfo)}
        </section>` : ``}
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

const createOffersTemplate = (offers, isDisabled) => {
  if (offers.length === 0) {
    return ``;
  }

  const offersFragment = offers.map((offer) => (`
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.name}-1" type="checkbox" name="event-offer-${offer.name}" ${offer.isSelected ? `checked=""` : ``} ${isDisabled ? `disabled` : ``}>
      <label class="event__offer-label" for="event-offer-${offer.name}-1">
        <span class="event__offer-title">${offer.name}</span>
        +€&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `)).join(``);

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersFragment}
      </div>
    </section>`
  );
};


const createPhotosTemplate = (photos) => {
  if (photos.length === 0) {
    return ``;
  }

  const photosFragment = photos.map((photo) => (`
    <img class="event__photo" src="${photo.src}" alt="${photo.description}">
  `)).join(``);

  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${photosFragment}
      </div>
    </div>`
  );
};

export default class EventForm extends Smart {
  constructor(event, allDestinations, isNew = false) {
    super();
    this._isEventCreationForm = isNew;
    this._data = EventForm.parseEventToData(event);
    this._startDatePicker = null;
    this._allDestinations = allDestinations;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._closeFormHandler = this._closeFormHandler.bind(this);
    this._eventTypeHandler = this._eventTypeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._destinationNameChangeHandler = this._destinationNameChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setStartDatePicker();
    this._setEndDatePicker();

    if (this._isEventCreationForm) {
      this._disableSaveButton(true);
    }
  }

  getTemplate() {
    return createEventFormTemplate(this._data, this._allDestinations, this._isEventCreationForm);
  }

  removeElement() {
    super.removeElement();

    if (this._startDatePicker && this._endDatePicker) {
      this._startDatePicker.destroy();
      this._endDatePicker.destroy();
      this._startDatePicker = null;
      this._endDatePicker = null;
    }
  }

  reset(event) {
    this.updateData(EventForm.parseEventToData(event), false);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setStartDatePicker();
    this._setEndDatePicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setTypeChangeHandler(this._callback.changeType);
    if (!this._isEventCreationForm) {
      this.setCloseFormHandler(this._callback.closeClick);
    }
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  setCloseFormHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._closeFormHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  setTypeChangeHandler(callback) {
    this._callback.changeType = callback;
    this.getElement().querySelectorAll(`[name="event-type"]`).forEach((typeButtonElement) => {
      typeButtonElement.addEventListener(`change`, this._eventTypeHandler);
    });
  }

  _getSelectedOffers() {
    return this._data.offers.map((offer) => {
      const offerIsSelected = this.getElement().querySelector(`[name="event-offer-${offer.name}"]`).checked;
      return Object.assign({}, offer, {isSelected: offerIsSelected});
    });
  }

  _closeFormHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    const startDateUnformatted = this.getElement().querySelector(`[name="event-start-time"]`).value;
    const startDate = dayjs(startDateUnformatted, DAYJS_DATE_FORMAT).format();
    const endDateUnformatted = this.getElement().querySelector(`[name="event-end-time"]`).value;
    const endDate = dayjs(endDateUnformatted, DAYJS_DATE_FORMAT).format();

    const newData = {
      price: +this.getElement().querySelector(`.event__input--price`).value,
      destinationName: this.getElement().querySelector(`.event__input--destination`).value,
      startDate,
      endDate,
      offers: this._getSelectedOffers(),
    };

    if (this._isEventCreationForm) {
      newData.type = this.getElement().querySelector(`.event__type-input:checked`).value;

      if (newData.price === null || undefined) {
        this.getElement().querySelector(`.event__save-btn`).setAttribute(`disabled`);
      }
    }

    this.updateData(newData);

    this._callback.formSubmit(this._data);
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`input`, this._destinationNameChangeHandler);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`input`, this._priceChangeHandler);
  }

  _setStartDatePicker() {
    if (this._startDatePicker) {
      this._startDatePicker.destroy();
      this._startDatePicker = null;
    }

    const config = {
      "dateFormat": `d/m/y H:i`,
      "defaultDate": dayjs(this._data.startDate).toDate(),
      "defaultHour": dayjs(this._data.startDate).hour(),
      "defaultMinute": dayjs(this._data.startDate).minute(),
      "enableTime": true,
      "time_24hr": true,
      "maxDate": dayjs(this._data.endDate).toDate(),
      "onChange": this._startDateChangeHandler
    };

    this._startDatePicker = flatpickr(this.getElement().querySelector(`[name="event-start-time"]`), config);
  }

  _startDateChangeHandler(selectedDates, startDate) {
    this._endDatePicker.set(`minDate`, startDate);
    this.updateData({
      startDate: dayjs(startDate, DAYJS_DATE_FORMAT).format()
    });
  }

  _setEndDatePicker() {
    if (this._endDatePicker) {
      this._endDatePicker.destroy();
      this._endDatePicker = null;
    }

    const config = {
      "dateFormat": `d/m/y H:i`,
      "defaultDate": dayjs(this._data.endDate).toDate(),
      "defaultHour": dayjs(this._data.endDate).hour(),
      "defaultMinute": dayjs(this._data.endDate).minute(),
      "enableTime": true,
      "time_24hr": true,
      "minDate": dayjs(this._data.startDate).toDate(),
      "onChange": this._endDateChangeHandler
    };

    this._endDatePicker = flatpickr(this.getElement().querySelector(`[name="event-end-time"]`), config);
  }

  _endDateChangeHandler(selectedDates, endDate) {
    this._startDatePicker.set(`maxDate`, endDate);
    this.updateData({
      endDate: dayjs(endDate, DAYJS_DATE_FORMAT).format()
    });
  }

  _eventTypeHandler(evt) {
    const type = evt.target.value;

    this.updateData({
      type: evt.target.value,
    }, false);
    this._callback.changeType(type);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EventForm.parseDataToEvent(this._data));
  }

  _destinationNameChangeHandler(evt) {
    const destinationInfo = this._getDestinationInfo(evt.target.value);
    const isDestinationNameValid = evt.target.value !== `` && destinationInfo;
    const price = this.getElement().querySelector(`.event__input--price`).value;
    const isPriceValid = +price > 0;

    if (isDestinationNameValid) {
      this.updateData({
        destinationInfo: {
          description: destinationInfo.description,
          photos: destinationInfo.pictures,
        },
        destinationName: destinationInfo.name,
        offers: this._getSelectedOffers(),
      }, false);
    }

    this._disableSaveButton(!isDestinationNameValid || !isPriceValid);
  }

  _priceChangeHandler(evt) {
    const price = +evt.target.value;
    const isPriceValid = price > 0;
    const destinationName = this.getElement().querySelector(`.event__input--destination`).value;
    const destinationInfo = this._getDestinationInfo(destinationName);
    const isDestinationNameValid = destinationName !== `` && destinationInfo;

    this._disableSaveButton(!isPriceValid || !isDestinationNameValid);

    if (isPriceValid) {
      this.updateData({
        price
      });
    }
  }

  _getDestinationInfo(name) {
    return this._allDestinations.find((destination) => destination.name === name);
  }

  _disableSaveButton(isDisabled) {
    if (isDisabled) {
      this.getElement().querySelector(`.event__save-btn`).setAttribute(`disabled`, `disabled`);
    } else {
      this.getElement().querySelector(`.event__save-btn`).removeAttribute(`disabled`);
    }
  }

  static parseEventToData(event) {
    return Object.assign({}, event, {
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    });
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}
