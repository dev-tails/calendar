import { mettingsObject } from '../fakeData/fakeData';

export const getEventById = (eventId: string) =>
  mettingsObject.find((event) => eventId === event.id);
