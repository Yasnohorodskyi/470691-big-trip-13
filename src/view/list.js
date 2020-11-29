import {createElement} from "../utils/utils";

const createListTemplate = () => {
  return `<ul class="trip-events__list"></ul>`;
};

export default class TaskList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createListTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
