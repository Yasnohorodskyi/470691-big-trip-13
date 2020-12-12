import EventView from '../view/event';
import EventFormView from '../view/event-form';
import {render, replace} from "../utils/render";
import {ESC_BUTTON_CODE} from '../utils/button-codes';

export default class EventPresenter {
  constructor(eventListContainer) {
    this._eventListContainer = eventListContainer;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleCloseForm = this._handleCloseForm.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }

  init(event) {
    this._event = event;
    this._eventComponent = new EventView(event);
    this._eventFormComponent = new EventFormView(event);

    render(this._eventListContainer, this._eventComponent);

    this._eventComponent.setEditClickHandler(this._handleEditClick);
    this._eventFormComponent.setCloseFormHandler(this._handleCloseForm);
    this._eventFormComponent.setFormSubmitHandler(this._handleFormSubmit);
  }

  _replaceEventToForm() {
    replace(this._eventListContainer, this._eventFormComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceFormToEvent() {
    replace(this._eventListContainer, this._eventComponent, this._eventFormComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _handleEditClick() {
    this._replaceEventToForm();
  }

  _handleCloseForm() {
    this._replaceFormToEvent();
  }

  _handleFormSubmit() {
    this._replaceEventToForm();
  }

  _onEscKeyDown(evt) {
    if (evt.key === ESC_BUTTON_CODE) {
      evt.preventDefault();
      this._replaceFormToEvent();
    }
  }
}
