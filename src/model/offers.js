import Observer from "../utils/observer";

export default class Offers extends Observer {
  constructor() {
    super();
    this._offers = [];
  }

  setOffers(updateType, offers) {
    this._offers = offers;
    this._notify(updateType, offers);
  }

  getOffers() {
    return this._offers;
  }

  getOffersByType(type) {
    return this._offers.find((offersList) => offersList.type === type.toLowerCase()).offers;
  }

  static adaptAllToClient(offersByType) {
    return Object.assign({}, {
      type: offersByType.type,
      offers: offersByType.offers.map(Offers.adaptToClient)
    });
  }

  static adaptToClient(offer) {
    return Object.assign({}, {
      name: offer.title,
      price: offer.price,
      isSelected: false
    });
  }

  static adaptToServer(offer) {
    return Object.assign({}, {
      title: offer.name,
      price: offer.price
    });
  }
}
