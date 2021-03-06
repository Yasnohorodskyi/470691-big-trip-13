import {MenuItem} from "../const";
import AbstractView from "./abstract";

const createSiteMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn trip-tabs__btn--active" href="#" id="${MenuItem.TABLE}">Table</a>
      <a class="trip-tabs__btn" href="#" id="${MenuItem.STATISTICS}">Stats</a>
    </nav>`
  );
};

export default class Menu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  setMenuItem(menuItemId) {
    const activeItem = this.getElement().querySelector(`#${menuItemId}`);
    activeItem.classList.add(`trip-tabs__btn--active`);

    const inactiveItemId = menuItemId === MenuItem.STATISTICS ? MenuItem.TABLE : MenuItem.STATISTICS;
    this.getElement().querySelector(`#${inactiveItemId}`).classList.remove(`trip-tabs__btn--active`);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();

    const isCurrentItemActive = evt.target.classList.contains(`trip-tabs__btn--active`);

    if (evt.target.nodeName === `A` && !isCurrentItemActive) {
      this._callback.menuClick(evt.target.id);
      this.setMenuItem(evt.target.id);
    }
  }
}
