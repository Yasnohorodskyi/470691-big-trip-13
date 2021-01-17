import EventFormView from "../view/event-form";
import {generateId} from "../mock/event";
import {remove, render, RenderPosition} from "../utils/render";
import {UserAction} from "../utils/user-action";
import {UpdateType} from "../utils/update-type";
import {isEscPressed} from "../utils/button-codes";
import {disableNewEventButton} from "../utils/common";

export default class EventNew {
  constructor(eventListContainer, changeData) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;

    this._formEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._formEditComponent !== null) {
      return;
    }

    this._formEditComponent = new EventFormView({}, true);
    this._formEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._formEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._eventListContainer, this._formEditComponent, RenderPosition.AFTERBEGIN);

    disableNewEventButton(true);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._formEditComponent === null) {
      return;
    }

    remove(this._formEditComponent);
    this._formEditComponent = null;

    disableNewEventButton(false);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormSubmit(event) {
    this._changeData(UserAction.ADD_EVENT, UpdateType.MINOR, Object.assign({id: generateId()}, event));
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (isEscPressed(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
