const baseURL = window.location.origin;

export const getEventById = async (eventId: string) => {
  const res = await fetch(`${baseURL}/api/events/${eventId}`);
  if (res.ok) {
    const eventsResponse = await res.json();
    const eventData: IEvent = eventsResponse.data;

    // using new Date here as res returns ISODate strings for event start and end
    const event: IEvent = { ...eventData };
    event.start = new Date(event.start);
    if (event.end) {
      event.end = new Date(event.end);
    }
    return event;
  } else {
    const error = (await res.json()).error;
    throw new Error(error || 'Events could not be fetched');
  }
};

export const getEventsForDay = async (date: Date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  const res = await fetch(`${baseURL}/api/events?start=${newDate}`);
  if (res.ok) {
    const eventsResponse = await res.json();
    const eventsData: IEvent[] = eventsResponse.data;

    // using new Date here as res returns ISODate strings for events start and end
    const events = eventsData.map((event) => {
      const modifiedEvent: IEvent = { ...event };
      modifiedEvent.start = new Date(modifiedEvent.start);
      if (modifiedEvent.end) {
        modifiedEvent.end = new Date(modifiedEvent.end);
      }
      return modifiedEvent;
    });
    return events;
  } else {
    const error = (await res.json()).error;
    throw new Error(error || 'Events could not be fetched.');
  }
};

export const createEvent = async (event: Partial<IEvent>) => {
  fetch(`/api/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });
};

export const editEvent = async (event: IEvent) => {
  const res = await fetch(`/api/events/${event._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: event._id, body: event }),
  });
  if (res.ok) {
    const modifiedEvent = await res.json();
    return modifiedEvent;
  } else {
    throw new Error(res.statusText || 'Event could not be edited.');
  }
};

export const deleteEvent = async (eventId?: string) => {
  if (!eventId) {
    throw new Error('Event id must exist.');
  }

  const res = await fetch(`/api/events/${eventId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (res.ok) {
    const response = await res.json();
    return !!response.success;
  } else {
    throw new Error(res.statusText || 'Event could not be deleted.');
  }
};
