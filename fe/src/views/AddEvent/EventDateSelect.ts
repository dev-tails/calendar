import {
  addMinutesToDate,
  formatDateTimeInputValue,
  formatSplitDate,
} from '../../utils/dateHelpers';
import { Div } from '../../components/elements/Div';
import { Input } from '../../components/elements/Input/Input';
import { Label } from '../../components/elements/Label';
import { byId } from '../../utils/DOMutils';

export function DateSelect(
  event: IEvent,
  onEventStateChange: (eventState: Partial<IEvent>) => void
) {
  const dateContainer = Div({ styles: { padding: '12px' } });

  dateContainer.appendChild(
    startTimeInputEl(event.allDay ? 'date' : 'datetime-local')
  );

  const toLabel = Label({
    attr: { innerText: 'to' },
    styles: {
      marginRight: '12px',
    },
  });
  if (!event.allDay) {
    dateContainer.appendChild(toLabel);
  }

  if (!event.allDay) {
    dateContainer.appendChild(endTimeInput());
  }

  const allDayInput = Input({
    attr: {
      type: 'checkbox',
      checked: event.allDay,
      onchange: (e) => {
        const isChecked = (e.target as HTMLInputElement).checked;

        const dateInput = byId('start') as HTMLInputElement;
        const endDatetimeInput = byId('end') as HTMLInputElement;

        if (isChecked) {
          dateContainer.removeChild(dateInput);
          dateContainer.removeChild(toLabel);
          dateContainer.removeChild(endDatetimeInput);

          dateContainer.prepend(startTimeInputEl('date'));
        } else {
          dateContainer.removeChild(dateInput);
          dateContainer.prepend(endTimeInput());
          dateContainer.prepend(toLabel);
          dateContainer.prepend(startTimeInputEl('datetime-local'));
        }
        onEventStateChange({
          allDay: isChecked,
          end: isChecked ? undefined : event.end,
        });
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

  function startTimeInputEl(type: 'date' | 'datetime-local') {
    const value =
      type === 'date'
        ? formatSplitDate(event.start, '-', 'yyyy-mm-dd')
        : formatDateTimeInputValue(event.start);
    return Input({
      selectors: { id: 'start' },
      attr: {
        type,
        value,
        required: true,
        onchange: (e) => {
          const selectedValue = (e.target as HTMLInputElement).value;
          let newStartDate = new Date(selectedValue);

          if (event.allDay) {
            const selectedValueToMidnight = newStartDate
              .toUTCString()
              .split('GMT')[0];
            newStartDate = new Date(selectedValueToMidnight);
          }

          const endDateTime = byId('end') as HTMLInputElement;
          const newEndDate = addMinutesToDate(newStartDate, 30);

          if (endDateTime) {
            const endDateTimeString = formatDateTimeInputValue(newEndDate);
            endDateTime.value = endDateTimeString;
          }
          onEventStateChange({
            start: newStartDate,
            end: endDateTime ? newEndDate : undefined,
          });
        },
      },
      styles: {
        marginRight: '12px',
      },
    });
  }

  function endTimeInput() {
    return Input({
      attr: {
        type: 'datetime-local',
        value: event.end ? formatDateTimeInputValue(event.end) : '',
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
  }

  return dateContainer;
}
