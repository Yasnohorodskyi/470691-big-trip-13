import {getDuration} from "./date";

export const getStats = (events) => {
  return events.reduce((acc, event) => {
    const type = event.type.toLowerCase();

    if (acc[type]) {
      acc[type].totalSpent += event.price;
      acc[type].count += 1;
      acc[type].totalTime += getDuration(event.startDate, event.endDate);
    } else {
      acc[type] = {
        totalSpent: event.price,
        count: 1,
        totalTime: getDuration(event.startDate, event.endDate)
      };
    }

    return acc;
  }, {});
};
