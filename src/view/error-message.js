import AbstractView from "./abstract";

const createErrorMessageTemplate = () => {
  return `<p class="trip-events__msg trip-events__msg--error">Error occurred while fetching data, please refresh the page.</p>`;
};

export default class ErrorMessage extends AbstractView {
  getTemplate() {
    return createErrorMessageTemplate();
  }
}
