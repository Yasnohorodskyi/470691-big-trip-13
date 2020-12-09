import AbstractView from "./abstract";

const createMainMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn" href="#">Table</a>
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Stats</a>
    </nav>`
  );
};

export default class SiteMenu extends AbstractView {

  getTemplate() {
    return createMainMenuTemplate();
  }
}
