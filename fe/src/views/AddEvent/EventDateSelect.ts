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
  const startTimeInputEl = (type: 'date' | 'datetime-local') =>
    Input({
      selectors: { id: 'start' },
      attr: {
        type,
        required: true,
        onchange: (e) => {
          const newValue = (e.target as HTMLInputElement).value;
          const newDate = new Date(newValue);

          const endDateTime = document.getElementById(
            'end'
          ) as HTMLInputElement;
          const newEndDate = addMinutesToDate(newDate, 30);
          if (endDateTime) {
            const endDateTimeString = formatDateTimeInputValue(newEndDate);
            endDateTime.value = endDateTimeString;
          }
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

  dateContainer.appendChild(startTimeInputEl('datetime-local'));

  const toLabel = Label({
    attr: { innerText: 'to' },
    styles: {
      marginRight: '12px',
    },
  });
  dateContainer.appendChild(toLabel);

  const endTimeInput = () =>
    Input({
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
  dateContainer.appendChild(endTimeInput());

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

          const startDate = startTimeInputEl('date');
          dateContainer.prepend(startDate);
        } else {
          dateContainer.prepend(endTimeInput());
          dateContainer.prepend(toLabel);
          dateContainer.prepend(startTimeInputEl('datetime-local'));
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
