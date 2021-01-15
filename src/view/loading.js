import AbstractView from "./abstract";

const createNoEventTemplate = () => {
  return `<section class="trip-events">
  <h2 class="visually-hidden">Trip events</h2>
  loading
  <p class="trip-events__msg">Loading...</p>
</section>`;
};

export default class Loading extends AbstractView {
  getTemplate() {
    return createNoEventTemplate();
  }
}
