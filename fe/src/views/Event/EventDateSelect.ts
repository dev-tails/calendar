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
import { inputStyles } from '../../../public/css/componentStyles';
import { flexAlignItemsCenter } from '../../utils/styles';

export function EventDateSelect(
  event: IEvent,
  onEventStateChange: (eventState: Partial<IEvent>) => void
) {
  console.log('event', event);
  const el = Div({
    styles: {
      ...flexAlignItemsCenter,
      padding: '12px',
    },
  });

  const datesContainer = Div();
  datesContainer.appendChild(
    event.allDay ? newStartDateInput() : newStartTimeInput()
  );

  const toLabel = Label({
    attr: { innerText: 'to' },
    styles: {
      marginRight: '12px',
    },
  });
  if (!event.allDay) {
    datesContainer.appendChild(toLabel);
    datesContainer.appendChild(endTimeInput());
  }

  const allDayContainer = Div();
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
  allDayContainer.appendChild(allDayInput);

  const allDayLabel = Label({
    attr: { innerText: 'All day', for: 'allDay' },
  });
  allDayContainer.appendChild(allDayLabel);

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
        ...inputStyles,
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
        ...inputStyles,
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
        ...inputStyles,
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
      datesContainer.removeChild(dateInput);
      datesContainer.removeChild(toLabel);
      datesContainer.removeChild(endDatetimeInput);

      const copiedDate = new Date(event.start.getTime());
      copiedDate.setHours(0, 0, 0, 0);

      onEventStateChange({
        start: copiedDate,
        allDay: isChecked,
        end: isChecked ? undefined : event.end,
      });
      datesContainer.style.marginRight = '0';
      datesContainer.prepend(newStartDateInput());
    } else {
      const currentDate = convertMidnightUTCToLocalDay(event.start);
      const selectedDateWithCurrentTime = addLocalTimeToDate(currentDate);

      datesContainer.removeChild(dateInput);
      datesContainer.prepend(endTimeInput());
      datesContainer.prepend(toLabel);

      onEventStateChange({
        start: selectedDateWithCurrentTime,
        allDay: isChecked,
        end: undefined,
      });

      datesContainer.style.marginRight = 'auto';
      datesContainer.prepend(newStartTimeInput());
    }
  }

  el.appendChild(datesContainer);
  el.appendChild(allDayContainer);
  return el;
}
