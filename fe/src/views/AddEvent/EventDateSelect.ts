import {
  addMinutesToDate,
  convertMidnightUTCToLocalDay,
  convertToCurrentTZMidnight,
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
  let dateTimeStringHere = () => formatDateTimeInputValue(event.start);
  //2023-01-26T16:00
  const newStartTimeInput = () =>
    Input({
      selectors: { id: 'start' },
      attr: {
        type: 'datetime-local',
        value: event.start ? dateTimeStringHere() : undefined,
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

  const newStartDateInput = () =>
    Input({
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

          const copiedDate = new Date(event.start.getTime());
          copiedDate.setHours(0, 0, 0, 0);
          onEventStateChange({
            start: copiedDate,
            allDay: isChecked,
            end: isChecked ? undefined : event.end,
          });
          dateContainer.prepend(newStartDateInput());
        } else {
          console.log(
            'Aqui no?',
            event.start,
            convertMidnightUTCToLocalDay(event.start)
          );
          const copiedDate = convertMidnightUTCToLocalDay(
            new Date(event.start.getTime())
          );
          const currentTime = new Date();
          const currentTimeHrs = currentTime.getHours();
          const currentTimeMin = currentTime.getMinutes();
          const currentTimeSec = currentTime.getSeconds();
          const currentTimeMs = currentTime.getMilliseconds();

          copiedDate.setHours(
            currentTimeHrs,
            currentTimeMin,
            currentTimeSec,
            currentTimeMs
          );
          console.log('coped date', copiedDate);
          dateContainer.removeChild(dateInput);
          dateContainer.prepend(endTimeInput());
          dateContainer.prepend(toLabel);
          onEventStateChange({
            start: copiedDate,
            allDay: isChecked,
            end: undefined,
          });
          dateContainer.prepend(newStartTimeInput());
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

/*
  function startTimeInputEl(type: 'date' | 'datetime-local') {
    const allDayDate = converToCurrentTZMidnight(event.start);
    const value =
      type === 'date'
        ? formatSplitDate(event.start, '-', 'yyyy-mm-dd')
        : formatDateTimeInputValue(allDayDate);
    console.log('value ', value);
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
  */
