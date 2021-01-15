
import Observer from "../utils/observer";

export default class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(updateType, events) {
    this._events = events.slice();

    this._notify(updateType);
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

    const adaptedEvent = Object.assign({}, {
      id: event.id,
      type: event.type,
      destinationName: event.destination.name,
      destinationInfo: {
        description: event.destination.description,
        photos: event.destination.pictures,
      },
      startDate: event.date_from,
      endDate: event.date_to,
      offers,
      price: event.base_price,
      isFavorite: event.is_favorite,
    });

    return adaptedEvent;
  }

  static adaptToServer(event) {
    const offers = event.offers.map((offer) => {
      return {
        "title": offer.name,
        "price": offer.price
      };
    });

    const adaptedEvent = Object.assign({}, {
      "base_price": event.price,
      "date_from": event.startDate,
      "date_to": event.endDate,
      "destination": {
        "description": event.destinationInfo.description,
        "name": event.destinationName,
        "pictures": event.destinationInfo.photos,
      },
      "id": event.id,
      "is_favorite": event.isFavorite,
      offers,
      "type": event.type
    });

    return adaptedEvent;
  }
}
