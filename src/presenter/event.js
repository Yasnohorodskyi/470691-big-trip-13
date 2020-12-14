import EventView from '../view/event';
import EventFormView from '../view/event-form';
import {render, replace, remove} from "../utils/render";
import {ESC_BUTTON_CODE} from '../utils/button-codes';

export default class EventPresenter {
  constructor(eventListContainer, changeData) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;

    this._eventComponent = null;
    this._eventFormComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleCloseForm = this._handleCloseForm.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(event) {
    const prevEventComponent = this._eventComponent;
    const prevFormComponent = this._eventFormComponent;

    this._event = event;
    this._eventComponent = new EventView(event);
    this._eventFormComponent = new EventFormView(event);

    this._eventComponent.setEditClickHandler(this._handleEditClick);
    this._eventFormComponent.setCloseFormHandler(this._handleCloseForm);
    this._eventFormComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventComponent.setFavoriteClick(this._handleFavoriteClick);

    if (prevEventComponent === null || prevFormComponent === null) {
      render(this._eventListContainer, this._eventComponent);
      return;
    }

    if (this._eventListContainer.getElement().contains(prevEventComponent.getElement())) {
      replace(this._eventListContainer, this._eventComponent, prevEventComponent);
    }

    if (this._eventListContainer.getElement().contains(prevFormComponent.getElement())) {
      replace(this._eventListContainer, this._eventFormComponent, prevFormComponent);
    }

    remove(prevEventComponent);
    remove(prevFormComponent);

  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventFormComponent);
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

  _handleFormSubmit(event) {
    this._changeData(event);
    this._replaceFormToEvent();
  }

  _onEscKeyDown(evt) {
    if (evt.key === ESC_BUTTON_CODE) {
      evt.preventDefault();
      this._replaceFormToEvent();
    }
  }

  _handleFavoriteClick() {
    const newData = Object.assign({}, this._event, {isFavorite: !this._event.isFavorite});
    this._changeData(newData);
  }
}
