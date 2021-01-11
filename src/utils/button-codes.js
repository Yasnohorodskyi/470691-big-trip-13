const ESC_BUTTON_CODE = `Escape`;

export const isEscPressed = (evt) => {
  if (evt.key === ESC_BUTTON_CODE) {
    return true;
  } else {
    return false;
  }
};
