import {
  addLocalTimeToDate,
  addMinutesToDate,
  convertMidnightUTCToLocalDay,
  formatDateTimeInputValue,
  formatSplitDate,
} from '../../utils/dateHelpers';
import { Div, Input, Label } from '../../components/elements';
import { byId } from '../../utils/DOMutils';
import { inputStyles } from '../../../public/css/componentStyles';
import { flexAlignItemsCenter } from '../../utils/styles';

function removeTime(date: Date) {
  const copiedStartDate = new Date(date.getTime());
  copiedStartDate.setHours(0, 0, 0, 0);
  return copiedStartDate;
}

export function EventDateSelect(
  event: IEvent,
  onEventStateChange: (eventState: Partial<IEvent>) => void
) {
  const el = Div({ styles: { ...flexAlignItemsCenter, padding: '12px' } });

  const datesContainer = Div({
    styles: { marginRight: event.allDay ? '' : 'auto' },
  });
  datesContainer.appendChild(
    event.allDay ? startDateInputEl() : startTimeDateInputEl()
  );

  const toLabel = Label({
    attr: { innerText: 'to' },
    styles: { marginRight: '8px' },
  });
  if (!event.allDay) {
    datesContainer.appendChild(toLabel);
    datesContainer.appendChild(endTimeDateInputEl());
  }

  const allDayContainer = Div({ styles: { ...flexAlignItemsCenter } });
  const allDayInput = Input({
    attr: {
      type: 'checkbox',
      checked: event.allDay,
      onchange: onAllDayChange,
    },
    selectors: { id: 'allDay' },
  });
  allDayContainer.appendChild(allDayInput);

  const allDayLabel = Label({
    attr: { innerText: 'All day', for: 'allDay' },
    styles: { marginLeft: '4px' },
  });
  allDayContainer.appendChild(allDayLabel);

  function dateTimeString() {
    return formatDateTimeInputValue(event.start);
  }

  function startTimeDateInputEl() {
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

          onEventStateChange({ start: newStartDate, end: newEndDate });
        },
      },
      styles: { ...inputStyles, marginRight: '8px' },
    });
  }

  function startDateInputEl() {
    function formatValue(date: Date) {
      const midnightUTC = convertMidnightUTCToLocalDay(date);
      return formatSplitDate(midnightUTC, '-', 'yyyy-mm-dd');
    }

    return Input({
      selectors: { id: 'start' },
      attr: {
        type: 'date',
        value: formatValue(event.start),
        required: true,
        onchange: (e) => {
          const selectedValue = (e.target as HTMLInputElement).value;
          let newStartDate = new Date(selectedValue);
          newStartDate.setUTCHours(0, 0, 0, 0);

          const endDateTime = byId('end') as HTMLInputElement;
          const endDateString = formatValue(new Date(selectedValue));
          endDateTime.value = endDateString;

          onEventStateChange({ start: newStartDate, end: newStartDate });
        },
      },
      styles: { ...inputStyles, marginRight: '8px' },
    });
  }

  function endTimeDateInputEl() {
    return Input({
      selectors: { id: 'end' },
      attr: {
        type: 'datetime-local',
        value: event.end ? formatDateTimeInputValue(event.end) : '',
        required: true,
        onchange: (e) =>
          onEventStateChange({
            end: new Date((e.target as HTMLInputElement).value),
          }),
      },
      styles: { ...inputStyles, marginRight: '8px' },
    });
  }

  function endDateInputEl() {
    return Input({
      selectors: { id: 'end' },
      attr: {
        type: 'date',
        value: event.end
          ? formatSplitDate(
              convertMidnightUTCToLocalDay(event.end),
              '-',
              'yyyy-mm-dd'
            )
          : '',
        required: true,
        onchange: (e) => {
          const selectedValue = (e.target as HTMLInputElement).value;
          let newEndDate = new Date(selectedValue);
          newEndDate.setUTCHours(0, 0, 0, 0);
          onEventStateChange({ end: newEndDate });
        },
      },
      styles: { ...inputStyles, marginRight: '8px' },
    });
  }

  function onAllDayChange(e: Event) {
    const isChecked = (e.target as HTMLInputElement).checked;

    const dateStartInput = byId('start') as HTMLInputElement;
    const dateEndInput = byId('end') as HTMLInputElement;

    if (isChecked) {
      datesContainer.removeChild(dateStartInput);
      datesContainer.removeChild(toLabel);
      datesContainer.removeChild(dateEndInput);

      onEventStateChange({
        start: removeTime(event.start),
        allDay: isChecked,
        end: event.end ? removeTime(event.end) : undefined,
      });

      datesContainer.style.marginRight = '0';
      datesContainer.prepend(endDateInputEl());
      datesContainer.prepend(toLabel);
      datesContainer.prepend(startDateInputEl());
    } else {
      const currentDate = convertMidnightUTCToLocalDay(event.start);
      const selectedDateWithCurrentTime = addLocalTimeToDate(currentDate);

      onEventStateChange({
        start: selectedDateWithCurrentTime,
        allDay: isChecked,
        end: undefined,
      });

      datesContainer.removeChild(dateStartInput);
      datesContainer.removeChild(dateEndInput);
      datesContainer.prepend(endTimeDateInputEl());
      datesContainer.prepend(toLabel);
      datesContainer.style.marginRight = 'auto';
      datesContainer.prepend(startTimeDateInputEl());
    }
  }

  el.appendChild(datesContainer);
  el.appendChild(allDayContainer);
  return el;
}
