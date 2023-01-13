import {
  addMinutesToDate,
  formatDateTimeInputValue,
  formatSplitDate,
} from '../../utils/dateHelpers';
import { Div } from '../../components/elements/Div';
import { Input } from '../../components/elements/Input/Input';
import { Label } from '../../components/elements/Label';

export function DateSelect(
  eventState: IEvent,
  onEventStateChange: (state: Partial<IEvent>) => void
) {
  const dateContainer = Div({ styles: { padding: '12px' } });
  const startTimeInputEl = (type: 'date' | 'datetime-local', newValue: any) =>
    Input({
      selectors: { id: 'start' },
      attr: {
        type,
        value:
          type === 'date'
            ? formatSplitDate(newValue, '-', 'yyyy-mm-dd')
            : formatDateTimeInputValue(newValue),
        required: true,
        onchange: (e) => {
          const newValue = (e.target as HTMLInputElement).value;
          const newDate = new Date(newValue);
          console.log('new vlaue', newValue);
          console.log('new date', newDate);

          const endDateTime = document.getElementById(
            'end'
          ) as HTMLInputElement;
          const newEndDate = addMinutesToDate(newDate, 30);
          console.log(
            'new end dtae',
            newEndDate,
            endDateTime ? newEndDate : undefined
          );
          if (endDateTime) {
            const endDateTimeString = formatDateTimeInputValue(newEndDate);
            endDateTime.value = endDateTimeString;
          }
          console.log('on event', onEventStateChange);
          onEventStateChange({
            start: newDate,
            end: endDateTime ? newEndDate : undefined,
          });
        },
      },
      styles: {
        marginRight: '12px',
      },
    });

  dateContainer.appendChild(
    startTimeInputEl(
      eventState.allDay ? 'date' : 'datetime-local',
      eventState.start
    )
  );

  const toLabel = Label({
    attr: { innerText: 'to' },
    styles: {
      marginRight: '12px',
    },
  });
  if (!eventState.allDay) {
    dateContainer.appendChild(toLabel);
  }
  const endTimeInput = () =>
    Input({
      attr: {
        type: 'datetime-local',
        value: eventState.end
          ? formatDateTimeInputValue(eventState.end)
          : formatDateTimeInputValue(new Date()),
        required: true,
        onchange: (e) => {
          onEventStateChange({
            end: new Date((e.target as HTMLInputElement).value),
          });
        },
      },
      styles: {
        marginRight: '12px',
      },
      selectors: { id: 'end' },
    });

  if (!eventState.allDay) {
    dateContainer.appendChild(endTimeInput());
  }

  const allDayInput = Input({
    attr: {
      type: 'checkbox',
      checked: eventState.allDay,
      onchange: (e) => {
        console.log('what is event state', eventState);
        const isChecked = (e.target as HTMLInputElement).checked;
        onEventStateChange({
          allDay: isChecked,
          end: isChecked ? undefined : eventState.end,
        });

        const dateInput = document.getElementById('start') as HTMLInputElement;
        const endDatetimeInput = document.getElementById(
          'end'
        ) as HTMLInputElement;
        if (!dateInput) {
          return;
        }

        if (isChecked) {
          dateContainer.removeChild(dateInput);
          dateContainer.removeChild(toLabel);
          dateContainer.removeChild(endDatetimeInput);

          const startDate = startTimeInputEl('date', eventState.start);
          dateContainer.prepend(startDate);
        } else {
          dateContainer.prepend(endTimeInput());
          dateContainer.prepend(toLabel);
          const copiedDate = new Date(eventState.start.getTime());
          const currentDatetime = new Date().getTime();
          const newTimeNumber = copiedDate.setTime(currentDatetime);
          const dateWithCurrentTime = new Date(newTimeNumber);
          dateContainer.prepend(
            startTimeInputEl('datetime-local', eventState.start)
          );
          dateContainer.removeChild(dateInput);
        }
      },
    },
    selectors: {
      id: 'allDay',
    },
  });
  dateContainer.appendChild(allDayInput);
  const allDayLabel = Label({
    attr: { innerText: 'All day', for: 'allDay' },
  });
  dateContainer.appendChild(allDayLabel);
  return dateContainer;
}
