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
          const selectedValue = (e.target as HTMLInputElement).value;
          let newStartDate = new Date(selectedValue);

          if (eventState.allDay) {
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
        const isChecked = (e.target as HTMLInputElement).checked;
        onEventStateChange({
          allDay: isChecked,
          end: isChecked ? undefined : eventState.end,
        });

        const dateInput = byId('start') as HTMLInputElement;
        const endDatetimeInput = byId('end') as HTMLInputElement;
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
