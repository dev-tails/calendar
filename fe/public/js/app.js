"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b ||= {})
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/apis/EventApi.ts
  var baseURL = window.location.origin;
  var getEventById = (eventId) => __async(void 0, null, function* () {
    const res = yield fetch(`${baseURL}/api/events/${eventId}`);
    if (res.ok) {
      const eventsResponse = yield res.json();
      const eventData = eventsResponse.data;
      const event = __spreadValues({}, eventData);
      event.start = new Date(event.start);
      if (event.end) {
        event.end = new Date(event.end);
      }
      return event;
    } else {
      const error = (yield res.json()).error;
      throw new Error(error || "Events could not be fetched");
    }
  });
  var getEventsForDay = (date) => __async(void 0, null, function* () {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    const res = yield fetch(
      `${baseURL}/api/events?start=${newDate.toISOString()}`
    );
    if (res.ok) {
      const eventsResponse = yield res.json();
      const eventsData = eventsResponse.data;
      const events = eventsData.map((event) => {
        const modifiedEvent = __spreadValues({}, event);
        modifiedEvent.start = new Date(modifiedEvent.start);
        if (modifiedEvent.end) {
          modifiedEvent.end = new Date(modifiedEvent.end);
        }
        return modifiedEvent;
      });
      return events;
    } else {
      const error = (yield res.json()).error;
      throw new Error(error || "Events could not be fetched.");
    }
  });
  var createEvent = (event) => {
    fetch(`/api/events`, {
      body: JSON.stringify(event),
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
  };
  var deleteEvent = (eventId) => __async(void 0, null, function* () {
    if (!eventId) {
      throw new Error("Event id must exist.");
    }
    const res = yield fetch(`/api/events/${eventId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (res.ok) {
      const response = yield res.json();
      return !!response.success;
    } else {
      throw new Error(res.statusText || "Event could not be deletedssss.");
    }
  });

  // src/utils/DOMutils.ts
  function byId(id) {
    return document.getElementById(id);
  }
  function setStyle(el, styles) {
    for (const key of Object.keys(styles)) {
      const elementKey = key;
      const stylesKey = styles[key];
      if (stylesKey)
        el.style[elementKey] = stylesKey;
    }
  }
  function onClick(el, handler) {
    return el.addEventListener("click", handler, true);
  }

  // src/components/elements/Element.ts
  function Element(props) {
    const el = document.createElement(props.tag);
    if (!(props == null ? void 0 : props.selectors) && !(props == null ? void 0 : props.attr) && !(props == null ? void 0 : props.styles)) {
      return el;
    }
    const { selectors, attr, styles } = props;
    if (selectors) {
      for (const selector in selectors) {
        const attr2 = selectors[selector];
        attr2 && el.setAttribute(selector, attr2);
      }
    }
    if (attr) {
      Object.keys(attr).forEach((key) => {
        el[key] = attr[key];
      });
    }
    if (styles) {
      setStyle(el, styles);
    }
    return el;
  }

  // src/components/elements/Div.ts
  function Div(props) {
    return Element(__spreadValues({
      tag: "div"
    }, props));
  }

  // src/utils/HistoryUtils.ts
  function setURL(url) {
    history.pushState({}, "", url);
    window.dispatchEvent(new Event("popstate"));
  }

  // src/components/elements/Button.ts
  function Button(props) {
    return Element(__spreadValues({
      tag: "button"
    }, props));
  }

  // src/components/elements/Input/Input.ts
  function Input(props) {
    return Element(__spreadValues({
      tag: "input"
    }, props));
  }

  // src/components/elements/Textarea.ts
  function Textarea(props) {
    return Element(__spreadValues({
      tag: "textarea"
    }, props));
  }

  // src/utils/styles.ts
  var basics = {
    whiteColor: "#fff"
  };
  var fonts = {
    regular: "Outfit"
  };
  var flexAlignItemsCenter = {
    display: "flex",
    alignItems: "center"
  };

  // src/components/elements/Label.ts
  function Label(props) {
    return Element(__spreadValues({
      tag: "label"
    }, props));
  }

  // src/utils/dateHelpers.ts
  var timeOptions = {
    hour: "numeric",
    minute: "numeric"
  };
  var dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  var dateTimeOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timeZoneName: "short"
  };
  var formatDateTime = (locales, options, time) => {
    return new Intl.DateTimeFormat(locales, options).format(time);
  };
  var formatSplitDate = (date, divider, format) => {
    const fullYear = date.getFullYear();
    const month = date.getMonth() + 1;
    const twoDigitsMonth = String(month)[1] ? month : `0${month}`;
    const day = date.getDate();
    const twoDigitsDay = day.toString()[1] ? day : `0${day}`;
    const dateFormatting = {
      yyyy: fullYear,
      mm: twoDigitsMonth,
      dd: twoDigitsDay
    };
    const dateFormat = format.split("-");
    const first = dateFormatting[dateFormat[0]];
    const second = dateFormatting[dateFormat[1]];
    const third = dateFormatting[dateFormat[2]];
    const dateString = `${first}${divider}${second}${divider}${third}`;
    return dateString;
  };
  var formatDateTimeInputValue = (date) => {
    const dateString = formatSplitDate(new Date(date), "-", "yyyy-mm-dd");
    const hours = date.getHours();
    const twoDigitsHours = hours.toString()[1] ? hours : `0${hours}`;
    const minutes = date.getMinutes();
    const twoDigitsMinutes = minutes.toString()[1] ? minutes : `0${minutes}`;
    const dateTimeString = `${dateString}T${twoDigitsHours}:${twoDigitsMinutes}`;
    return dateTimeString;
  };
  var addMinutesToDate = (date, minutes) => {
    const addedMinutes = minutes * 60 * 1e3;
    const copiedDate = new Date(date.getTime());
    const time = copiedDate.getTime();
    const newTimeNumber = copiedDate.setTime(time + addedMinutes);
    const dateWithAddedMin = new Date(newTimeNumber);
    return dateWithAddedMin;
  };

  // src/views/AddEvent/EventDateSelect.ts
  function DateSelect(eventState, onEventStateChange) {
    const dateContainer = Div({ styles: { padding: "12px" } });
    const startTimeInputEl = (type, newValue) => {
      return Input({
        selectors: { id: "start" },
        attr: {
          type,
          value: type === "date" ? formatSplitDate(eventState.start, "-", "yyyy-mm-dd") : formatDateTimeInputValue(eventState.start),
          required: true,
          onchange: (e) => {
            const selectedValue = e.target.value;
            let newStartDate = new Date(selectedValue);
            if (eventState.allDay) {
              const selectedValueToMidnight = newStartDate.toUTCString().split("GMT")[0];
              newStartDate = new Date(selectedValueToMidnight);
            }
            const endDateTime = byId("end");
            const newEndDate = addMinutesToDate(newStartDate, 30);
            if (endDateTime) {
              const endDateTimeString = formatDateTimeInputValue(newEndDate);
              endDateTime.value = endDateTimeString;
            }
            console.log("new start date will be", newStartDate);
            onEventStateChange({
              start: newStartDate,
              end: endDateTime ? newEndDate : void 0
            });
          }
        },
        styles: {
          marginRight: "12px"
        }
      });
    };
    dateContainer.appendChild(
      startTimeInputEl(
        eventState.allDay ? "date" : "datetime-local",
        eventState.start
      )
    );
    const toLabel = Label({
      attr: { innerText: "to" },
      styles: {
        marginRight: "12px"
      }
    });
    if (!eventState.allDay) {
      dateContainer.appendChild(toLabel);
    }
    const endTimeInput = () => Input({
      attr: {
        type: "datetime-local",
        value: eventState.end ? formatDateTimeInputValue(eventState.end) : "",
        required: true,
        onchange: (e) => {
          onEventStateChange({
            end: new Date(e.target.value)
          });
        }
      },
      styles: {
        marginRight: "12px"
      },
      selectors: { id: "end" }
    });
    if (!eventState.allDay) {
      dateContainer.appendChild(endTimeInput());
    }
    const allDayInput = Input({
      attr: {
        type: "checkbox",
        checked: eventState.allDay,
        onchange: (e) => {
          const isChecked = e.target.checked;
          const dateInput = byId("start");
          const endDatetimeInput = byId("end");
          if (isChecked) {
            dateContainer.removeChild(dateInput);
            dateContainer.removeChild(toLabel);
            dateContainer.removeChild(endDatetimeInput);
            dateContainer.prepend(startTimeInputEl("date", eventState.start));
          } else {
            dateContainer.prepend(endTimeInput());
            dateContainer.prepend(toLabel);
            dateContainer.prepend(
              startTimeInputEl("datetime-local", eventState.start)
            );
            dateContainer.removeChild(dateInput);
          }
          console.log("start", eventState.start);
          onEventStateChange({
            allDay: isChecked,
            end: isChecked ? void 0 : eventState.end
          });
        }
      },
      selectors: {
        id: "allDay"
      }
    });
    dateContainer.appendChild(allDayInput);
    const allDayLabel = Label({
      attr: { innerText: "All day", for: "allDay" }
    });
    dateContainer.appendChild(allDayLabel);
    return dateContainer;
  }

  // src/components/elements/H3.ts
  function H3(props) {
    return Element(__spreadValues({
      tag: "h3"
    }, props));
  }

  // src/views/AddEvent/AddEvent.ts
  function AddEvent() {
    let eventState = {
      title: "",
      description: "",
      start: new Date(),
      allDay: false
      // users: [] as string[],
    };
    const form = document.createElement("form");
    const addEventHeader = H3({ attr: { innerText: "Add event" } });
    form.appendChild(addEventHeader);
    const titleContainer = Div({ styles: { padding: "12px" } });
    const titleInput = Input({
      attr: {
        name: "title",
        value: eventState["title"],
        onchange: (e) => {
          setEventState({ title: e.target.value });
        },
        placeholder: "Title",
        required: true
      }
    });
    titleContainer.appendChild(titleInput);
    form.appendChild(titleContainer);
    const descriptionContainer = Div({
      styles: { padding: "12px", display: "flex", flexDirection: "column" }
    });
    const descriptionLabel = Label({ attr: { innerText: "Description" } });
    const descriptionInput = Textarea({
      attr: {
        name: "description",
        value: eventState["description"],
        onchange: (e) => {
          setEventState({
            description: e.target.value
          });
        },
        placeholder: "Write something..."
      }
    });
    descriptionContainer.appendChild(descriptionLabel);
    descriptionContainer.appendChild(descriptionInput);
    form.appendChild(descriptionContainer);
    const dateContainer = DateSelect(eventState, setEventState);
    form.appendChild(dateContainer);
    const buttons = Div({
      styles: { display: "flex", justifyContent: "flex-end", marginTop: "24px" }
    });
    const buttonStyles = {
      borderRadius: "4px",
      padding: "8px 12px",
      fontSize: "14px",
      border: "none",
      background: "#79B2AF",
      color: basics.whiteColor,
      minWidth: "100px",
      minHeight: "36px",
      fontFamily: fonts.regular,
      letterSpacing: "1",
      marginLeft: "24px",
      cursor: "pointer"
    };
    const cancelButton = Button({
      attr: {
        textContent: "Cancel"
      }
    });
    onClick(cancelButton, () => setURL(`/`));
    setStyle(cancelButton, buttonStyles);
    const saveButton = Button({
      attr: {
        textContent: "Save",
        type: "submit"
      }
    });
    setStyle(saveButton, buttonStyles);
    buttons.appendChild(cancelButton);
    buttons.appendChild(saveButton);
    form.appendChild(buttons);
    form.onsubmit = (e) => {
      e.preventDefault();
      console.log("e", eventState);
      let start = eventState.start;
      if (eventState.allDay) {
        const midnightDate = new Date(eventState.start.getTime());
        midnightDate.setUTCHours(0, 0, 0, 0);
        start = midnightDate;
        delete eventState.end;
      }
      eventState = __spreadProps(__spreadValues({}, eventState), { start });
      createEvent(eventState);
      const startDateISO = eventState.start.toISOString();
      const startDate = startDateISO.split("T")[0];
      const dateURLparam = startDate.replace(/-/g, "/");
      setURL(`/day/${dateURLparam}`);
    };
    return form;
    function setEventState(newValue) {
      const modifiedEvent = __spreadValues(__spreadValues({}, eventState), newValue);
      eventState = modifiedEvent;
    }
    function onUsersSelectChange(selectedOptions) {
      var _a;
      const selectedUsersKeys = (_a = Array.from(selectedOptions)) == null ? void 0 : _a.map(
        (selectedUser) => {
          return selectedUser.value;
        }
      );
      setEventState({ users: selectedUsersKeys });
    }
  }

  // src/components/elements/Span.ts
  function Span(props) {
    return Element(__spreadValues({
      tag: "span"
    }, props));
  }

  // src/components/elements/H1.ts
  function H1(props) {
    return Element(__spreadValues({
      tag: "h1"
    }, props));
  }

  // src/views/Day/Day.ts
  function Day(date) {
    let dayView = date ? new Date(date) : new Date();
    const el = Div({
      styles: {
        maxWidth: "1200px",
        marginLeft: "auto",
        marginRight: "auto"
      }
    });
    function init() {
      return __async(this, null, function* () {
        const headerDate = Div({
          styles: __spreadProps(__spreadValues({}, flexAlignItemsCenter), {
            justifyContent: "space-between",
            margin: "12px 20px"
          })
        });
        const title = H1({
          attr: {
            innerText: new Intl.DateTimeFormat("en-US", dateOptions).format(
              dayView
            )
          }
        });
        setStyle(title, {
          padding: "12px",
          margin: "12px 20px"
        });
        const prevDay = Button({
          attr: {
            textContent: "prev",
            onclick: () => goToSelectedDayView(dayView, "previous")
          }
        });
        const nextDay = Button({
          attr: {
            textContent: "next",
            onclick: () => goToSelectedDayView(dayView, "next")
          }
        });
        headerDate.appendChild(prevDay);
        headerDate.appendChild(title);
        headerDate.appendChild(nextDay);
        el.appendChild(headerDate);
        const eventsList = Div();
        const events = yield getEventsForDay(dayView);
        if (events.length) {
          events.sort(
            (date1, date2) => date1.start.valueOf() - date2.start.valueOf()
          );
          events.forEach((event) => {
            if (event.allDay) {
              const allDayEventStyles = {
                borderRadius: "4px",
                padding: "12px",
                margin: "12px 20px",
                width: "auto",
                backgroundColor: "papayawhip",
                cursor: "pointer"
              };
              const allDayEvents = createEventCard(event, allDayEventStyles);
              el.appendChild(allDayEvents);
            } else {
              const eventContainer = Div({
                styles: __spreadValues({
                  borderRadius: "4px",
                  margin: "12px 20px",
                  gridGap: "20px"
                }, flexAlignItemsCenter)
              });
              const times = Div({
                styles: {
                  display: "flex",
                  justifyContent: "space-around",
                  marginBottom: "auto",
                  maxWidth: "160px",
                  width: "100%"
                }
              });
              const start = Span({
                attr: {
                  innerText: `${formatDateTime(
                    "en-CA",
                    timeOptions,
                    event.start
                  )} - `
                }
              });
              times.appendChild(start);
              if (event.end) {
                const end = Span({
                  attr: {
                    innerText: `${formatDateTime("en-CA", timeOptions, event.end)}`
                  }
                });
                times.appendChild(end);
              }
              eventContainer.appendChild(times);
              const eventStyles = {
                borderRadius: "4px",
                padding: "12px",
                width: "100%",
                backgroundColor: "#d2e7de",
                cursor: "pointer",
                maxWidth: "980px"
              };
              const eventCard = createEventCard(event, eventStyles);
              eventContainer.appendChild(eventCard);
              eventsList.appendChild(eventContainer);
            }
          });
          el.appendChild(eventsList);
        } else {
          const noEventsLabel = Div({
            attr: { innerText: "No events this day" },
            styles: { margin: "12px 20px" }
          });
          el.appendChild(noEventsLabel);
        }
      });
    }
    init();
    return el;
  }
  function createEventCard(event, styles) {
    const eventCard = Div({ styles });
    const title = H3({ attr: { innerText: event.title } });
    eventCard.appendChild(title);
    onClick(eventCard, () => setURL(`/events/${event._id}`));
    return eventCard;
  }
  function goToSelectedDayView(currentDayView, direction) {
    const moveDay = direction === "previous" ? currentDayView.getDate() - 1 : currentDayView.getDate() + 1;
    const previousDay = currentDayView.setDate(moveDay);
    currentDayView = new Date(previousDay);
    const dateString = formatSplitDate(currentDayView, "/", "yyyy-mm-dd");
    setURL(`/day/${dateString}`);
  }

  // src/components/elements/Form.ts
  function Form(props) {
    return Element(__spreadValues({
      tag: "form"
    }, props));
  }

  // src/views/EditEvent/EditEvent.ts
  function EditEvent(event) {
    let eventState = __spreadValues({}, event);
    const setEventState = (newValue) => {
      Object.assign(eventState, newValue);
    };
    const form = Form();
    const editEventHeader = H3({ attr: { innerText: "Edit event" } });
    form.appendChild(editEventHeader);
    const titleContainer = Div({ styles: { padding: "12px" } });
    const titleInput = Input({
      attr: {
        name: "title",
        value: event["title"],
        onchange: (e) => {
          setEventState({ title: e.target.value });
        },
        placeholder: "Title",
        required: true
      }
    });
    titleContainer.appendChild(titleInput);
    form.appendChild(titleContainer);
    const descriptionContainer = Div({
      styles: { padding: "12px", display: "flex", flexDirection: "column" }
    });
    const descriptionLabel = Label({ attr: { innerText: "Description" } });
    const descriptionInput = Textarea({
      attr: {
        name: "description",
        value: event["description"],
        onchange: (e) => {
          setEventState({
            description: e.target.value
          });
        },
        placeholder: "Write something..."
      }
    });
    descriptionContainer.appendChild(descriptionLabel);
    descriptionContainer.appendChild(descriptionInput);
    form.appendChild(descriptionContainer);
    const dateContainer = DateSelect(eventState, setEventState);
    form.appendChild(dateContainer);
    const buttons = Div({
      styles: { display: "flex", justifyContent: "flex-end", marginTop: "24px" }
    });
    const buttonStyles = {
      borderRadius: "4px",
      padding: "8px 12px",
      fontSize: "14px",
      border: "none",
      background: "#79B2AF",
      color: basics.whiteColor,
      minWidth: "100px",
      minHeight: "36px",
      fontFamily: fonts.regular,
      letterSpacing: "1",
      marginLeft: "24px",
      cursor: "pointer"
    };
    const cancelButton = Button({
      attr: {
        textContent: "Cancel",
        onclick: () => setURL("/")
      },
      styles: buttonStyles
    });
    const saveButton = Button({
      attr: {
        textContent: "Save",
        type: "submit"
      },
      styles: buttonStyles
    });
    buttons.appendChild(cancelButton);
    buttons.appendChild(saveButton);
    form.appendChild(buttons);
    form.onsubmit = (e) => {
      e.preventDefault();
      let start = eventState.start;
      if (eventState.allDay) {
        const midnightDate = new Date(eventState.start.getTime());
        midnightDate.setUTCHours(0, 0, 0, 0);
        start = midnightDate;
        delete eventState.end;
      }
      setEventState({ start });
      console.log("event State sent", eventState);
    };
    return form;
  }

  // src/views/Event/Event.ts
  function Event2(event) {
    const el = Div({ styles: { padding: "12px" } });
    const title = H3({
      attr: {
        innerText: event.title
      },
      styles: { padding: "4px 0" }
    });
    el.appendChild(title);
    if (event.description) {
      const description = Div({ styles: { padding: "4px 0" } });
      description.innerText = event.description;
      el.appendChild(description);
    }
    if (event.allDay) {
      const day = Div({ styles: { padding: "4px 0" } });
      day.innerText = `${formatDateTime("en-CA", dateOptions, event.start)}`;
      el.appendChild(day);
    }
    if (event.start && event.end) {
      const start = Div({
        attr: {
          innerText: `Start: ${formatDateTime(
            "en-CA",
            dateTimeOptions,
            event.start
          )}`
        },
        styles: { padding: "4px 0" }
      });
      el.appendChild(start);
      const end = Div({ styles: { padding: "4px 0" } });
      end.innerHTML = `End: ${formatDateTime(
        "en-CA",
        dateTimeOptions,
        event.end
      )}`;
      el.appendChild(end);
    }
    const button = Button({
      attr: {
        textContent: "Delete",
        onclick: (e) => __async(this, null, function* () {
          e.preventDefault();
          try {
            yield deleteEvent(event._id);
            setURL("/");
          } catch (e2) {
            const temporaryError = Div({
              attr: {
                innerText: "Could not delete event"
              }
            });
            el.appendChild(temporaryError);
          }
        })
      },
      styles: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "24px",
        cursor: "pointer"
      }
    });
    el.appendChild(button);
    return el;
  }

  // src/views/Header/Header.ts
  var headerTopLeftButton = {
    home: "",
    day: "Go to today",
    edit: "< Back",
    //hide edit until I get back to edit event view
    event: "< Back",
    new: "Home"
  };
  function Header(view) {
    var _a;
    const isHome = view === "home";
    const isEvent = view === "event";
    const isEditEvent = view === "edit";
    const newEvent = view === "new";
    const windowPath = window.location.pathname;
    const pathSplit = windowPath.split("/");
    const eventId = (_a = pathSplit[pathSplit.length - 1]) == null ? void 0 : _a.toString();
    const el = Div({
      styles: __spreadProps(__spreadValues({
        height: "80px",
        backgroundColor: basics.whiteColor,
        boxShadow: "0px 4px 4px rgba(238, 238, 238, 0.25)",
        margin: "12px 20px"
      }, flexAlignItemsCenter), {
        justifyContent: "space-between"
      })
    });
    const onLeftButtonClick = isEvent ? () => history.back() : () => setURL(`/`);
    const leftButton = Button({
      attr: {
        textContent: headerTopLeftButton[view],
        onclick: (e) => {
          e.preventDefault();
          onLeftButtonClick();
        }
      }
    });
    !isHome && el.append(leftButton);
    if (!isEditEvent && !newEvent) {
      const rightButton = Button({
        attr: {
          textContent: "Add Event",
          onclick: (e) => {
            e.preventDefault();
            setURL("/new");
          }
        },
        styles: {
          marginLeft: "auto"
        }
      });
      el.append(rightButton);
    }
    return el;
  }

  // src/views/Router.ts
  function Router() {
    const router = Div();
    setStyle(router, {
      flexGrow: "1"
    });
    function init() {
      handleRouteUpdated();
    }
    window.addEventListener("popstate", handleRouteUpdated);
    function handleRouteUpdated() {
      return __async(this, null, function* () {
        var _a;
        router.innerHTML = "";
        const path = window.location.pathname;
        const isHome = path === "/";
        const addNewEventPath = path === "/new";
        const isDay = path.includes("day");
        let eventObject;
        let eventsDate = new Date().toDateString();
        if (!isHome && !addNewEventPath && !isDay) {
          const pathSplit = path.split("/");
          const eventId = (_a = pathSplit[pathSplit.length - 1]) == null ? void 0 : _a.toString();
          eventObject = yield getEventById(eventId);
          if (!eventObject) {
            setURL("/");
          }
        }
        if (isDay) {
          const splitDate = path.split("/");
          const fullYear = splitDate[2];
          const month = splitDate[3];
          const day = splitDate[4];
          eventsDate = isDay ? `/day/${fullYear}/${month}/${day}` : "/";
        }
        switch (path) {
          case "/":
            router.append(Header("home"));
            router.append(Day());
            break;
          case eventsDate:
            router.append(Header("day"));
            router.append(Day(eventsDate));
            break;
          case `/events/${eventObject == null ? void 0 : eventObject._id}`:
            if (eventObject) {
              router.append(Header("event"));
              router.append(Event2(eventObject));
            }
            break;
          case `/events/edit/${eventObject == null ? void 0 : eventObject._id}`:
            if (eventObject) {
              router.append(Header("edit"));
              router.append(EditEvent(eventObject));
            }
            break;
          case `/new`:
            router.append(Header("new"));
            router.append(AddEvent());
            break;
          default:
            break;
        }
      });
    }
    init();
    return router;
  }

  // src/app.ts
  function run() {
    return __async(this, null, function* () {
      const root = document.getElementById("root");
      if (root) {
        const router = Router();
        root.append(router);
      }
    });
  }
  run();
})();
