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
  const startTimeInputEl = (type: 'date' | 'datetime-local', value: string) =>
    Input({
      selectors: { id: 'start' },
      attr: {
        type,
        value,
        required: true,
        onchange: (e) => {
          const newValue = (e.target as HTMLInputElement).value;
          const newDate = new Date(newValue);

          const endDateTime = document.getElementById(
            'end'
          ) as HTMLInputElement;
          if (endDateTime) {
            const newEndDate = addMinutesToDate(newDate, 30);
            const endDateTimeString = formatDateTimeInputValue(newEndDate);
            endDateTime.value = endDateTimeString;
          }
          onEventStateChange({
            start: newDate,
          });
        },
      },
      styles: {
        marginRight: '12px',
      },
    });
  const dateTimeString = formatDateTimeInputValue(eventState.start);
  const startTimeInput = startTimeInputEl('datetime-local', dateTimeString);

  dateContainer.appendChild(startTimeInput);

  const toLabel = Label({
    attr: { innerText: 'to' },
    styles: {
      marginRight: '12px',
    },
  });
  dateContainer.appendChild(toLabel);

  const endTimeInput = Input({
    attr: {
      type: 'datetime-local',
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
  dateContainer.appendChild(endTimeInput);

  const allDayInput = Input({
    attr: {
      type: 'checkbox',
      checked: eventState.allDay,
      onchange: (e) => {
        const isChecked = (e.target as HTMLInputElement).checked;
        onEventStateChange({
          allDay: isChecked,
          end: isChecked ? undefined : eventState.end,
        });

        const dateInput = document.getElementById('start');
        if (!dateInput) {
          return;
        }

        if (isChecked) {
          dateContainer.removeChild(dateInput);
          dateContainer.removeChild(toLabel);
          dateContainer.removeChild(endTimeInput);

          const dateString = formatSplitDate(
            eventState.start,
            '-',
            'yyyy-mm-dd'
          );
          const startDate = startTimeInputEl('date', dateString);
          dateContainer.prepend(startDate);
        } else {
          dateContainer.removeChild(dateInput);
          dateContainer.prepend(endTimeInput);
          dateContainer.prepend(toLabel);
          dateContainer.prepend(startTimeInput);
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
