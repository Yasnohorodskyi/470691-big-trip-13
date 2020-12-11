import AbstractView from "./abstract";

const createListTemplate = () => {
  return `<ul class="trip-events__list"></ul>`;
};

export default class TaskList extends AbstractView {

  getTemplate() {
    return createListTemplate();
  }
}
