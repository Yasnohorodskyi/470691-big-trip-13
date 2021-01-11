import {getDuration} from "./date";

export const getStats = (events) => {
  const stats = {
    taxi: {
      totalSpent: 0,
      count: 0,
      totalTime: 0
    },

    train: {
      totalSpent: 0,
      count: 0,
      totalTime: 0
    },

    ship: {
      totalSpent: 0,
      count: 0,
      totalTime: 0
    },

    transport: {
      totalSpent: 0,
      count: 0,
      totalTime: 0
    },

    sightseeing: {
      totalSpent: 0,
      count: 0,
      totalTime: 0
    },

    bus: {
      totalSpent: 0,
      count: 0,
      totalTime: 0
    },

    drive: {
      totalSpent: 0,
      count: 0,
      totalTime: 0
    },

    flight: {
      totalSpent: 0,
      count: 0,
      totalTime: 0
    },

    [`check-in`]: {
      totalSpent: 0,
      count: 0,
      totalTime: 0
    },

    restaurant: {
      totalSpent: 0,
      count: 0,
      totalTime: 0
    }
  };


  events.forEach((event) => {
    if (event.type === `Taxi`) {
      stats.taxi.totalSpent += event.price;
      stats.taxi.count += 1;
      stats.taxi.totalTime += getDuration(event.startDate, event.endDate);
    }

    if (event.type === `Train`) {
      stats.train.totalSpent += event.price;
      stats.train.count += 1;
      stats.train.totalTime += getDuration(event.startDate, event.endDate);
    }

    if (event.type === `Ship`) {
      stats.ship.totalSpent += event.price;
      stats.ship.count += 1;
      stats.ship.totalTime += getDuration(event.startDate, event.endDate);
    }

    if (event.type === `Transport`) {
      stats.transport.totalSpent += event.price;
      stats.transport.count += 1;
      stats.transport.totalTime += getDuration(event.startDate, event.endDate);
    }

    if (event.type === `Sightseeing`) {
      stats.sightseeing.totalSpent += event.price;
      stats.sightseeing.count += 1;
      stats.sightseeing.totalTime += getDuration(event.startDate, event.endDate);
    }

    if (event.type === `Bus`) {
      stats.bus.totalSpent += event.price;
      stats.bus.count += 1;
      stats.bus.totalTime += getDuration(event.startDate, event.endDate);
    }

    if (event.type === `Drive`) {
      stats.drive.totalSpent += event.price;
      stats.drive.count += 1;
      stats.drive.totalTime += getDuration(event.startDate, event.endDate);
    }

    if (event.type === `Flight`) {
      stats.flight.totalSpent += event.price;
      stats.flight.count += 1;
      stats.flight.totalTime += getDuration(event.startDate, event.endDate);
    }

    if (event.type === `Check-in`) {
      stats[`check-in`].totalSpent += event.price;
      stats[`check-in`].count += 1;
      stats[`check-in`].totalTime += getDuration(event.startDate, event.endDate);
    }

    if (event.type === `Restaurant`) {
      stats.restaurant.totalSpent += event.price;
      stats.restaurant.count += 1;
      stats.restaurant.totalTime += getDuration(event.startDate, event.endDate);
    }
  });

  return stats;
};
