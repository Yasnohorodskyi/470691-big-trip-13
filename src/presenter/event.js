import EventView from '../view/event';
import EventFormView from '../view/event-form';
import {render, replace, remove} from "../utils/render";
import {isEscPressed} from '../utils/button-codes';
import {UserAction} from "../utils/user-action";
import {UpdateType} from "../utils/update-type";
import {isDatesEqual} from '../utils/date';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};

export default class EventPresenter {
  constructor(eventListContainer, changeData, changeMode, offersModel, destinationsModel) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._eventComponent = null;
    this._eventFormComponent = null;
    this._mode = Mode.DEFAULT;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleCloseForm = this._handleCloseForm.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleTypeChange = this._handleTypeChange.bind(this);
  }

  init(event) {
    const prevEventComponent = this._eventComponent;
    const prevFormComponent = this._eventFormComponent;

    this._event = event;
    this._eventComponent = new EventView(event);
    this._eventFormComponent = new EventFormView(event, this._destinationsModel.getDestinations());

    this._eventComponent.setEditClickHandler(this._handleEditClick);
    this._eventFormComponent.setCloseFormHandler(this._handleCloseForm);
    this._eventFormComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventComponent.setFavoriteClick(this._handleFavoriteClick);
    this._eventFormComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._eventFormComponent.setTypeChangeHandler(this._handleTypeChange);

    if (prevEventComponent === null || prevFormComponent === null) {
      render(this._eventListContainer, this._eventComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventListContainer, this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      // console.log(this._eventListContainer, this._eventComponent, prevEventComponent);
      // replace(this._eventListContainer, this._eventFormComponent, prevFormComponent);
      replace(this._eventListContainer, this._eventComponent, prevFormComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevEventComponent);
    remove(prevFormComponent);
  }

  setViewState(state) {
    const resetFormState = () => {
      this._eventFormComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      }, false);
    };

    switch (state) {
      case State.SAVING:
        this._eventFormComponent.updateData({
          isDisabled: true,
          isSaving: true
        }, false);
        break;
      case State.DELETING:
        this._eventFormComponent.updateData({
          isDisabled: true,
          isDeleting: true
        }, false);
        break;
      case State.ABORTING:
        this._eventComponent.shake(resetFormState);
        this._eventFormComponent.shake(resetFormState);
        break;
    }
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventFormComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._eventFormComponent.reset(this._event);
      this._replaceFormToEvent();
    }
  }

  _replaceEventToForm() {
    replace(this._eventListContainer, this._eventFormComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToEvent() {
    replace(this._eventListContainer, this._eventComponent, this._eventFormComponent);

    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _handleEditClick() {
    this._replaceEventToForm();
  }

  _handleCloseForm() {
    this._eventFormComponent.reset(this._event);
    this._replaceFormToEvent();
  }

  _handleFormSubmit(newData) {
    const isMinorUpdate =
      !isDatesEqual(this._event.startDate, newData.startDate) ||
      !isDatesEqual(this._event.endDate, newData.endDate) ||
      this._event.price !== newData.price;

    // this._replaceFormToEvent();

    this._changeData(UserAction.UPDATE_EVENT, isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH, newData);
  }

  _handleDeleteClick(event) {
    this._changeData(UserAction.DELETE_EVENT, UpdateType.MINOR, event);
  }

  _handleTypeChange(type) {
    this._eventFormComponent.reset({
      offers: this._offersModel.getOffersByType(type)
    });
  }

  _onEscKeyDown(evt) {
    if (isEscPressed(evt)) {
      evt.preventDefault();
      this._eventFormComponent.reset(this._event);
      this._replaceFormToEvent();
    }
  }

  _handleFavoriteClick() {
    const newData = Object.assign({}, this._event, {isFavorite: !this._event.isFavorite});
    this._changeData(UserAction.UPDATE_EVENT, UpdateType.MINOR, newData);
  }
}
