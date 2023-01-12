import { mettingsObject } from '../fakeData/fakeData';

export const getEventById = (eventId: string) =>
  mettingsObject.find((event) => eventId === event._id);

export const createEvent = (event: Partial<IEvent>) => {
  fetch(`/api/events`, {
    body: JSON.stringify(event),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getEventsForDay = (date: Date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  fetch(`api/events?start=${newDate.toISOString()}`, {});
};
