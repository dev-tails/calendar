import {
  addLocalTimeToDate,
  addMinutesToDate,
  convertMidnightUTCToLocalDay,
  formatDateTimeInputValue,
  formatSplitDate,
} from '../../utils/dateHelpers';
import { Div } from '../../components/elements/Div';
import { Input } from '../../components/elements/Input/Input';
import { Label } from '../../components/elements/Label';
import { byId } from '../../utils/DOMutils';

export function EventDateSelect(
  event: IEvent,
  onEventStateChange: (eventState: Partial<IEvent>) => void
) {
  const dateContainer = Div({ styles: { padding: '12px' } });

  dateContainer.appendChild(
    event.allDay ? newStartDateInput() : newStartTimeInput()
  );

  const toLabel = Label({
    attr: { innerText: 'to' },
    styles: {
      marginRight: '12px',
    },
  });
  if (!event.allDay) {
    dateContainer.appendChild(toLabel);
    dateContainer.appendChild(endTimeInput());
  }

  const allDayInput = Input({
    attr: {
      type: 'checkbox',
      checked: event.allDay,
      onchange: onAllDayChange,
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

  function dateTimeString() {
    return formatDateTimeInputValue(event.start);
  }

  function newStartTimeInput() {
    return Input({
      selectors: { id: 'start' },
      attr: {
        type: 'datetime-local',
        value: event.start ? dateTimeString() : undefined,
        required: true,
        onchange: (e) => {
          const selectedValue = (e.target as HTMLInputElement).value;
          let newStartDate = new Date(selectedValue);

          const endDateTime = byId('end') as HTMLInputElement;
          const newEndDate = addMinutesToDate(newStartDate, 30);

          const endDateTimeString = formatDateTimeInputValue(newEndDate);
          endDateTime.value = endDateTimeString;

          onEventStateChange({
            start: newStartDate,
            end: newEndDate,
          });
        },
      },
      styles: {
        marginRight: '12px',
      },
    });
  }

  function newStartDateInput() {
    return Input({
      selectors: { id: 'start' },
      attr: {
        type: 'date',
        value: formatSplitDate(
          convertMidnightUTCToLocalDay(event.start),
          '-',
          'yyyy-mm-dd'
        ),
        required: true,
        onchange: (e) => {
          const selectedValue = (e.target as HTMLInputElement).value;
          let newStartDate = new Date(selectedValue);
          newStartDate.setUTCHours(0, 0, 0, 0);

          onEventStateChange({
            start: newStartDate,
            end: undefined,
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

  function onAllDayChange(e: Event) {
    const isChecked = (e.target as HTMLInputElement).checked;

    const dateInput = byId('start') as HTMLInputElement;
    const endDatetimeInput = byId('end') as HTMLInputElement;

    if (isChecked) {
      dateContainer.removeChild(dateInput);
      dateContainer.removeChild(toLabel);
      dateContainer.removeChild(endDatetimeInput);

      const copiedDate = new Date(event.start.getTime());
      copiedDate.setHours(0, 0, 0, 0);

      onEventStateChange({
        start: copiedDate,
        allDay: isChecked,
        end: isChecked ? undefined : event.end,
      });

      dateContainer.prepend(newStartDateInput());
    } else {
      const currentDate = convertMidnightUTCToLocalDay(event.start);
      const selectedDateWithCurrentTime = addLocalTimeToDate(currentDate);

      dateContainer.removeChild(dateInput);
      dateContainer.prepend(endTimeInput());
      dateContainer.prepend(toLabel);

      onEventStateChange({
        start: selectedDateWithCurrentTime,
        allDay: isChecked,
        end: undefined,
      });

      dateContainer.prepend(newStartTimeInput());
    }
  }

  return dateContainer;
}