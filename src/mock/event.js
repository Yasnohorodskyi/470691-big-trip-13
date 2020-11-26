import dayjs from "dayjs";
import {EVENT_TYPES} from "../constants/event-types";

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateEventType = () => {
  const randomIndex = getRandomInteger(0, EVENT_TYPES.length - 1);

  return EVENT_TYPES[randomIndex];
};

const generateDestination = () => {
  const destinations = [`Amsterdam`, `Los Angeles`, `Nice`, `Geneva`];
  const randomIndex = getRandomInteger(0, destinations.length - 1);

  return destinations[randomIndex];
};

const generateOffers = () => {
  const offers = [
    {
      type: `LUGGAGE`,
      name: `Add luggage`,
      price: 30,
      isSelected: Boolean(getRandomInteger(0, 1))
    }, {
      type: `CLASS_UPGRADE`,
      name: `Switch to comfort class`,
      price: 100,
      isSelected: Boolean(getRandomInteger(0, 1))
    }, {
      type: `MEAL`,
      name: `Add meal`,
      price: 15,
      isSelected: Boolean(getRandomInteger(0, 1))
    }, {
      type: `SEAT_SELECTION`,
      name: `Choose seats`,
      price: 5,
      isSelected: Boolean(getRandomInteger(0, 1))
    }, {
      type: `TRAIN_TICKET`,
      name: `Travel by train`,
      price: 40,
      isSelected: Boolean(getRandomInteger(0, 1))
    },
  ];

  const randomIndex = getRandomInteger(2, offers.length - 1);
  return offers.slice(0, randomIndex);
};

const generateDestinationInfo = () => {
  const descriptions = [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  ];

  const randomIndexDescription = getRandomInteger(1, 5);
  const randomIndexPhotos = getRandomInteger(1, 5);
  const photos = new Array(randomIndexPhotos).fill().map(() => `http://picsum.photos/248/152?r=${Math.random()}`);

  return {
    description: descriptions.slice(0, randomIndexDescription).join(` `),
    photos
  };
};

const generateEvent = () => {
  const startDate = dayjs().add(getRandomInteger(-7, 7), `day`).format();
  const endDate = dayjs(startDate).add(getRandomInteger(1, 200), `hour`).format();

  return {
    type: generateEventType(),
    destinationName: generateDestination(),
    destinationInfo: generateDestinationInfo(),
    startDate,
    endDate,
    offers: generateOffers(),
    price: getRandomInteger(50, 200),
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};

export const generateEventList = () => {
  const eventListLength = getRandomInteger(15, 20);

  return new Array(eventListLength).fill().map(generateEvent);
};


