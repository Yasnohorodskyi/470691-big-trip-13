import dayjs from "dayjs";

import {getDuration} from "../utils/date";

export const sortByDate = (a, b) => {
  if (dayjs(a.startDate).isBefore(b.startDate)) {
    return -1;
  }

  if (dayjs(a.startDate).isAfter(b.startDate)) {
    return 1;
  }

  return 0;
};

export const sortByPrice = (a, b) => {
  if (a.price < b.price) {
    return 1;
  }

  if (a.price > b.price) {
    return -1;
  }

  return 0;
};

export const sortByDuration = (a, b) => {
  const durationA = getDuration(a.startDate, a.endDate);

  const durationB = getDuration(b.startDate, b.endDate);

  if (durationA < durationB) {
    return 1;
  }

  if (durationA > durationB) {
    return -1;
  }

  return 0;
};


