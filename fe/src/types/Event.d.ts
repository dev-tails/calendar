interface IEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end?: Date;
  allDay: boolean;
  users: string[]; //to be User[]
}
