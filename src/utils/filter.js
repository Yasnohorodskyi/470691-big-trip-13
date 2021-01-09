import dayjs from "dayjs";

export const FilterType = {
  EVERYTHING: `EVERYTHING`,
  FUTURE: `FUTURE`,
  PAST: `PAST`
};

export const filter = {
  [FilterType.EVERYTHING]: (events) => events.filter((event) => event),
  [FilterType.PAST]: (events) => events.filter((event) => dayjs().isAfter(event.startDate)),
  [FilterType.FUTURE]: (events) => events.filter((event) => dayjs().isBefore(event.startDate))
};
