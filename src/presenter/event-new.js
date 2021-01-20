import EventFormView from "../view/event-form";
import {remove, render, RenderPosition} from "../utils/render";
import {isEscPressed} from "../utils/button-codes";
import {disableNewEventButton} from "../utils/common";
import {UpdateType, UserAction} from "../const";

export default class EventNew {
  constructor(eventListContainer, changeData, offersModel, destinationsModel) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._formEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleTypeChange = this._handleTypeChange.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(event) {
    if (this._formEditComponent !== null) {
      return;
    }

    this._formEditComponent = new EventFormView(event, this._destinationsModel.getDestinations(), true);
    this._formEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._formEditComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._formEditComponent.setTypeChangeHandler(this._handleTypeChange);

    render(this._eventListContainer, this._formEditComponent, RenderPosition.AFTERBEGIN);

    disableNewEventButton(true);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  setSaving() {
    this._formEditComponent.updateData({
      isDisabled: true,
      isSaving: true
    }, false);
  }

  setAborting() {
    const resetFormState = () => {
      this._formEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      }, false);
    };

    this._formEditComponent.shake(resetFormState);
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
    this._changeData(UserAction.ADD_EVENT, UpdateType.MINOR, event);
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _handleTypeChange(type) {
    this._formEditComponent.reset({
      offers: this._offersModel.getOffersByType(type)
    });
  }

  _escKeyDownHandler(evt) {
    if (isEscPressed(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
