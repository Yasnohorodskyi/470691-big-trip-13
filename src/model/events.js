
import Observer from "../utils/observer";

export default class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(events) {
    this._events = events.slice();
  }

  getEvents() {
    return this._events.slice();
  }

  updateEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting event`);
    }

    this._events = [
      ...this._events.slice(0, index),
      update,
      ...this._events.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this._events = [update, ...this._events];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting event`);
    }

    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(event) {
    const offers = event.offers.map((offer) => {
      return {
        type: offer.title, // TODO: check if the field is needed
        name: offer.title,
        price: offer.price,
        isSelected: false
      };
    });

    const adaptedEvent = Object.assign({}, event, {
      id: event.id,
      type: event.type,
      destinationName: event.destination.name,
      destinationInfo: event.destination.description,
      startDate: event.date_from,
      endDate: event.date_to,
      offers,
      price: event.base_price,
      isFavorite: event.is_favorite,
    });

    delete adaptedEvent.destination.name;
    delete adaptedEvent.destination.description;
    delete adaptedEvent.date_from;
    delete adaptedEvent.date_to;
    delete adaptedEvent.is_favorite;

    return adaptedEvent;
  }

  static adaptToServer(event) {
    const offers = event.offers.map((offer) => {
      return {
        "title": offer.name,
        "price": offer.price
      };
    });

    const adaptedEvent = Object.assign({}, event, {
      "id": event.id,
      "type": event.type,
      "destination": {
        "description": event.destinationInfo,
        "name": event.destinationName
      },
      "date_from": event.startDate,
      "date_to": event.endDate,
      offers,
      "base_price": event.price,
      "is_favorite": event.isFavorite,
    });

    delete adaptedEvent.destinationInfo;
    delete adaptedEvent.destinationName;
    delete adaptedEvent.startDate;
    delete adaptedEvent.endDate;
    delete adaptedEvent.isFavorite; // TODO: check if all fields are deleted

    return adaptedEvent;
  }
}
