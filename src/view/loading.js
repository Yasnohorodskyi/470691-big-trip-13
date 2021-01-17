import AbstractView from "./abstract";

const createNoEventTemplate = () => {
  return `<p class="trip-events__msg0">Loading...</p>`;
};

export default class Loading extends AbstractView {
  getTemplate() {
    return createNoEventTemplate();
  }
}
