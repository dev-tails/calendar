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

  // src/utils/HistoryUtils.ts
  function setURL(url) {
    history.pushState({}, "", url);
    window.dispatchEvent(new Event("popstate"));
  }

  // src/apis/Api.ts
  function httpGet(url) {
    return __async(this, null, function* () {
      const res = yield fetch(url);
      if (res.status === 404) {
        setURL("/");
        return null;
      }
      const jsonData = yield res.json();
      return jsonData.data;
    });
  }

  // src/apis/UserApi.ts
  var self = null;
  var selfPromise = null;
  var users = null;
  var usersPromise = null;
  var loggedIn = false;
  function initializeUserApi() {
    return __async(this, null, function* () {
      self = yield fetchSelf();
      users = yield getUsers();
    });
  }
  function isLoggedIn() {
    return loggedIn;
  }
  function fetchSelf() {
    return __async(this, null, function* () {
      try {
        if (!selfPromise) {
          selfPromise = yield httpGet(`/api/users/self`);
        }
        const user = selfPromise;
        return user;
      } catch (err) {
        loggedIn = false;
        return null;
      }
    });
  }
  function getUsers() {
    return __async(this, null, function* () {
      try {
        if (!usersPromise) {
          usersPromise = yield httpGet(`/api/users/`);
        }
        const allUsers = usersPromise || [];
        loggedIn = true;
        return allUsers;
      } catch (err) {
        loggedIn = false;
        return [];
      }
    });
  }

  // src/utils/DOMutils.ts
  function byId(id) {
    const el = document.getElementById(id);
    if (!el) {
      throw Error(`No element with id ${id}`);
    }
    return el;
  }
  function setStyle(el, styles3) {
    for (const key of Object.keys(styles3)) {
      const elementKey = key;
      const stylesKey = styles3[key];
      if (stylesKey)
        el.style[elementKey] = stylesKey;
    }
  }

  // src/components/elements/Element.ts
  function Element(props) {
    const el = document.createElement(props.tag);
    if (!(props == null ? void 0 : props.selectors) && !(props == null ? void 0 : props.attr) && !(props == null ? void 0 : props.styles)) {
      return el;
    }
    const { selectors, attr, styles: styles3 } = props;
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
    if (styles3) {
      setStyle(el, styles3);
    }
    return el;
  }

  // src/components/elements/Button.ts
  function Button(props) {
    return Element(__spreadValues({
      tag: "button"
    }, props));
  }

  // src/components/elements/Div.ts
  function Div(props) {
    return Element(__spreadValues({
      tag: "div"
    }, props));
  }

  // src/components/elements/Form.ts
  function Form(props) {
    return Element(__spreadValues({
      tag: "form"
    }, props));
  }

  // src/components/elements/H1.ts
  function H1(props) {
    return Element(__spreadValues({
      tag: "h1"
    }, props));
  }

  // src/components/elements/H3.ts
  function H3(props) {
    return Element(__spreadValues({
      tag: "h3"
    }, props));
  }

  // src/components/elements/Input.ts
  function Input(props) {
    return Element(__spreadValues({
      tag: "input"
    }, props));
  }

  // src/components/elements/Label.ts
  function Label(props) {
    return Element(__spreadValues({
      tag: "label"
    }, props));
  }

  // src/components/elements/P.ts
  function P(props) {
    return Element(__spreadValues({
      tag: "p"
    }, props));
  }

  // src/components/elements/Span.ts
  function Span(props) {
    return Element(__spreadValues({
      tag: "span"
    }, props));
  }

  // src/components/elements/Textarea.ts
  function Textarea(props) {
    return Element(__spreadValues({
      tag: "textarea"
    }, props));
  }

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
  var createEvent = (event, sendEmail) => __async(void 0, null, function* () {
    const res = yield fetch(`/api/events${sendEmail ? "?sendEmail=true" : ""}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(event)
    });
    if (res.ok) {
      const eventId = yield res.json();
      return eventId.data;
    } else {
      throw new Error(res.statusText || "Event could not be created.");
    }
  });
  var editEvent = (event, sendEmail) => __async(void 0, null, function* () {
    const res = yield fetch(
      `/api/events/${event._id}${sendEmail ? "?sendEmail=true" : ""}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: event._id, body: event })
      }
    );
    if (res.ok) {
      const modifiedEvent = yield res.json();
      return modifiedEvent;
    } else {
      throw new Error(res.statusText || "Event could not be edited.");
    }
  });
  var deleteEvent = (eventId, sendEmail) => __async(void 0, null, function* () {
    if (!eventId) {
      throw new Error("Event id must exist.");
    }
    const res = yield fetch(
      `/api/events/${eventId}${sendEmail ? "?sendEmail=true" : ""}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    if (res.ok) {
      const response = yield res.json();
      return !!response.success;
    } else {
      throw new Error(res.statusText || "Event could not be deleted.");
    }
  });

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
    minute: "2-digit"
  };
  var addTimeZoneOptions = {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timeZoneName: "short"
  };
  var formatDateTime = (options, time, locales) => {
    return new Intl.DateTimeFormat(locales || "en-CA", options).format(time);
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
    const dateString = formatSplitDate(date, "-", "yyyy-mm-dd");
    const hours2 = date.getHours();
    const twoDigitsHours = hours2.toString()[1] ? hours2 : `0${hours2}`;
    const minutes = date.getMinutes();
    const twoDigitsMinutes = minutes.toString()[1] ? minutes : `0${minutes}`;
    const dateTimeString = `${dateString}T${twoDigitsHours}:${twoDigitsMinutes}`;
    return dateTimeString;
  };
  var convertMidnightUTCToLocalDay = (date) => {
    const utcMidnightDate = date.getUTCDate();
    const utcMidnightMonth = date.getUTCMonth();
    const utcMidnightFullYear = date.getUTCFullYear();
    const copiedDate = new Date(date.getTime());
    copiedDate.setDate(utcMidnightDate);
    copiedDate.setMonth(utcMidnightMonth);
    copiedDate.setFullYear(utcMidnightFullYear);
    return copiedDate;
  };
  var addLocalTimeToDate = (date) => {
    const currentTime = new Date();
    const currentTimeHrs = currentTime.getHours();
    const currentTimeMin = currentTime.getMinutes();
    const currentTimeSec = currentTime.getSeconds();
    const currentTimeMs = currentTime.getMilliseconds();
    const copiedDate = new Date(date.getTime());
    copiedDate.setHours(
      currentTimeHrs,
      currentTimeMin,
      currentTimeSec,
      currentTimeMs
    );
    return copiedDate;
  };
  var addMinutesToDate = (date, minutes) => {
    const addedMinutes = minutes * 60 * 1e3;
    const copiedDate = new Date(date.getTime());
    const time = copiedDate.getTime();
    const newTimeNumber = copiedDate.setTime(time + addedMinutes);
    const dateWithAddedMin = new Date(newTimeNumber);
    return dateWithAddedMin;
  };
  var getDateStringFromUrl = () => {
    const path = window.location.pathname;
    const splitDate = path.split("/");
    const fullYear = splitDate[2];
    const month = splitDate[3];
    const day = splitDate[4];
    return `${fullYear}/${month}/${day}`;
  };

  // src/utils/styles.ts
  var basics = {
    whiteColor: "#fff",
    darkCharcoal: "#333",
    slateGray: "#708090",
    spanishGray: "#999",
    silver: "#cccccc",
    cultured: "#f5f5f5",
    granite: "#676767"
  };
  var colors = {
    mainTurquoise: "#438796",
    accentPlum: "#6E526F",
    accentPlumLight: "#6e526f36",
    eggplant: "#78636f",
    honeydew: "#d2e7de",
    // greenSheen: '#7fae9e',
    greenSheen: "#73a196",
    mountbattenPink: "#9d8793",
    springWaterTurquoise: "#79b3af",
    strongRed: "#cc3333",
    opal: "#99b1ad",
    royalBlueLight: "#5770d8",
    violetGlow: "#6348d7",
    keppel: "#59c0a7",
    mandarine: "#E07A5F",
    lightOrange: "#f4c984"
  };
  var fonts = {
    montserrat: "Montserrat, sans-serif",
    garamond: "EB Garamond, serif",
    poppins: "Poppins, sans-serif",
    raleway: "Raleway', sans-serif"
  };
  var fontsWeight = {
    regular: "400",
    semiBold: "600"
  };
  var flexAlignItemsCenter = {
    display: "flex",
    alignItems: "center"
  };

  // node_modules/@fortawesome/fontawesome-svg-core/index.mjs
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
    return target;
  }
  function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
      return typeof obj2;
    } : function(obj2) {
      return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr))
      return _arrayLikeToArray(arr);
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
      return Array.from(iter);
  }
  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null)
      return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i)
          break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null)
          _i["return"]();
      } finally {
        if (_d)
          throw _e;
      }
    }
    return _arr;
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++)
      arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var noop = function noop2() {
  };
  var _WINDOW = {};
  var _DOCUMENT = {};
  var _MUTATION_OBSERVER = null;
  var _PERFORMANCE = {
    mark: noop,
    measure: noop
  };
  try {
    if (typeof window !== "undefined")
      _WINDOW = window;
    if (typeof document !== "undefined")
      _DOCUMENT = document;
    if (typeof MutationObserver !== "undefined")
      _MUTATION_OBSERVER = MutationObserver;
    if (typeof performance !== "undefined")
      _PERFORMANCE = performance;
  } catch (e) {
  }
  var _ref = _WINDOW.navigator || {};
  var _ref$userAgent = _ref.userAgent;
  var userAgent = _ref$userAgent === void 0 ? "" : _ref$userAgent;
  var WINDOW = _WINDOW;
  var DOCUMENT = _DOCUMENT;
  var MUTATION_OBSERVER = _MUTATION_OBSERVER;
  var PERFORMANCE = _PERFORMANCE;
  var IS_BROWSER = !!WINDOW.document;
  var IS_DOM = !!DOCUMENT.documentElement && !!DOCUMENT.head && typeof DOCUMENT.addEventListener === "function" && typeof DOCUMENT.createElement === "function";
  var IS_IE = ~userAgent.indexOf("MSIE") || ~userAgent.indexOf("Trident/");
  var _familyProxy;
  var _familyProxy2;
  var _familyProxy3;
  var _familyProxy4;
  var _familyProxy5;
  var NAMESPACE_IDENTIFIER = "___FONT_AWESOME___";
  var UNITS_IN_GRID = 16;
  var DEFAULT_CSS_PREFIX = "fa";
  var DEFAULT_REPLACEMENT_CLASS = "svg-inline--fa";
  var DATA_FA_I2SVG = "data-fa-i2svg";
  var DATA_FA_PSEUDO_ELEMENT = "data-fa-pseudo-element";
  var DATA_FA_PSEUDO_ELEMENT_PENDING = "data-fa-pseudo-element-pending";
  var DATA_PREFIX = "data-prefix";
  var DATA_ICON = "data-icon";
  var HTML_CLASS_I2SVG_BASE_CLASS = "fontawesome-i2svg";
  var MUTATION_APPROACH_ASYNC = "async";
  var TAGNAMES_TO_SKIP_FOR_PSEUDOELEMENTS = ["HTML", "HEAD", "STYLE", "SCRIPT"];
  var PRODUCTION = function() {
    try {
      return false;
    } catch (e) {
      return false;
    }
  }();
  var FAMILY_CLASSIC = "classic";
  var FAMILY_SHARP = "sharp";
  var FAMILIES = [FAMILY_CLASSIC, FAMILY_SHARP];
  function familyProxy(obj) {
    return new Proxy(obj, {
      get: function get2(target, prop) {
        return prop in target ? target[prop] : target[FAMILY_CLASSIC];
      }
    });
  }
  var PREFIX_TO_STYLE = familyProxy((_familyProxy = {}, _defineProperty(_familyProxy, FAMILY_CLASSIC, {
    "fa": "solid",
    "fas": "solid",
    "fa-solid": "solid",
    "far": "regular",
    "fa-regular": "regular",
    "fal": "light",
    "fa-light": "light",
    "fat": "thin",
    "fa-thin": "thin",
    "fad": "duotone",
    "fa-duotone": "duotone",
    "fab": "brands",
    "fa-brands": "brands",
    "fak": "kit",
    "fa-kit": "kit"
  }), _defineProperty(_familyProxy, FAMILY_SHARP, {
    "fa": "solid",
    "fass": "solid",
    "fa-solid": "solid"
  }), _familyProxy));
  var STYLE_TO_PREFIX = familyProxy((_familyProxy2 = {}, _defineProperty(_familyProxy2, FAMILY_CLASSIC, {
    "solid": "fas",
    "regular": "far",
    "light": "fal",
    "thin": "fat",
    "duotone": "fad",
    "brands": "fab",
    "kit": "fak"
  }), _defineProperty(_familyProxy2, FAMILY_SHARP, {
    "solid": "fass"
  }), _familyProxy2));
  var PREFIX_TO_LONG_STYLE = familyProxy((_familyProxy3 = {}, _defineProperty(_familyProxy3, FAMILY_CLASSIC, {
    "fab": "fa-brands",
    "fad": "fa-duotone",
    "fak": "fa-kit",
    "fal": "fa-light",
    "far": "fa-regular",
    "fas": "fa-solid",
    "fat": "fa-thin"
  }), _defineProperty(_familyProxy3, FAMILY_SHARP, {
    "fass": "fa-solid"
  }), _familyProxy3));
  var LONG_STYLE_TO_PREFIX = familyProxy((_familyProxy4 = {}, _defineProperty(_familyProxy4, FAMILY_CLASSIC, {
    "fa-brands": "fab",
    "fa-duotone": "fad",
    "fa-kit": "fak",
    "fa-light": "fal",
    "fa-regular": "far",
    "fa-solid": "fas",
    "fa-thin": "fat"
  }), _defineProperty(_familyProxy4, FAMILY_SHARP, {
    "fa-solid": "fass"
  }), _familyProxy4));
  var ICON_SELECTION_SYNTAX_PATTERN = /fa(s|r|l|t|d|b|k|ss)?[\-\ ]/;
  var LAYERS_TEXT_CLASSNAME = "fa-layers-text";
  var FONT_FAMILY_PATTERN = /Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp|Kit)?.*/i;
  var FONT_WEIGHT_TO_PREFIX = familyProxy((_familyProxy5 = {}, _defineProperty(_familyProxy5, FAMILY_CLASSIC, {
    "900": "fas",
    "400": "far",
    "normal": "far",
    "300": "fal",
    "100": "fat"
  }), _defineProperty(_familyProxy5, FAMILY_SHARP, {
    "900": "fass"
  }), _familyProxy5));
  var oneToTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  var oneToTwenty = oneToTen.concat([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  var ATTRIBUTES_WATCHED_FOR_MUTATION = ["class", "data-prefix", "data-icon", "data-fa-transform", "data-fa-mask"];
  var DUOTONE_CLASSES = {
    GROUP: "duotone-group",
    SWAP_OPACITY: "swap-opacity",
    PRIMARY: "primary",
    SECONDARY: "secondary"
  };
  var prefixes = /* @__PURE__ */ new Set();
  Object.keys(STYLE_TO_PREFIX[FAMILY_CLASSIC]).map(prefixes.add.bind(prefixes));
  Object.keys(STYLE_TO_PREFIX[FAMILY_SHARP]).map(prefixes.add.bind(prefixes));
  var RESERVED_CLASSES = [].concat(FAMILIES, _toConsumableArray(prefixes), ["2xs", "xs", "sm", "lg", "xl", "2xl", "beat", "border", "fade", "beat-fade", "bounce", "flip-both", "flip-horizontal", "flip-vertical", "flip", "fw", "inverse", "layers-counter", "layers-text", "layers", "li", "pull-left", "pull-right", "pulse", "rotate-180", "rotate-270", "rotate-90", "rotate-by", "shake", "spin-pulse", "spin-reverse", "spin", "stack-1x", "stack-2x", "stack", "ul", DUOTONE_CLASSES.GROUP, DUOTONE_CLASSES.SWAP_OPACITY, DUOTONE_CLASSES.PRIMARY, DUOTONE_CLASSES.SECONDARY]).concat(oneToTen.map(function(n) {
    return "".concat(n, "x");
  })).concat(oneToTwenty.map(function(n) {
    return "w-".concat(n);
  }));
  var initial = WINDOW.FontAwesomeConfig || {};
  function getAttrConfig(attr) {
    var element = DOCUMENT.querySelector("script[" + attr + "]");
    if (element) {
      return element.getAttribute(attr);
    }
  }
  function coerce(val) {
    if (val === "")
      return true;
    if (val === "false")
      return false;
    if (val === "true")
      return true;
    return val;
  }
  if (DOCUMENT && typeof DOCUMENT.querySelector === "function") {
    attrs = [["data-family-prefix", "familyPrefix"], ["data-css-prefix", "cssPrefix"], ["data-family-default", "familyDefault"], ["data-style-default", "styleDefault"], ["data-replacement-class", "replacementClass"], ["data-auto-replace-svg", "autoReplaceSvg"], ["data-auto-add-css", "autoAddCss"], ["data-auto-a11y", "autoA11y"], ["data-search-pseudo-elements", "searchPseudoElements"], ["data-observe-mutations", "observeMutations"], ["data-mutate-approach", "mutateApproach"], ["data-keep-original-source", "keepOriginalSource"], ["data-measure-performance", "measurePerformance"], ["data-show-missing-icons", "showMissingIcons"]];
    attrs.forEach(function(_ref2) {
      var _ref22 = _slicedToArray(_ref2, 2), attr = _ref22[0], key = _ref22[1];
      var val = coerce(getAttrConfig(attr));
      if (val !== void 0 && val !== null) {
        initial[key] = val;
      }
    });
  }
  var attrs;
  var _default = {
    styleDefault: "solid",
    familyDefault: "classic",
    cssPrefix: DEFAULT_CSS_PREFIX,
    replacementClass: DEFAULT_REPLACEMENT_CLASS,
    autoReplaceSvg: true,
    autoAddCss: true,
    autoA11y: true,
    searchPseudoElements: false,
    observeMutations: true,
    mutateApproach: "async",
    keepOriginalSource: true,
    measurePerformance: false,
    showMissingIcons: true
  };
  if (initial.familyPrefix) {
    initial.cssPrefix = initial.familyPrefix;
  }
  var _config = _objectSpread2(_objectSpread2({}, _default), initial);
  if (!_config.autoReplaceSvg)
    _config.observeMutations = false;
  var config = {};
  Object.keys(_default).forEach(function(key) {
    Object.defineProperty(config, key, {
      enumerable: true,
      set: function set2(val) {
        _config[key] = val;
        _onChangeCb.forEach(function(cb) {
          return cb(config);
        });
      },
      get: function get2() {
        return _config[key];
      }
    });
  });
  Object.defineProperty(config, "familyPrefix", {
    enumerable: true,
    set: function set(val) {
      _config.cssPrefix = val;
      _onChangeCb.forEach(function(cb) {
        return cb(config);
      });
    },
    get: function get() {
      return _config.cssPrefix;
    }
  });
  WINDOW.FontAwesomeConfig = config;
  var _onChangeCb = [];
  function onChange(cb) {
    _onChangeCb.push(cb);
    return function() {
      _onChangeCb.splice(_onChangeCb.indexOf(cb), 1);
    };
  }
  var d = UNITS_IN_GRID;
  var meaninglessTransform = {
    size: 16,
    x: 0,
    y: 0,
    rotate: 0,
    flipX: false,
    flipY: false
  };
  function insertCss(css2) {
    if (!css2 || !IS_DOM) {
      return;
    }
    var style = DOCUMENT.createElement("style");
    style.setAttribute("type", "text/css");
    style.innerHTML = css2;
    var headChildren = DOCUMENT.head.childNodes;
    var beforeChild = null;
    for (var i = headChildren.length - 1; i > -1; i--) {
      var child = headChildren[i];
      var tagName = (child.tagName || "").toUpperCase();
      if (["STYLE", "LINK"].indexOf(tagName) > -1) {
        beforeChild = child;
      }
    }
    DOCUMENT.head.insertBefore(style, beforeChild);
    return css2;
  }
  var idPool = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  function nextUniqueId() {
    var size = 12;
    var id = "";
    while (size-- > 0) {
      id += idPool[Math.random() * 62 | 0];
    }
    return id;
  }
  function toArray(obj) {
    var array = [];
    for (var i = (obj || []).length >>> 0; i--; ) {
      array[i] = obj[i];
    }
    return array;
  }
  function classArray(node) {
    if (node.classList) {
      return toArray(node.classList);
    } else {
      return (node.getAttribute("class") || "").split(" ").filter(function(i) {
        return i;
      });
    }
  }
  function htmlEscape(str) {
    return "".concat(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function joinAttributes(attributes) {
    return Object.keys(attributes || {}).reduce(function(acc, attributeName) {
      return acc + "".concat(attributeName, '="').concat(htmlEscape(attributes[attributeName]), '" ');
    }, "").trim();
  }
  function joinStyles(styles3) {
    return Object.keys(styles3 || {}).reduce(function(acc, styleName) {
      return acc + "".concat(styleName, ": ").concat(styles3[styleName].trim(), ";");
    }, "");
  }
  function transformIsMeaningful(transform) {
    return transform.size !== meaninglessTransform.size || transform.x !== meaninglessTransform.x || transform.y !== meaninglessTransform.y || transform.rotate !== meaninglessTransform.rotate || transform.flipX || transform.flipY;
  }
  function transformForSvg(_ref2) {
    var transform = _ref2.transform, containerWidth = _ref2.containerWidth, iconWidth = _ref2.iconWidth;
    var outer = {
      transform: "translate(".concat(containerWidth / 2, " 256)")
    };
    var innerTranslate = "translate(".concat(transform.x * 32, ", ").concat(transform.y * 32, ") ");
    var innerScale = "scale(".concat(transform.size / 16 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / 16 * (transform.flipY ? -1 : 1), ") ");
    var innerRotate = "rotate(".concat(transform.rotate, " 0 0)");
    var inner = {
      transform: "".concat(innerTranslate, " ").concat(innerScale, " ").concat(innerRotate)
    };
    var path = {
      transform: "translate(".concat(iconWidth / 2 * -1, " -256)")
    };
    return {
      outer,
      inner,
      path
    };
  }
  function transformForCss(_ref2) {
    var transform = _ref2.transform, _ref2$width = _ref2.width, width = _ref2$width === void 0 ? UNITS_IN_GRID : _ref2$width, _ref2$height = _ref2.height, height = _ref2$height === void 0 ? UNITS_IN_GRID : _ref2$height, _ref2$startCentered = _ref2.startCentered, startCentered = _ref2$startCentered === void 0 ? false : _ref2$startCentered;
    var val = "";
    if (startCentered && IS_IE) {
      val += "translate(".concat(transform.x / d - width / 2, "em, ").concat(transform.y / d - height / 2, "em) ");
    } else if (startCentered) {
      val += "translate(calc(-50% + ".concat(transform.x / d, "em), calc(-50% + ").concat(transform.y / d, "em)) ");
    } else {
      val += "translate(".concat(transform.x / d, "em, ").concat(transform.y / d, "em) ");
    }
    val += "scale(".concat(transform.size / d * (transform.flipX ? -1 : 1), ", ").concat(transform.size / d * (transform.flipY ? -1 : 1), ") ");
    val += "rotate(".concat(transform.rotate, "deg) ");
    return val;
  }
  var baseStyles = ':root, :host {\n  --fa-font-solid: normal 900 1em/1 "Font Awesome 6 Solid";\n  --fa-font-regular: normal 400 1em/1 "Font Awesome 6 Regular";\n  --fa-font-light: normal 300 1em/1 "Font Awesome 6 Light";\n  --fa-font-thin: normal 100 1em/1 "Font Awesome 6 Thin";\n  --fa-font-duotone: normal 900 1em/1 "Font Awesome 6 Duotone";\n  --fa-font-sharp-solid: normal 900 1em/1 "Font Awesome 6 Sharp";\n  --fa-font-brands: normal 400 1em/1 "Font Awesome 6 Brands";\n}\n\nsvg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {\n  overflow: visible;\n  box-sizing: content-box;\n}\n\n.svg-inline--fa {\n  display: var(--fa-display, inline-block);\n  height: 1em;\n  overflow: visible;\n  vertical-align: -0.125em;\n}\n.svg-inline--fa.fa-2xs {\n  vertical-align: 0.1em;\n}\n.svg-inline--fa.fa-xs {\n  vertical-align: 0em;\n}\n.svg-inline--fa.fa-sm {\n  vertical-align: -0.0714285705em;\n}\n.svg-inline--fa.fa-lg {\n  vertical-align: -0.2em;\n}\n.svg-inline--fa.fa-xl {\n  vertical-align: -0.25em;\n}\n.svg-inline--fa.fa-2xl {\n  vertical-align: -0.3125em;\n}\n.svg-inline--fa.fa-pull-left {\n  margin-right: var(--fa-pull-margin, 0.3em);\n  width: auto;\n}\n.svg-inline--fa.fa-pull-right {\n  margin-left: var(--fa-pull-margin, 0.3em);\n  width: auto;\n}\n.svg-inline--fa.fa-li {\n  width: var(--fa-li-width, 2em);\n  top: 0.25em;\n}\n.svg-inline--fa.fa-fw {\n  width: var(--fa-fw-width, 1.25em);\n}\n\n.fa-layers svg.svg-inline--fa {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.fa-layers-counter, .fa-layers-text {\n  display: inline-block;\n  position: absolute;\n  text-align: center;\n}\n\n.fa-layers {\n  display: inline-block;\n  height: 1em;\n  position: relative;\n  text-align: center;\n  vertical-align: -0.125em;\n  width: 1em;\n}\n.fa-layers svg.svg-inline--fa {\n  -webkit-transform-origin: center center;\n          transform-origin: center center;\n}\n\n.fa-layers-text {\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  -webkit-transform-origin: center center;\n          transform-origin: center center;\n}\n\n.fa-layers-counter {\n  background-color: var(--fa-counter-background-color, #ff253a);\n  border-radius: var(--fa-counter-border-radius, 1em);\n  box-sizing: border-box;\n  color: var(--fa-inverse, #fff);\n  line-height: var(--fa-counter-line-height, 1);\n  max-width: var(--fa-counter-max-width, 5em);\n  min-width: var(--fa-counter-min-width, 1.5em);\n  overflow: hidden;\n  padding: var(--fa-counter-padding, 0.25em 0.5em);\n  right: var(--fa-right, 0);\n  text-overflow: ellipsis;\n  top: var(--fa-top, 0);\n  -webkit-transform: scale(var(--fa-counter-scale, 0.25));\n          transform: scale(var(--fa-counter-scale, 0.25));\n  -webkit-transform-origin: top right;\n          transform-origin: top right;\n}\n\n.fa-layers-bottom-right {\n  bottom: var(--fa-bottom, 0);\n  right: var(--fa-right, 0);\n  top: auto;\n  -webkit-transform: scale(var(--fa-layers-scale, 0.25));\n          transform: scale(var(--fa-layers-scale, 0.25));\n  -webkit-transform-origin: bottom right;\n          transform-origin: bottom right;\n}\n\n.fa-layers-bottom-left {\n  bottom: var(--fa-bottom, 0);\n  left: var(--fa-left, 0);\n  right: auto;\n  top: auto;\n  -webkit-transform: scale(var(--fa-layers-scale, 0.25));\n          transform: scale(var(--fa-layers-scale, 0.25));\n  -webkit-transform-origin: bottom left;\n          transform-origin: bottom left;\n}\n\n.fa-layers-top-right {\n  top: var(--fa-top, 0);\n  right: var(--fa-right, 0);\n  -webkit-transform: scale(var(--fa-layers-scale, 0.25));\n          transform: scale(var(--fa-layers-scale, 0.25));\n  -webkit-transform-origin: top right;\n          transform-origin: top right;\n}\n\n.fa-layers-top-left {\n  left: var(--fa-left, 0);\n  right: auto;\n  top: var(--fa-top, 0);\n  -webkit-transform: scale(var(--fa-layers-scale, 0.25));\n          transform: scale(var(--fa-layers-scale, 0.25));\n  -webkit-transform-origin: top left;\n          transform-origin: top left;\n}\n\n.fa-1x {\n  font-size: 1em;\n}\n\n.fa-2x {\n  font-size: 2em;\n}\n\n.fa-3x {\n  font-size: 3em;\n}\n\n.fa-4x {\n  font-size: 4em;\n}\n\n.fa-5x {\n  font-size: 5em;\n}\n\n.fa-6x {\n  font-size: 6em;\n}\n\n.fa-7x {\n  font-size: 7em;\n}\n\n.fa-8x {\n  font-size: 8em;\n}\n\n.fa-9x {\n  font-size: 9em;\n}\n\n.fa-10x {\n  font-size: 10em;\n}\n\n.fa-2xs {\n  font-size: 0.625em;\n  line-height: 0.1em;\n  vertical-align: 0.225em;\n}\n\n.fa-xs {\n  font-size: 0.75em;\n  line-height: 0.0833333337em;\n  vertical-align: 0.125em;\n}\n\n.fa-sm {\n  font-size: 0.875em;\n  line-height: 0.0714285718em;\n  vertical-align: 0.0535714295em;\n}\n\n.fa-lg {\n  font-size: 1.25em;\n  line-height: 0.05em;\n  vertical-align: -0.075em;\n}\n\n.fa-xl {\n  font-size: 1.5em;\n  line-height: 0.0416666682em;\n  vertical-align: -0.125em;\n}\n\n.fa-2xl {\n  font-size: 2em;\n  line-height: 0.03125em;\n  vertical-align: -0.1875em;\n}\n\n.fa-fw {\n  text-align: center;\n  width: 1.25em;\n}\n\n.fa-ul {\n  list-style-type: none;\n  margin-left: var(--fa-li-margin, 2.5em);\n  padding-left: 0;\n}\n.fa-ul > li {\n  position: relative;\n}\n\n.fa-li {\n  left: calc(var(--fa-li-width, 2em) * -1);\n  position: absolute;\n  text-align: center;\n  width: var(--fa-li-width, 2em);\n  line-height: inherit;\n}\n\n.fa-border {\n  border-color: var(--fa-border-color, #eee);\n  border-radius: var(--fa-border-radius, 0.1em);\n  border-style: var(--fa-border-style, solid);\n  border-width: var(--fa-border-width, 0.08em);\n  padding: var(--fa-border-padding, 0.2em 0.25em 0.15em);\n}\n\n.fa-pull-left {\n  float: left;\n  margin-right: var(--fa-pull-margin, 0.3em);\n}\n\n.fa-pull-right {\n  float: right;\n  margin-left: var(--fa-pull-margin, 0.3em);\n}\n\n.fa-beat {\n  -webkit-animation-name: fa-beat;\n          animation-name: fa-beat;\n  -webkit-animation-delay: var(--fa-animation-delay, 0s);\n          animation-delay: var(--fa-animation-delay, 0s);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, ease-in-out);\n          animation-timing-function: var(--fa-animation-timing, ease-in-out);\n}\n\n.fa-bounce {\n  -webkit-animation-name: fa-bounce;\n          animation-name: fa-bounce;\n  -webkit-animation-delay: var(--fa-animation-delay, 0s);\n          animation-delay: var(--fa-animation-delay, 0s);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));\n          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));\n}\n\n.fa-fade {\n  -webkit-animation-name: fa-fade;\n          animation-name: fa-fade;\n  -webkit-animation-delay: var(--fa-animation-delay, 0s);\n          animation-delay: var(--fa-animation-delay, 0s);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));\n          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));\n}\n\n.fa-beat-fade {\n  -webkit-animation-name: fa-beat-fade;\n          animation-name: fa-beat-fade;\n  -webkit-animation-delay: var(--fa-animation-delay, 0s);\n          animation-delay: var(--fa-animation-delay, 0s);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));\n          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));\n}\n\n.fa-flip {\n  -webkit-animation-name: fa-flip;\n          animation-name: fa-flip;\n  -webkit-animation-delay: var(--fa-animation-delay, 0s);\n          animation-delay: var(--fa-animation-delay, 0s);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, ease-in-out);\n          animation-timing-function: var(--fa-animation-timing, ease-in-out);\n}\n\n.fa-shake {\n  -webkit-animation-name: fa-shake;\n          animation-name: fa-shake;\n  -webkit-animation-delay: var(--fa-animation-delay, 0s);\n          animation-delay: var(--fa-animation-delay, 0s);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, linear);\n          animation-timing-function: var(--fa-animation-timing, linear);\n}\n\n.fa-spin {\n  -webkit-animation-name: fa-spin;\n          animation-name: fa-spin;\n  -webkit-animation-delay: var(--fa-animation-delay, 0s);\n          animation-delay: var(--fa-animation-delay, 0s);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 2s);\n          animation-duration: var(--fa-animation-duration, 2s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, linear);\n          animation-timing-function: var(--fa-animation-timing, linear);\n}\n\n.fa-spin-reverse {\n  --fa-animation-direction: reverse;\n}\n\n.fa-pulse,\n.fa-spin-pulse {\n  -webkit-animation-name: fa-spin;\n          animation-name: fa-spin;\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, steps(8));\n          animation-timing-function: var(--fa-animation-timing, steps(8));\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .fa-beat,\n.fa-bounce,\n.fa-fade,\n.fa-beat-fade,\n.fa-flip,\n.fa-pulse,\n.fa-shake,\n.fa-spin,\n.fa-spin-pulse {\n    -webkit-animation-delay: -1ms;\n            animation-delay: -1ms;\n    -webkit-animation-duration: 1ms;\n            animation-duration: 1ms;\n    -webkit-animation-iteration-count: 1;\n            animation-iteration-count: 1;\n    transition-delay: 0s;\n    transition-duration: 0s;\n  }\n}\n@-webkit-keyframes fa-beat {\n  0%, 90% {\n    -webkit-transform: scale(1);\n            transform: scale(1);\n  }\n  45% {\n    -webkit-transform: scale(var(--fa-beat-scale, 1.25));\n            transform: scale(var(--fa-beat-scale, 1.25));\n  }\n}\n@keyframes fa-beat {\n  0%, 90% {\n    -webkit-transform: scale(1);\n            transform: scale(1);\n  }\n  45% {\n    -webkit-transform: scale(var(--fa-beat-scale, 1.25));\n            transform: scale(var(--fa-beat-scale, 1.25));\n  }\n}\n@-webkit-keyframes fa-bounce {\n  0% {\n    -webkit-transform: scale(1, 1) translateY(0);\n            transform: scale(1, 1) translateY(0);\n  }\n  10% {\n    -webkit-transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);\n            transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);\n  }\n  30% {\n    -webkit-transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));\n            transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));\n  }\n  50% {\n    -webkit-transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);\n            transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);\n  }\n  57% {\n    -webkit-transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));\n            transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));\n  }\n  64% {\n    -webkit-transform: scale(1, 1) translateY(0);\n            transform: scale(1, 1) translateY(0);\n  }\n  100% {\n    -webkit-transform: scale(1, 1) translateY(0);\n            transform: scale(1, 1) translateY(0);\n  }\n}\n@keyframes fa-bounce {\n  0% {\n    -webkit-transform: scale(1, 1) translateY(0);\n            transform: scale(1, 1) translateY(0);\n  }\n  10% {\n    -webkit-transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);\n            transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);\n  }\n  30% {\n    -webkit-transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));\n            transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));\n  }\n  50% {\n    -webkit-transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);\n            transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);\n  }\n  57% {\n    -webkit-transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));\n            transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));\n  }\n  64% {\n    -webkit-transform: scale(1, 1) translateY(0);\n            transform: scale(1, 1) translateY(0);\n  }\n  100% {\n    -webkit-transform: scale(1, 1) translateY(0);\n            transform: scale(1, 1) translateY(0);\n  }\n}\n@-webkit-keyframes fa-fade {\n  50% {\n    opacity: var(--fa-fade-opacity, 0.4);\n  }\n}\n@keyframes fa-fade {\n  50% {\n    opacity: var(--fa-fade-opacity, 0.4);\n  }\n}\n@-webkit-keyframes fa-beat-fade {\n  0%, 100% {\n    opacity: var(--fa-beat-fade-opacity, 0.4);\n    -webkit-transform: scale(1);\n            transform: scale(1);\n  }\n  50% {\n    opacity: 1;\n    -webkit-transform: scale(var(--fa-beat-fade-scale, 1.125));\n            transform: scale(var(--fa-beat-fade-scale, 1.125));\n  }\n}\n@keyframes fa-beat-fade {\n  0%, 100% {\n    opacity: var(--fa-beat-fade-opacity, 0.4);\n    -webkit-transform: scale(1);\n            transform: scale(1);\n  }\n  50% {\n    opacity: 1;\n    -webkit-transform: scale(var(--fa-beat-fade-scale, 1.125));\n            transform: scale(var(--fa-beat-fade-scale, 1.125));\n  }\n}\n@-webkit-keyframes fa-flip {\n  50% {\n    -webkit-transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));\n            transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));\n  }\n}\n@keyframes fa-flip {\n  50% {\n    -webkit-transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));\n            transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));\n  }\n}\n@-webkit-keyframes fa-shake {\n  0% {\n    -webkit-transform: rotate(-15deg);\n            transform: rotate(-15deg);\n  }\n  4% {\n    -webkit-transform: rotate(15deg);\n            transform: rotate(15deg);\n  }\n  8%, 24% {\n    -webkit-transform: rotate(-18deg);\n            transform: rotate(-18deg);\n  }\n  12%, 28% {\n    -webkit-transform: rotate(18deg);\n            transform: rotate(18deg);\n  }\n  16% {\n    -webkit-transform: rotate(-22deg);\n            transform: rotate(-22deg);\n  }\n  20% {\n    -webkit-transform: rotate(22deg);\n            transform: rotate(22deg);\n  }\n  32% {\n    -webkit-transform: rotate(-12deg);\n            transform: rotate(-12deg);\n  }\n  36% {\n    -webkit-transform: rotate(12deg);\n            transform: rotate(12deg);\n  }\n  40%, 100% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n}\n@keyframes fa-shake {\n  0% {\n    -webkit-transform: rotate(-15deg);\n            transform: rotate(-15deg);\n  }\n  4% {\n    -webkit-transform: rotate(15deg);\n            transform: rotate(15deg);\n  }\n  8%, 24% {\n    -webkit-transform: rotate(-18deg);\n            transform: rotate(-18deg);\n  }\n  12%, 28% {\n    -webkit-transform: rotate(18deg);\n            transform: rotate(18deg);\n  }\n  16% {\n    -webkit-transform: rotate(-22deg);\n            transform: rotate(-22deg);\n  }\n  20% {\n    -webkit-transform: rotate(22deg);\n            transform: rotate(22deg);\n  }\n  32% {\n    -webkit-transform: rotate(-12deg);\n            transform: rotate(-12deg);\n  }\n  36% {\n    -webkit-transform: rotate(12deg);\n            transform: rotate(12deg);\n  }\n  40%, 100% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n}\n@-webkit-keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n@keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n.fa-rotate-90 {\n  -webkit-transform: rotate(90deg);\n          transform: rotate(90deg);\n}\n\n.fa-rotate-180 {\n  -webkit-transform: rotate(180deg);\n          transform: rotate(180deg);\n}\n\n.fa-rotate-270 {\n  -webkit-transform: rotate(270deg);\n          transform: rotate(270deg);\n}\n\n.fa-flip-horizontal {\n  -webkit-transform: scale(-1, 1);\n          transform: scale(-1, 1);\n}\n\n.fa-flip-vertical {\n  -webkit-transform: scale(1, -1);\n          transform: scale(1, -1);\n}\n\n.fa-flip-both,\n.fa-flip-horizontal.fa-flip-vertical {\n  -webkit-transform: scale(-1, -1);\n          transform: scale(-1, -1);\n}\n\n.fa-rotate-by {\n  -webkit-transform: rotate(var(--fa-rotate-angle, none));\n          transform: rotate(var(--fa-rotate-angle, none));\n}\n\n.fa-stack {\n  display: inline-block;\n  vertical-align: middle;\n  height: 2em;\n  position: relative;\n  width: 2.5em;\n}\n\n.fa-stack-1x,\n.fa-stack-2x {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n  z-index: var(--fa-stack-z-index, auto);\n}\n\n.svg-inline--fa.fa-stack-1x {\n  height: 1em;\n  width: 1.25em;\n}\n.svg-inline--fa.fa-stack-2x {\n  height: 2em;\n  width: 2.5em;\n}\n\n.fa-inverse {\n  color: var(--fa-inverse, #fff);\n}\n\n.sr-only,\n.fa-sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border-width: 0;\n}\n\n.sr-only-focusable:not(:focus),\n.fa-sr-only-focusable:not(:focus) {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border-width: 0;\n}\n\n.svg-inline--fa .fa-primary {\n  fill: var(--fa-primary-color, currentColor);\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa .fa-secondary {\n  fill: var(--fa-secondary-color, currentColor);\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-primary {\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-secondary {\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa mask .fa-primary,\n.svg-inline--fa mask .fa-secondary {\n  fill: black;\n}\n\n.fad.fa-inverse,\n.fa-duotone.fa-inverse {\n  color: var(--fa-inverse, #fff);\n}';
  function css() {
    var dcp = DEFAULT_CSS_PREFIX;
    var drc = DEFAULT_REPLACEMENT_CLASS;
    var fp = config.cssPrefix;
    var rc = config.replacementClass;
    var s = baseStyles;
    if (fp !== dcp || rc !== drc) {
      var dPatt = new RegExp("\\.".concat(dcp, "\\-"), "g");
      var customPropPatt = new RegExp("\\--".concat(dcp, "\\-"), "g");
      var rPatt = new RegExp("\\.".concat(drc), "g");
      s = s.replace(dPatt, ".".concat(fp, "-")).replace(customPropPatt, "--".concat(fp, "-")).replace(rPatt, ".".concat(rc));
    }
    return s;
  }
  var _cssInserted = false;
  function ensureCss() {
    if (config.autoAddCss && !_cssInserted) {
      insertCss(css());
      _cssInserted = true;
    }
  }
  var InjectCSS = {
    mixout: function mixout() {
      return {
        dom: {
          css,
          insertCss: ensureCss
        }
      };
    },
    hooks: function hooks() {
      return {
        beforeDOMElementCreation: function beforeDOMElementCreation() {
          ensureCss();
        },
        beforeI2svg: function beforeI2svg() {
          ensureCss();
        }
      };
    }
  };
  var w = WINDOW || {};
  if (!w[NAMESPACE_IDENTIFIER])
    w[NAMESPACE_IDENTIFIER] = {};
  if (!w[NAMESPACE_IDENTIFIER].styles)
    w[NAMESPACE_IDENTIFIER].styles = {};
  if (!w[NAMESPACE_IDENTIFIER].hooks)
    w[NAMESPACE_IDENTIFIER].hooks = {};
  if (!w[NAMESPACE_IDENTIFIER].shims)
    w[NAMESPACE_IDENTIFIER].shims = [];
  var namespace = w[NAMESPACE_IDENTIFIER];
  var functions = [];
  var listener = function listener2() {
    DOCUMENT.removeEventListener("DOMContentLoaded", listener2);
    loaded = 1;
    functions.map(function(fn) {
      return fn();
    });
  };
  var loaded = false;
  if (IS_DOM) {
    loaded = (DOCUMENT.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(DOCUMENT.readyState);
    if (!loaded)
      DOCUMENT.addEventListener("DOMContentLoaded", listener);
  }
  function domready(fn) {
    if (!IS_DOM)
      return;
    loaded ? setTimeout(fn, 0) : functions.push(fn);
  }
  function toHtml(abstractNodes) {
    var tag = abstractNodes.tag, _abstractNodes$attrib = abstractNodes.attributes, attributes = _abstractNodes$attrib === void 0 ? {} : _abstractNodes$attrib, _abstractNodes$childr = abstractNodes.children, children = _abstractNodes$childr === void 0 ? [] : _abstractNodes$childr;
    if (typeof abstractNodes === "string") {
      return htmlEscape(abstractNodes);
    } else {
      return "<".concat(tag, " ").concat(joinAttributes(attributes), ">").concat(children.map(toHtml).join(""), "</").concat(tag, ">");
    }
  }
  function iconFromMapping(mapping, prefix, iconName) {
    if (mapping && mapping[prefix] && mapping[prefix][iconName]) {
      return {
        prefix,
        iconName,
        icon: mapping[prefix][iconName]
      };
    }
  }
  var bindInternal4 = function bindInternal42(func, thisContext) {
    return function(a, b, c, d2) {
      return func.call(thisContext, a, b, c, d2);
    };
  };
  var reduce = function fastReduceObject(subject, fn, initialValue, thisContext) {
    var keys = Object.keys(subject), length = keys.length, iterator = thisContext !== void 0 ? bindInternal4(fn, thisContext) : fn, i, key, result;
    if (initialValue === void 0) {
      i = 1;
      result = subject[keys[0]];
    } else {
      i = 0;
      result = initialValue;
    }
    for (; i < length; i++) {
      key = keys[i];
      result = iterator(result, subject[key], key, subject);
    }
    return result;
  };
  function ucs2decode(string) {
    var output = [];
    var counter2 = 0;
    var length = string.length;
    while (counter2 < length) {
      var value = string.charCodeAt(counter2++);
      if (value >= 55296 && value <= 56319 && counter2 < length) {
        var extra = string.charCodeAt(counter2++);
        if ((extra & 64512) == 56320) {
          output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
        } else {
          output.push(value);
          counter2--;
        }
      } else {
        output.push(value);
      }
    }
    return output;
  }
  function toHex(unicode) {
    var decoded = ucs2decode(unicode);
    return decoded.length === 1 ? decoded[0].toString(16) : null;
  }
  function codePointAt(string, index) {
    var size = string.length;
    var first = string.charCodeAt(index);
    var second;
    if (first >= 55296 && first <= 56319 && size > index + 1) {
      second = string.charCodeAt(index + 1);
      if (second >= 56320 && second <= 57343) {
        return (first - 55296) * 1024 + second - 56320 + 65536;
      }
    }
    return first;
  }
  function normalizeIcons(icons) {
    return Object.keys(icons).reduce(function(acc, iconName) {
      var icon4 = icons[iconName];
      var expanded = !!icon4.icon;
      if (expanded) {
        acc[icon4.iconName] = icon4.icon;
      } else {
        acc[iconName] = icon4;
      }
      return acc;
    }, {});
  }
  function defineIcons(prefix, icons) {
    var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var _params$skipHooks = params.skipHooks, skipHooks = _params$skipHooks === void 0 ? false : _params$skipHooks;
    var normalized = normalizeIcons(icons);
    if (typeof namespace.hooks.addPack === "function" && !skipHooks) {
      namespace.hooks.addPack(prefix, normalizeIcons(icons));
    } else {
      namespace.styles[prefix] = _objectSpread2(_objectSpread2({}, namespace.styles[prefix] || {}), normalized);
    }
    if (prefix === "fas") {
      defineIcons("fa", icons);
    }
  }
  var _LONG_STYLE;
  var _PREFIXES;
  var _PREFIXES_FOR_FAMILY;
  var styles = namespace.styles;
  var shims = namespace.shims;
  var LONG_STYLE = (_LONG_STYLE = {}, _defineProperty(_LONG_STYLE, FAMILY_CLASSIC, Object.values(PREFIX_TO_LONG_STYLE[FAMILY_CLASSIC])), _defineProperty(_LONG_STYLE, FAMILY_SHARP, Object.values(PREFIX_TO_LONG_STYLE[FAMILY_SHARP])), _LONG_STYLE);
  var _defaultUsablePrefix = null;
  var _byUnicode = {};
  var _byLigature = {};
  var _byOldName = {};
  var _byOldUnicode = {};
  var _byAlias = {};
  var PREFIXES = (_PREFIXES = {}, _defineProperty(_PREFIXES, FAMILY_CLASSIC, Object.keys(PREFIX_TO_STYLE[FAMILY_CLASSIC])), _defineProperty(_PREFIXES, FAMILY_SHARP, Object.keys(PREFIX_TO_STYLE[FAMILY_SHARP])), _PREFIXES);
  function isReserved(name) {
    return ~RESERVED_CLASSES.indexOf(name);
  }
  function getIconName(cssPrefix, cls) {
    var parts = cls.split("-");
    var prefix = parts[0];
    var iconName = parts.slice(1).join("-");
    if (prefix === cssPrefix && iconName !== "" && !isReserved(iconName)) {
      return iconName;
    } else {
      return null;
    }
  }
  var build = function build2() {
    var lookup = function lookup2(reducer) {
      return reduce(styles, function(o, style, prefix) {
        o[prefix] = reduce(style, reducer, {});
        return o;
      }, {});
    };
    _byUnicode = lookup(function(acc, icon4, iconName) {
      if (icon4[3]) {
        acc[icon4[3]] = iconName;
      }
      if (icon4[2]) {
        var aliases = icon4[2].filter(function(a) {
          return typeof a === "number";
        });
        aliases.forEach(function(alias) {
          acc[alias.toString(16)] = iconName;
        });
      }
      return acc;
    });
    _byLigature = lookup(function(acc, icon4, iconName) {
      acc[iconName] = iconName;
      if (icon4[2]) {
        var aliases = icon4[2].filter(function(a) {
          return typeof a === "string";
        });
        aliases.forEach(function(alias) {
          acc[alias] = iconName;
        });
      }
      return acc;
    });
    _byAlias = lookup(function(acc, icon4, iconName) {
      var aliases = icon4[2];
      acc[iconName] = iconName;
      aliases.forEach(function(alias) {
        acc[alias] = iconName;
      });
      return acc;
    });
    var hasRegular = "far" in styles || config.autoFetchSvg;
    var shimLookups = reduce(shims, function(acc, shim) {
      var maybeNameMaybeUnicode = shim[0];
      var prefix = shim[1];
      var iconName = shim[2];
      if (prefix === "far" && !hasRegular) {
        prefix = "fas";
      }
      if (typeof maybeNameMaybeUnicode === "string") {
        acc.names[maybeNameMaybeUnicode] = {
          prefix,
          iconName
        };
      }
      if (typeof maybeNameMaybeUnicode === "number") {
        acc.unicodes[maybeNameMaybeUnicode.toString(16)] = {
          prefix,
          iconName
        };
      }
      return acc;
    }, {
      names: {},
      unicodes: {}
    });
    _byOldName = shimLookups.names;
    _byOldUnicode = shimLookups.unicodes;
    _defaultUsablePrefix = getCanonicalPrefix(config.styleDefault, {
      family: config.familyDefault
    });
  };
  onChange(function(c) {
    _defaultUsablePrefix = getCanonicalPrefix(c.styleDefault, {
      family: config.familyDefault
    });
  });
  build();
  function byUnicode(prefix, unicode) {
    return (_byUnicode[prefix] || {})[unicode];
  }
  function byLigature(prefix, ligature) {
    return (_byLigature[prefix] || {})[ligature];
  }
  function byAlias(prefix, alias) {
    return (_byAlias[prefix] || {})[alias];
  }
  function byOldName(name) {
    return _byOldName[name] || {
      prefix: null,
      iconName: null
    };
  }
  function byOldUnicode(unicode) {
    var oldUnicode = _byOldUnicode[unicode];
    var newUnicode = byUnicode("fas", unicode);
    return oldUnicode || (newUnicode ? {
      prefix: "fas",
      iconName: newUnicode
    } : null) || {
      prefix: null,
      iconName: null
    };
  }
  function getDefaultUsablePrefix() {
    return _defaultUsablePrefix;
  }
  var emptyCanonicalIcon = function emptyCanonicalIcon2() {
    return {
      prefix: null,
      iconName: null,
      rest: []
    };
  };
  function getCanonicalPrefix(styleOrPrefix) {
    var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var _params$family = params.family, family = _params$family === void 0 ? FAMILY_CLASSIC : _params$family;
    var style = PREFIX_TO_STYLE[family][styleOrPrefix];
    var prefix = STYLE_TO_PREFIX[family][styleOrPrefix] || STYLE_TO_PREFIX[family][style];
    var defined = styleOrPrefix in namespace.styles ? styleOrPrefix : null;
    return prefix || defined || null;
  }
  var PREFIXES_FOR_FAMILY = (_PREFIXES_FOR_FAMILY = {}, _defineProperty(_PREFIXES_FOR_FAMILY, FAMILY_CLASSIC, Object.keys(PREFIX_TO_LONG_STYLE[FAMILY_CLASSIC])), _defineProperty(_PREFIXES_FOR_FAMILY, FAMILY_SHARP, Object.keys(PREFIX_TO_LONG_STYLE[FAMILY_SHARP])), _PREFIXES_FOR_FAMILY);
  function getCanonicalIcon(values) {
    var _famProps;
    var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var _params$skipLookups = params.skipLookups, skipLookups = _params$skipLookups === void 0 ? false : _params$skipLookups;
    var famProps = (_famProps = {}, _defineProperty(_famProps, FAMILY_CLASSIC, "".concat(config.cssPrefix, "-").concat(FAMILY_CLASSIC)), _defineProperty(_famProps, FAMILY_SHARP, "".concat(config.cssPrefix, "-").concat(FAMILY_SHARP)), _famProps);
    var givenPrefix = null;
    var family = FAMILY_CLASSIC;
    if (values.includes(famProps[FAMILY_CLASSIC]) || values.some(function(v) {
      return PREFIXES_FOR_FAMILY[FAMILY_CLASSIC].includes(v);
    })) {
      family = FAMILY_CLASSIC;
    }
    if (values.includes(famProps[FAMILY_SHARP]) || values.some(function(v) {
      return PREFIXES_FOR_FAMILY[FAMILY_SHARP].includes(v);
    })) {
      family = FAMILY_SHARP;
    }
    var canonical = values.reduce(function(acc, cls) {
      var iconName = getIconName(config.cssPrefix, cls);
      if (styles[cls]) {
        cls = LONG_STYLE[family].includes(cls) ? LONG_STYLE_TO_PREFIX[family][cls] : cls;
        givenPrefix = cls;
        acc.prefix = cls;
      } else if (PREFIXES[family].indexOf(cls) > -1) {
        givenPrefix = cls;
        acc.prefix = getCanonicalPrefix(cls, {
          family
        });
      } else if (iconName) {
        acc.iconName = iconName;
      } else if (cls !== config.replacementClass && cls !== famProps[FAMILY_CLASSIC] && cls !== famProps[FAMILY_SHARP]) {
        acc.rest.push(cls);
      }
      if (!skipLookups && acc.prefix && acc.iconName) {
        var shim = givenPrefix === "fa" ? byOldName(acc.iconName) : {};
        var aliasIconName = byAlias(acc.prefix, acc.iconName);
        if (shim.prefix) {
          givenPrefix = null;
        }
        acc.iconName = shim.iconName || aliasIconName || acc.iconName;
        acc.prefix = shim.prefix || acc.prefix;
        if (acc.prefix === "far" && !styles["far"] && styles["fas"] && !config.autoFetchSvg) {
          acc.prefix = "fas";
        }
      }
      return acc;
    }, emptyCanonicalIcon());
    if (values.includes("fa-brands") || values.includes("fab")) {
      canonical.prefix = "fab";
    }
    if (values.includes("fa-duotone") || values.includes("fad")) {
      canonical.prefix = "fad";
    }
    if (!canonical.prefix && family === FAMILY_SHARP && (styles["fass"] || config.autoFetchSvg)) {
      canonical.prefix = "fass";
      canonical.iconName = byAlias(canonical.prefix, canonical.iconName) || canonical.iconName;
    }
    if (canonical.prefix === "fa" || givenPrefix === "fa") {
      canonical.prefix = getDefaultUsablePrefix() || "fas";
    }
    return canonical;
  }
  var Library = /* @__PURE__ */ function() {
    function Library2() {
      _classCallCheck(this, Library2);
      this.definitions = {};
    }
    _createClass(Library2, [{
      key: "add",
      value: function add() {
        var _this = this;
        for (var _len = arguments.length, definitions = new Array(_len), _key = 0; _key < _len; _key++) {
          definitions[_key] = arguments[_key];
        }
        var additions = definitions.reduce(this._pullDefinitions, {});
        Object.keys(additions).forEach(function(key) {
          _this.definitions[key] = _objectSpread2(_objectSpread2({}, _this.definitions[key] || {}), additions[key]);
          defineIcons(key, additions[key]);
          var longPrefix = PREFIX_TO_LONG_STYLE[FAMILY_CLASSIC][key];
          if (longPrefix)
            defineIcons(longPrefix, additions[key]);
          build();
        });
      }
    }, {
      key: "reset",
      value: function reset() {
        this.definitions = {};
      }
    }, {
      key: "_pullDefinitions",
      value: function _pullDefinitions(additions, definition) {
        var normalized = definition.prefix && definition.iconName && definition.icon ? {
          0: definition
        } : definition;
        Object.keys(normalized).map(function(key) {
          var _normalized$key = normalized[key], prefix = _normalized$key.prefix, iconName = _normalized$key.iconName, icon4 = _normalized$key.icon;
          var aliases = icon4[2];
          if (!additions[prefix])
            additions[prefix] = {};
          if (aliases.length > 0) {
            aliases.forEach(function(alias) {
              if (typeof alias === "string") {
                additions[prefix][alias] = icon4;
              }
            });
          }
          additions[prefix][iconName] = icon4;
        });
        return additions;
      }
    }]);
    return Library2;
  }();
  var _plugins = [];
  var _hooks = {};
  var providers = {};
  var defaultProviderKeys = Object.keys(providers);
  function registerPlugins(nextPlugins, _ref2) {
    var obj = _ref2.mixoutsTo;
    _plugins = nextPlugins;
    _hooks = {};
    Object.keys(providers).forEach(function(k) {
      if (defaultProviderKeys.indexOf(k) === -1) {
        delete providers[k];
      }
    });
    _plugins.forEach(function(plugin) {
      var mixout8 = plugin.mixout ? plugin.mixout() : {};
      Object.keys(mixout8).forEach(function(tk) {
        if (typeof mixout8[tk] === "function") {
          obj[tk] = mixout8[tk];
        }
        if (_typeof(mixout8[tk]) === "object") {
          Object.keys(mixout8[tk]).forEach(function(sk) {
            if (!obj[tk]) {
              obj[tk] = {};
            }
            obj[tk][sk] = mixout8[tk][sk];
          });
        }
      });
      if (plugin.hooks) {
        var hooks8 = plugin.hooks();
        Object.keys(hooks8).forEach(function(hook) {
          if (!_hooks[hook]) {
            _hooks[hook] = [];
          }
          _hooks[hook].push(hooks8[hook]);
        });
      }
      if (plugin.provides) {
        plugin.provides(providers);
      }
    });
    return obj;
  }
  function chainHooks(hook, accumulator) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    var hookFns = _hooks[hook] || [];
    hookFns.forEach(function(hookFn) {
      accumulator = hookFn.apply(null, [accumulator].concat(args));
    });
    return accumulator;
  }
  function callHooks(hook) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    var hookFns = _hooks[hook] || [];
    hookFns.forEach(function(hookFn) {
      hookFn.apply(null, args);
    });
    return void 0;
  }
  function callProvided() {
    var hook = arguments[0];
    var args = Array.prototype.slice.call(arguments, 1);
    return providers[hook] ? providers[hook].apply(null, args) : void 0;
  }
  function findIconDefinition(iconLookup) {
    if (iconLookup.prefix === "fa") {
      iconLookup.prefix = "fas";
    }
    var iconName = iconLookup.iconName;
    var prefix = iconLookup.prefix || getDefaultUsablePrefix();
    if (!iconName)
      return;
    iconName = byAlias(prefix, iconName) || iconName;
    return iconFromMapping(library.definitions, prefix, iconName) || iconFromMapping(namespace.styles, prefix, iconName);
  }
  var library = new Library();
  var noAuto = function noAuto2() {
    config.autoReplaceSvg = false;
    config.observeMutations = false;
    callHooks("noAuto");
  };
  var dom = {
    i2svg: function i2svg() {
      var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      if (IS_DOM) {
        callHooks("beforeI2svg", params);
        callProvided("pseudoElements2svg", params);
        return callProvided("i2svg", params);
      } else {
        return Promise.reject("Operation requires a DOM of some kind.");
      }
    },
    watch: function watch() {
      var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      var autoReplaceSvgRoot = params.autoReplaceSvgRoot;
      if (config.autoReplaceSvg === false) {
        config.autoReplaceSvg = true;
      }
      config.observeMutations = true;
      domready(function() {
        autoReplace({
          autoReplaceSvgRoot
        });
        callHooks("watch", params);
      });
    }
  };
  var parse = {
    icon: function icon(_icon) {
      if (_icon === null) {
        return null;
      }
      if (_typeof(_icon) === "object" && _icon.prefix && _icon.iconName) {
        return {
          prefix: _icon.prefix,
          iconName: byAlias(_icon.prefix, _icon.iconName) || _icon.iconName
        };
      }
      if (Array.isArray(_icon) && _icon.length === 2) {
        var iconName = _icon[1].indexOf("fa-") === 0 ? _icon[1].slice(3) : _icon[1];
        var prefix = getCanonicalPrefix(_icon[0]);
        return {
          prefix,
          iconName: byAlias(prefix, iconName) || iconName
        };
      }
      if (typeof _icon === "string" && (_icon.indexOf("".concat(config.cssPrefix, "-")) > -1 || _icon.match(ICON_SELECTION_SYNTAX_PATTERN))) {
        var canonicalIcon = getCanonicalIcon(_icon.split(" "), {
          skipLookups: true
        });
        return {
          prefix: canonicalIcon.prefix || getDefaultUsablePrefix(),
          iconName: byAlias(canonicalIcon.prefix, canonicalIcon.iconName) || canonicalIcon.iconName
        };
      }
      if (typeof _icon === "string") {
        var _prefix = getDefaultUsablePrefix();
        return {
          prefix: _prefix,
          iconName: byAlias(_prefix, _icon) || _icon
        };
      }
    }
  };
  var api = {
    noAuto,
    config,
    dom,
    parse,
    library,
    findIconDefinition,
    toHtml
  };
  var autoReplace = function autoReplace2() {
    var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var _params$autoReplaceSv = params.autoReplaceSvgRoot, autoReplaceSvgRoot = _params$autoReplaceSv === void 0 ? DOCUMENT : _params$autoReplaceSv;
    if ((Object.keys(namespace.styles).length > 0 || config.autoFetchSvg) && IS_DOM && config.autoReplaceSvg)
      api.dom.i2svg({
        node: autoReplaceSvgRoot
      });
  };
  function domVariants(val, abstractCreator) {
    Object.defineProperty(val, "abstract", {
      get: abstractCreator
    });
    Object.defineProperty(val, "html", {
      get: function get2() {
        return val.abstract.map(function(a) {
          return toHtml(a);
        });
      }
    });
    Object.defineProperty(val, "node", {
      get: function get2() {
        if (!IS_DOM)
          return;
        var container = DOCUMENT.createElement("div");
        container.innerHTML = val.html;
        return container.children;
      }
    });
    return val;
  }
  function asIcon(_ref2) {
    var children = _ref2.children, main = _ref2.main, mask = _ref2.mask, attributes = _ref2.attributes, styles3 = _ref2.styles, transform = _ref2.transform;
    if (transformIsMeaningful(transform) && main.found && !mask.found) {
      var width = main.width, height = main.height;
      var offset = {
        x: width / height / 2,
        y: 0.5
      };
      attributes["style"] = joinStyles(_objectSpread2(_objectSpread2({}, styles3), {}, {
        "transform-origin": "".concat(offset.x + transform.x / 16, "em ").concat(offset.y + transform.y / 16, "em")
      }));
    }
    return [{
      tag: "svg",
      attributes,
      children
    }];
  }
  function asSymbol(_ref2) {
    var prefix = _ref2.prefix, iconName = _ref2.iconName, children = _ref2.children, attributes = _ref2.attributes, symbol = _ref2.symbol;
    var id = symbol === true ? "".concat(prefix, "-").concat(config.cssPrefix, "-").concat(iconName) : symbol;
    return [{
      tag: "svg",
      attributes: {
        style: "display: none;"
      },
      children: [{
        tag: "symbol",
        attributes: _objectSpread2(_objectSpread2({}, attributes), {}, {
          id
        }),
        children
      }]
    }];
  }
  function makeInlineSvgAbstract(params) {
    var _params$icons = params.icons, main = _params$icons.main, mask = _params$icons.mask, prefix = params.prefix, iconName = params.iconName, transform = params.transform, symbol = params.symbol, title = params.title, maskId = params.maskId, titleId = params.titleId, extra = params.extra, _params$watchable = params.watchable, watchable = _params$watchable === void 0 ? false : _params$watchable;
    var _ref2 = mask.found ? mask : main, width = _ref2.width, height = _ref2.height;
    var isUploadedIcon = prefix === "fak";
    var attrClass = [config.replacementClass, iconName ? "".concat(config.cssPrefix, "-").concat(iconName) : ""].filter(function(c) {
      return extra.classes.indexOf(c) === -1;
    }).filter(function(c) {
      return c !== "" || !!c;
    }).concat(extra.classes).join(" ");
    var content = {
      children: [],
      attributes: _objectSpread2(_objectSpread2({}, extra.attributes), {}, {
        "data-prefix": prefix,
        "data-icon": iconName,
        "class": attrClass,
        "role": extra.attributes.role || "img",
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": "0 0 ".concat(width, " ").concat(height)
      })
    };
    var uploadedIconWidthStyle = isUploadedIcon && !~extra.classes.indexOf("fa-fw") ? {
      width: "".concat(width / height * 16 * 0.0625, "em")
    } : {};
    if (watchable) {
      content.attributes[DATA_FA_I2SVG] = "";
    }
    if (title) {
      content.children.push({
        tag: "title",
        attributes: {
          id: content.attributes["aria-labelledby"] || "title-".concat(titleId || nextUniqueId())
        },
        children: [title]
      });
      delete content.attributes.title;
    }
    var args = _objectSpread2(_objectSpread2({}, content), {}, {
      prefix,
      iconName,
      main,
      mask,
      maskId,
      transform,
      symbol,
      styles: _objectSpread2(_objectSpread2({}, uploadedIconWidthStyle), extra.styles)
    });
    var _ref22 = mask.found && main.found ? callProvided("generateAbstractMask", args) || {
      children: [],
      attributes: {}
    } : callProvided("generateAbstractIcon", args) || {
      children: [],
      attributes: {}
    }, children = _ref22.children, attributes = _ref22.attributes;
    args.children = children;
    args.attributes = attributes;
    if (symbol) {
      return asSymbol(args);
    } else {
      return asIcon(args);
    }
  }
  function makeLayersTextAbstract(params) {
    var content = params.content, width = params.width, height = params.height, transform = params.transform, title = params.title, extra = params.extra, _params$watchable2 = params.watchable, watchable = _params$watchable2 === void 0 ? false : _params$watchable2;
    var attributes = _objectSpread2(_objectSpread2(_objectSpread2({}, extra.attributes), title ? {
      "title": title
    } : {}), {}, {
      "class": extra.classes.join(" ")
    });
    if (watchable) {
      attributes[DATA_FA_I2SVG] = "";
    }
    var styles3 = _objectSpread2({}, extra.styles);
    if (transformIsMeaningful(transform)) {
      styles3["transform"] = transformForCss({
        transform,
        startCentered: true,
        width,
        height
      });
      styles3["-webkit-transform"] = styles3["transform"];
    }
    var styleString = joinStyles(styles3);
    if (styleString.length > 0) {
      attributes["style"] = styleString;
    }
    var val = [];
    val.push({
      tag: "span",
      attributes,
      children: [content]
    });
    if (title) {
      val.push({
        tag: "span",
        attributes: {
          class: "sr-only"
        },
        children: [title]
      });
    }
    return val;
  }
  function makeLayersCounterAbstract(params) {
    var content = params.content, title = params.title, extra = params.extra;
    var attributes = _objectSpread2(_objectSpread2(_objectSpread2({}, extra.attributes), title ? {
      "title": title
    } : {}), {}, {
      "class": extra.classes.join(" ")
    });
    var styleString = joinStyles(extra.styles);
    if (styleString.length > 0) {
      attributes["style"] = styleString;
    }
    var val = [];
    val.push({
      tag: "span",
      attributes,
      children: [content]
    });
    if (title) {
      val.push({
        tag: "span",
        attributes: {
          class: "sr-only"
        },
        children: [title]
      });
    }
    return val;
  }
  var styles$1 = namespace.styles;
  function asFoundIcon(icon4) {
    var width = icon4[0];
    var height = icon4[1];
    var _icon$slice = icon4.slice(4), _icon$slice2 = _slicedToArray(_icon$slice, 1), vectorData = _icon$slice2[0];
    var element = null;
    if (Array.isArray(vectorData)) {
      element = {
        tag: "g",
        attributes: {
          class: "".concat(config.cssPrefix, "-").concat(DUOTONE_CLASSES.GROUP)
        },
        children: [{
          tag: "path",
          attributes: {
            class: "".concat(config.cssPrefix, "-").concat(DUOTONE_CLASSES.SECONDARY),
            fill: "currentColor",
            d: vectorData[0]
          }
        }, {
          tag: "path",
          attributes: {
            class: "".concat(config.cssPrefix, "-").concat(DUOTONE_CLASSES.PRIMARY),
            fill: "currentColor",
            d: vectorData[1]
          }
        }]
      };
    } else {
      element = {
        tag: "path",
        attributes: {
          fill: "currentColor",
          d: vectorData
        }
      };
    }
    return {
      found: true,
      width,
      height,
      icon: element
    };
  }
  var missingIconResolutionMixin = {
    found: false,
    width: 512,
    height: 512
  };
  function maybeNotifyMissing(iconName, prefix) {
    if (!PRODUCTION && !config.showMissingIcons && iconName) {
      console.error('Icon with name "'.concat(iconName, '" and prefix "').concat(prefix, '" is missing.'));
    }
  }
  function findIcon(iconName, prefix) {
    var givenPrefix = prefix;
    if (prefix === "fa" && config.styleDefault !== null) {
      prefix = getDefaultUsablePrefix();
    }
    return new Promise(function(resolve, reject) {
      var val = {
        found: false,
        width: 512,
        height: 512,
        icon: callProvided("missingIconAbstract") || {}
      };
      if (givenPrefix === "fa") {
        var shim = byOldName(iconName) || {};
        iconName = shim.iconName || iconName;
        prefix = shim.prefix || prefix;
      }
      if (iconName && prefix && styles$1[prefix] && styles$1[prefix][iconName]) {
        var icon4 = styles$1[prefix][iconName];
        return resolve(asFoundIcon(icon4));
      }
      maybeNotifyMissing(iconName, prefix);
      resolve(_objectSpread2(_objectSpread2({}, missingIconResolutionMixin), {}, {
        icon: config.showMissingIcons && iconName ? callProvided("missingIconAbstract") || {} : {}
      }));
    });
  }
  var noop$1 = function noop3() {
  };
  var p = config.measurePerformance && PERFORMANCE && PERFORMANCE.mark && PERFORMANCE.measure ? PERFORMANCE : {
    mark: noop$1,
    measure: noop$1
  };
  var preamble = 'FA "6.2.1"';
  var begin = function begin2(name) {
    p.mark("".concat(preamble, " ").concat(name, " begins"));
    return function() {
      return end(name);
    };
  };
  var end = function end2(name) {
    p.mark("".concat(preamble, " ").concat(name, " ends"));
    p.measure("".concat(preamble, " ").concat(name), "".concat(preamble, " ").concat(name, " begins"), "".concat(preamble, " ").concat(name, " ends"));
  };
  var perf = {
    begin,
    end
  };
  var noop$2 = function noop4() {
  };
  function isWatched(node) {
    var i2svg2 = node.getAttribute ? node.getAttribute(DATA_FA_I2SVG) : null;
    return typeof i2svg2 === "string";
  }
  function hasPrefixAndIcon(node) {
    var prefix = node.getAttribute ? node.getAttribute(DATA_PREFIX) : null;
    var icon4 = node.getAttribute ? node.getAttribute(DATA_ICON) : null;
    return prefix && icon4;
  }
  function hasBeenReplaced(node) {
    return node && node.classList && node.classList.contains && node.classList.contains(config.replacementClass);
  }
  function getMutator() {
    if (config.autoReplaceSvg === true) {
      return mutators.replace;
    }
    var mutator = mutators[config.autoReplaceSvg];
    return mutator || mutators.replace;
  }
  function createElementNS(tag) {
    return DOCUMENT.createElementNS("http://www.w3.org/2000/svg", tag);
  }
  function createElement(tag) {
    return DOCUMENT.createElement(tag);
  }
  function convertSVG(abstractObj) {
    var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var _params$ceFn = params.ceFn, ceFn = _params$ceFn === void 0 ? abstractObj.tag === "svg" ? createElementNS : createElement : _params$ceFn;
    if (typeof abstractObj === "string") {
      return DOCUMENT.createTextNode(abstractObj);
    }
    var tag = ceFn(abstractObj.tag);
    Object.keys(abstractObj.attributes || []).forEach(function(key) {
      tag.setAttribute(key, abstractObj.attributes[key]);
    });
    var children = abstractObj.children || [];
    children.forEach(function(child) {
      tag.appendChild(convertSVG(child, {
        ceFn
      }));
    });
    return tag;
  }
  function nodeAsComment(node) {
    var comment = " ".concat(node.outerHTML, " ");
    comment = "".concat(comment, "Font Awesome fontawesome.com ");
    return comment;
  }
  var mutators = {
    replace: function replace(mutation) {
      var node = mutation[0];
      if (node.parentNode) {
        mutation[1].forEach(function(abstract) {
          node.parentNode.insertBefore(convertSVG(abstract), node);
        });
        if (node.getAttribute(DATA_FA_I2SVG) === null && config.keepOriginalSource) {
          var comment = DOCUMENT.createComment(nodeAsComment(node));
          node.parentNode.replaceChild(comment, node);
        } else {
          node.remove();
        }
      }
    },
    nest: function nest(mutation) {
      var node = mutation[0];
      var abstract = mutation[1];
      if (~classArray(node).indexOf(config.replacementClass)) {
        return mutators.replace(mutation);
      }
      var forSvg = new RegExp("".concat(config.cssPrefix, "-.*"));
      delete abstract[0].attributes.id;
      if (abstract[0].attributes.class) {
        var splitClasses = abstract[0].attributes.class.split(" ").reduce(function(acc, cls) {
          if (cls === config.replacementClass || cls.match(forSvg)) {
            acc.toSvg.push(cls);
          } else {
            acc.toNode.push(cls);
          }
          return acc;
        }, {
          toNode: [],
          toSvg: []
        });
        abstract[0].attributes.class = splitClasses.toSvg.join(" ");
        if (splitClasses.toNode.length === 0) {
          node.removeAttribute("class");
        } else {
          node.setAttribute("class", splitClasses.toNode.join(" "));
        }
      }
      var newInnerHTML = abstract.map(function(a) {
        return toHtml(a);
      }).join("\n");
      node.setAttribute(DATA_FA_I2SVG, "");
      node.innerHTML = newInnerHTML;
    }
  };
  function performOperationSync(op) {
    op();
  }
  function perform(mutations, callback) {
    var callbackFunction = typeof callback === "function" ? callback : noop$2;
    if (mutations.length === 0) {
      callbackFunction();
    } else {
      var frame = performOperationSync;
      if (config.mutateApproach === MUTATION_APPROACH_ASYNC) {
        frame = WINDOW.requestAnimationFrame || performOperationSync;
      }
      frame(function() {
        var mutator = getMutator();
        var mark = perf.begin("mutate");
        mutations.map(mutator);
        mark();
        callbackFunction();
      });
    }
  }
  var disabled = false;
  function disableObservation() {
    disabled = true;
  }
  function enableObservation() {
    disabled = false;
  }
  var mo = null;
  function observe(options) {
    if (!MUTATION_OBSERVER) {
      return;
    }
    if (!config.observeMutations) {
      return;
    }
    var _options$treeCallback = options.treeCallback, treeCallback = _options$treeCallback === void 0 ? noop$2 : _options$treeCallback, _options$nodeCallback = options.nodeCallback, nodeCallback = _options$nodeCallback === void 0 ? noop$2 : _options$nodeCallback, _options$pseudoElemen = options.pseudoElementsCallback, pseudoElementsCallback = _options$pseudoElemen === void 0 ? noop$2 : _options$pseudoElemen, _options$observeMutat = options.observeMutationsRoot, observeMutationsRoot = _options$observeMutat === void 0 ? DOCUMENT : _options$observeMutat;
    mo = new MUTATION_OBSERVER(function(objects) {
      if (disabled)
        return;
      var defaultPrefix = getDefaultUsablePrefix();
      toArray(objects).forEach(function(mutationRecord) {
        if (mutationRecord.type === "childList" && mutationRecord.addedNodes.length > 0 && !isWatched(mutationRecord.addedNodes[0])) {
          if (config.searchPseudoElements) {
            pseudoElementsCallback(mutationRecord.target);
          }
          treeCallback(mutationRecord.target);
        }
        if (mutationRecord.type === "attributes" && mutationRecord.target.parentNode && config.searchPseudoElements) {
          pseudoElementsCallback(mutationRecord.target.parentNode);
        }
        if (mutationRecord.type === "attributes" && isWatched(mutationRecord.target) && ~ATTRIBUTES_WATCHED_FOR_MUTATION.indexOf(mutationRecord.attributeName)) {
          if (mutationRecord.attributeName === "class" && hasPrefixAndIcon(mutationRecord.target)) {
            var _getCanonicalIcon = getCanonicalIcon(classArray(mutationRecord.target)), prefix = _getCanonicalIcon.prefix, iconName = _getCanonicalIcon.iconName;
            mutationRecord.target.setAttribute(DATA_PREFIX, prefix || defaultPrefix);
            if (iconName)
              mutationRecord.target.setAttribute(DATA_ICON, iconName);
          } else if (hasBeenReplaced(mutationRecord.target)) {
            nodeCallback(mutationRecord.target);
          }
        }
      });
    });
    if (!IS_DOM)
      return;
    mo.observe(observeMutationsRoot, {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true
    });
  }
  function disconnect() {
    if (!mo)
      return;
    mo.disconnect();
  }
  function styleParser(node) {
    var style = node.getAttribute("style");
    var val = [];
    if (style) {
      val = style.split(";").reduce(function(acc, style2) {
        var styles3 = style2.split(":");
        var prop = styles3[0];
        var value = styles3.slice(1);
        if (prop && value.length > 0) {
          acc[prop] = value.join(":").trim();
        }
        return acc;
      }, {});
    }
    return val;
  }
  function classParser(node) {
    var existingPrefix = node.getAttribute("data-prefix");
    var existingIconName = node.getAttribute("data-icon");
    var innerText = node.innerText !== void 0 ? node.innerText.trim() : "";
    var val = getCanonicalIcon(classArray(node));
    if (!val.prefix) {
      val.prefix = getDefaultUsablePrefix();
    }
    if (existingPrefix && existingIconName) {
      val.prefix = existingPrefix;
      val.iconName = existingIconName;
    }
    if (val.iconName && val.prefix) {
      return val;
    }
    if (val.prefix && innerText.length > 0) {
      val.iconName = byLigature(val.prefix, node.innerText) || byUnicode(val.prefix, toHex(node.innerText));
    }
    if (!val.iconName && config.autoFetchSvg && node.firstChild && node.firstChild.nodeType === Node.TEXT_NODE) {
      val.iconName = node.firstChild.data;
    }
    return val;
  }
  function attributesParser(node) {
    var extraAttributes = toArray(node.attributes).reduce(function(acc, attr) {
      if (acc.name !== "class" && acc.name !== "style") {
        acc[attr.name] = attr.value;
      }
      return acc;
    }, {});
    var title = node.getAttribute("title");
    var titleId = node.getAttribute("data-fa-title-id");
    if (config.autoA11y) {
      if (title) {
        extraAttributes["aria-labelledby"] = "".concat(config.replacementClass, "-title-").concat(titleId || nextUniqueId());
      } else {
        extraAttributes["aria-hidden"] = "true";
        extraAttributes["focusable"] = "false";
      }
    }
    return extraAttributes;
  }
  function blankMeta() {
    return {
      iconName: null,
      title: null,
      titleId: null,
      prefix: null,
      transform: meaninglessTransform,
      symbol: false,
      mask: {
        iconName: null,
        prefix: null,
        rest: []
      },
      maskId: null,
      extra: {
        classes: [],
        styles: {},
        attributes: {}
      }
    };
  }
  function parseMeta(node) {
    var parser = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      styleParser: true
    };
    var _classParser = classParser(node), iconName = _classParser.iconName, prefix = _classParser.prefix, extraClasses = _classParser.rest;
    var extraAttributes = attributesParser(node);
    var pluginMeta = chainHooks("parseNodeAttributes", {}, node);
    var extraStyles = parser.styleParser ? styleParser(node) : [];
    return _objectSpread2({
      iconName,
      title: node.getAttribute("title"),
      titleId: node.getAttribute("data-fa-title-id"),
      prefix,
      transform: meaninglessTransform,
      mask: {
        iconName: null,
        prefix: null,
        rest: []
      },
      maskId: null,
      symbol: false,
      extra: {
        classes: extraClasses,
        styles: extraStyles,
        attributes: extraAttributes
      }
    }, pluginMeta);
  }
  var styles$2 = namespace.styles;
  function generateMutation(node) {
    var nodeMeta = config.autoReplaceSvg === "nest" ? parseMeta(node, {
      styleParser: false
    }) : parseMeta(node);
    if (~nodeMeta.extra.classes.indexOf(LAYERS_TEXT_CLASSNAME)) {
      return callProvided("generateLayersText", node, nodeMeta);
    } else {
      return callProvided("generateSvgReplacementMutation", node, nodeMeta);
    }
  }
  var knownPrefixes = /* @__PURE__ */ new Set();
  FAMILIES.map(function(family) {
    knownPrefixes.add("fa-".concat(family));
  });
  Object.keys(PREFIX_TO_STYLE[FAMILY_CLASSIC]).map(knownPrefixes.add.bind(knownPrefixes));
  Object.keys(PREFIX_TO_STYLE[FAMILY_SHARP]).map(knownPrefixes.add.bind(knownPrefixes));
  knownPrefixes = _toConsumableArray(knownPrefixes);
  function onTree(root) {
    var callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
    if (!IS_DOM)
      return Promise.resolve();
    var htmlClassList = DOCUMENT.documentElement.classList;
    var hclAdd = function hclAdd2(suffix) {
      return htmlClassList.add("".concat(HTML_CLASS_I2SVG_BASE_CLASS, "-").concat(suffix));
    };
    var hclRemove = function hclRemove2(suffix) {
      return htmlClassList.remove("".concat(HTML_CLASS_I2SVG_BASE_CLASS, "-").concat(suffix));
    };
    var prefixes2 = config.autoFetchSvg ? knownPrefixes : FAMILIES.map(function(f) {
      return "fa-".concat(f);
    }).concat(Object.keys(styles$2));
    if (!prefixes2.includes("fa")) {
      prefixes2.push("fa");
    }
    var prefixesDomQuery = [".".concat(LAYERS_TEXT_CLASSNAME, ":not([").concat(DATA_FA_I2SVG, "])")].concat(prefixes2.map(function(p2) {
      return ".".concat(p2, ":not([").concat(DATA_FA_I2SVG, "])");
    })).join(", ");
    if (prefixesDomQuery.length === 0) {
      return Promise.resolve();
    }
    var candidates = [];
    try {
      candidates = toArray(root.querySelectorAll(prefixesDomQuery));
    } catch (e) {
    }
    if (candidates.length > 0) {
      hclAdd("pending");
      hclRemove("complete");
    } else {
      return Promise.resolve();
    }
    var mark = perf.begin("onTree");
    var mutations = candidates.reduce(function(acc, node) {
      try {
        var mutation = generateMutation(node);
        if (mutation) {
          acc.push(mutation);
        }
      } catch (e) {
        if (!PRODUCTION) {
          if (e.name === "MissingIcon") {
            console.error(e);
          }
        }
      }
      return acc;
    }, []);
    return new Promise(function(resolve, reject) {
      Promise.all(mutations).then(function(resolvedMutations) {
        perform(resolvedMutations, function() {
          hclAdd("active");
          hclAdd("complete");
          hclRemove("pending");
          if (typeof callback === "function")
            callback();
          mark();
          resolve();
        });
      }).catch(function(e) {
        mark();
        reject(e);
      });
    });
  }
  function onNode(node) {
    var callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
    generateMutation(node).then(function(mutation) {
      if (mutation) {
        perform([mutation], callback);
      }
    });
  }
  function resolveIcons(next) {
    return function(maybeIconDefinition) {
      var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var iconDefinition = (maybeIconDefinition || {}).icon ? maybeIconDefinition : findIconDefinition(maybeIconDefinition || {});
      var mask = params.mask;
      if (mask) {
        mask = (mask || {}).icon ? mask : findIconDefinition(mask || {});
      }
      return next(iconDefinition, _objectSpread2(_objectSpread2({}, params), {}, {
        mask
      }));
    };
  }
  var render = function render2(iconDefinition) {
    var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var _params$transform = params.transform, transform = _params$transform === void 0 ? meaninglessTransform : _params$transform, _params$symbol = params.symbol, symbol = _params$symbol === void 0 ? false : _params$symbol, _params$mask = params.mask, mask = _params$mask === void 0 ? null : _params$mask, _params$maskId = params.maskId, maskId = _params$maskId === void 0 ? null : _params$maskId, _params$title = params.title, title = _params$title === void 0 ? null : _params$title, _params$titleId = params.titleId, titleId = _params$titleId === void 0 ? null : _params$titleId, _params$classes = params.classes, classes = _params$classes === void 0 ? [] : _params$classes, _params$attributes = params.attributes, attributes = _params$attributes === void 0 ? {} : _params$attributes, _params$styles = params.styles, styles3 = _params$styles === void 0 ? {} : _params$styles;
    if (!iconDefinition)
      return;
    var prefix = iconDefinition.prefix, iconName = iconDefinition.iconName, icon4 = iconDefinition.icon;
    return domVariants(_objectSpread2({
      type: "icon"
    }, iconDefinition), function() {
      callHooks("beforeDOMElementCreation", {
        iconDefinition,
        params
      });
      if (config.autoA11y) {
        if (title) {
          attributes["aria-labelledby"] = "".concat(config.replacementClass, "-title-").concat(titleId || nextUniqueId());
        } else {
          attributes["aria-hidden"] = "true";
          attributes["focusable"] = "false";
        }
      }
      return makeInlineSvgAbstract({
        icons: {
          main: asFoundIcon(icon4),
          mask: mask ? asFoundIcon(mask.icon) : {
            found: false,
            width: null,
            height: null,
            icon: {}
          }
        },
        prefix,
        iconName,
        transform: _objectSpread2(_objectSpread2({}, meaninglessTransform), transform),
        symbol,
        title,
        maskId,
        titleId,
        extra: {
          attributes,
          styles: styles3,
          classes
        }
      });
    });
  };
  var ReplaceElements = {
    mixout: function mixout2() {
      return {
        icon: resolveIcons(render)
      };
    },
    hooks: function hooks2() {
      return {
        mutationObserverCallbacks: function mutationObserverCallbacks(accumulator) {
          accumulator.treeCallback = onTree;
          accumulator.nodeCallback = onNode;
          return accumulator;
        }
      };
    },
    provides: function provides(providers$$1) {
      providers$$1.i2svg = function(params) {
        var _params$node = params.node, node = _params$node === void 0 ? DOCUMENT : _params$node, _params$callback = params.callback, callback = _params$callback === void 0 ? function() {
        } : _params$callback;
        return onTree(node, callback);
      };
      providers$$1.generateSvgReplacementMutation = function(node, nodeMeta) {
        var iconName = nodeMeta.iconName, title = nodeMeta.title, titleId = nodeMeta.titleId, prefix = nodeMeta.prefix, transform = nodeMeta.transform, symbol = nodeMeta.symbol, mask = nodeMeta.mask, maskId = nodeMeta.maskId, extra = nodeMeta.extra;
        return new Promise(function(resolve, reject) {
          Promise.all([findIcon(iconName, prefix), mask.iconName ? findIcon(mask.iconName, mask.prefix) : Promise.resolve({
            found: false,
            width: 512,
            height: 512,
            icon: {}
          })]).then(function(_ref2) {
            var _ref22 = _slicedToArray(_ref2, 2), main = _ref22[0], mask2 = _ref22[1];
            resolve([node, makeInlineSvgAbstract({
              icons: {
                main,
                mask: mask2
              },
              prefix,
              iconName,
              transform,
              symbol,
              maskId,
              title,
              titleId,
              extra,
              watchable: true
            })]);
          }).catch(reject);
        });
      };
      providers$$1.generateAbstractIcon = function(_ref3) {
        var children = _ref3.children, attributes = _ref3.attributes, main = _ref3.main, transform = _ref3.transform, styles3 = _ref3.styles;
        var styleString = joinStyles(styles3);
        if (styleString.length > 0) {
          attributes["style"] = styleString;
        }
        var nextChild;
        if (transformIsMeaningful(transform)) {
          nextChild = callProvided("generateAbstractTransformGrouping", {
            main,
            transform,
            containerWidth: main.width,
            iconWidth: main.width
          });
        }
        children.push(nextChild || main.icon);
        return {
          children,
          attributes
        };
      };
    }
  };
  var Layers = {
    mixout: function mixout3() {
      return {
        layer: function layer2(assembler) {
          var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          var _params$classes = params.classes, classes = _params$classes === void 0 ? [] : _params$classes;
          return domVariants({
            type: "layer"
          }, function() {
            callHooks("beforeDOMElementCreation", {
              assembler,
              params
            });
            var children = [];
            assembler(function(args) {
              Array.isArray(args) ? args.map(function(a) {
                children = children.concat(a.abstract);
              }) : children = children.concat(args.abstract);
            });
            return [{
              tag: "span",
              attributes: {
                class: ["".concat(config.cssPrefix, "-layers")].concat(_toConsumableArray(classes)).join(" ")
              },
              children
            }];
          });
        }
      };
    }
  };
  var LayersCounter = {
    mixout: function mixout4() {
      return {
        counter: function counter2(content) {
          var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          var _params$title = params.title, title = _params$title === void 0 ? null : _params$title, _params$classes = params.classes, classes = _params$classes === void 0 ? [] : _params$classes, _params$attributes = params.attributes, attributes = _params$attributes === void 0 ? {} : _params$attributes, _params$styles = params.styles, styles3 = _params$styles === void 0 ? {} : _params$styles;
          return domVariants({
            type: "counter",
            content
          }, function() {
            callHooks("beforeDOMElementCreation", {
              content,
              params
            });
            return makeLayersCounterAbstract({
              content: content.toString(),
              title,
              extra: {
                attributes,
                styles: styles3,
                classes: ["".concat(config.cssPrefix, "-layers-counter")].concat(_toConsumableArray(classes))
              }
            });
          });
        }
      };
    }
  };
  var LayersText = {
    mixout: function mixout5() {
      return {
        text: function text2(content) {
          var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          var _params$transform = params.transform, transform = _params$transform === void 0 ? meaninglessTransform : _params$transform, _params$title = params.title, title = _params$title === void 0 ? null : _params$title, _params$classes = params.classes, classes = _params$classes === void 0 ? [] : _params$classes, _params$attributes = params.attributes, attributes = _params$attributes === void 0 ? {} : _params$attributes, _params$styles = params.styles, styles3 = _params$styles === void 0 ? {} : _params$styles;
          return domVariants({
            type: "text",
            content
          }, function() {
            callHooks("beforeDOMElementCreation", {
              content,
              params
            });
            return makeLayersTextAbstract({
              content,
              transform: _objectSpread2(_objectSpread2({}, meaninglessTransform), transform),
              title,
              extra: {
                attributes,
                styles: styles3,
                classes: ["".concat(config.cssPrefix, "-layers-text")].concat(_toConsumableArray(classes))
              }
            });
          });
        }
      };
    },
    provides: function provides2(providers$$1) {
      providers$$1.generateLayersText = function(node, nodeMeta) {
        var title = nodeMeta.title, transform = nodeMeta.transform, extra = nodeMeta.extra;
        var width = null;
        var height = null;
        if (IS_IE) {
          var computedFontSize = parseInt(getComputedStyle(node).fontSize, 10);
          var boundingClientRect = node.getBoundingClientRect();
          width = boundingClientRect.width / computedFontSize;
          height = boundingClientRect.height / computedFontSize;
        }
        if (config.autoA11y && !title) {
          extra.attributes["aria-hidden"] = "true";
        }
        return Promise.resolve([node, makeLayersTextAbstract({
          content: node.innerHTML,
          width,
          height,
          transform,
          title,
          extra,
          watchable: true
        })]);
      };
    }
  };
  var CLEAN_CONTENT_PATTERN = new RegExp('"', "ug");
  var SECONDARY_UNICODE_RANGE = [1105920, 1112319];
  function hexValueFromContent(content) {
    var cleaned = content.replace(CLEAN_CONTENT_PATTERN, "");
    var codePoint = codePointAt(cleaned, 0);
    var isPrependTen = codePoint >= SECONDARY_UNICODE_RANGE[0] && codePoint <= SECONDARY_UNICODE_RANGE[1];
    var isDoubled = cleaned.length === 2 ? cleaned[0] === cleaned[1] : false;
    return {
      value: isDoubled ? toHex(cleaned[0]) : toHex(cleaned),
      isSecondary: isPrependTen || isDoubled
    };
  }
  function replaceForPosition(node, position) {
    var pendingAttribute = "".concat(DATA_FA_PSEUDO_ELEMENT_PENDING).concat(position.replace(":", "-"));
    return new Promise(function(resolve, reject) {
      if (node.getAttribute(pendingAttribute) !== null) {
        return resolve();
      }
      var children = toArray(node.children);
      var alreadyProcessedPseudoElement = children.filter(function(c) {
        return c.getAttribute(DATA_FA_PSEUDO_ELEMENT) === position;
      })[0];
      var styles3 = WINDOW.getComputedStyle(node, position);
      var fontFamily = styles3.getPropertyValue("font-family").match(FONT_FAMILY_PATTERN);
      var fontWeight = styles3.getPropertyValue("font-weight");
      var content = styles3.getPropertyValue("content");
      if (alreadyProcessedPseudoElement && !fontFamily) {
        node.removeChild(alreadyProcessedPseudoElement);
        return resolve();
      } else if (fontFamily && content !== "none" && content !== "") {
        var _content = styles3.getPropertyValue("content");
        var family = ~["Sharp"].indexOf(fontFamily[2]) ? FAMILY_SHARP : FAMILY_CLASSIC;
        var prefix = ~["Solid", "Regular", "Light", "Thin", "Duotone", "Brands", "Kit"].indexOf(fontFamily[2]) ? STYLE_TO_PREFIX[family][fontFamily[2].toLowerCase()] : FONT_WEIGHT_TO_PREFIX[family][fontWeight];
        var _hexValueFromContent = hexValueFromContent(_content), hexValue = _hexValueFromContent.value, isSecondary = _hexValueFromContent.isSecondary;
        var isV4 = fontFamily[0].startsWith("FontAwesome");
        var iconName = byUnicode(prefix, hexValue);
        var iconIdentifier = iconName;
        if (isV4) {
          var iconName4 = byOldUnicode(hexValue);
          if (iconName4.iconName && iconName4.prefix) {
            iconName = iconName4.iconName;
            prefix = iconName4.prefix;
          }
        }
        if (iconName && !isSecondary && (!alreadyProcessedPseudoElement || alreadyProcessedPseudoElement.getAttribute(DATA_PREFIX) !== prefix || alreadyProcessedPseudoElement.getAttribute(DATA_ICON) !== iconIdentifier)) {
          node.setAttribute(pendingAttribute, iconIdentifier);
          if (alreadyProcessedPseudoElement) {
            node.removeChild(alreadyProcessedPseudoElement);
          }
          var meta = blankMeta();
          var extra = meta.extra;
          extra.attributes[DATA_FA_PSEUDO_ELEMENT] = position;
          findIcon(iconName, prefix).then(function(main) {
            var abstract = makeInlineSvgAbstract(_objectSpread2(_objectSpread2({}, meta), {}, {
              icons: {
                main,
                mask: emptyCanonicalIcon()
              },
              prefix,
              iconName: iconIdentifier,
              extra,
              watchable: true
            }));
            var element = DOCUMENT.createElement("svg");
            if (position === "::before") {
              node.insertBefore(element, node.firstChild);
            } else {
              node.appendChild(element);
            }
            element.outerHTML = abstract.map(function(a) {
              return toHtml(a);
            }).join("\n");
            node.removeAttribute(pendingAttribute);
            resolve();
          }).catch(reject);
        } else {
          resolve();
        }
      } else {
        resolve();
      }
    });
  }
  function replace2(node) {
    return Promise.all([replaceForPosition(node, "::before"), replaceForPosition(node, "::after")]);
  }
  function processable(node) {
    return node.parentNode !== document.head && !~TAGNAMES_TO_SKIP_FOR_PSEUDOELEMENTS.indexOf(node.tagName.toUpperCase()) && !node.getAttribute(DATA_FA_PSEUDO_ELEMENT) && (!node.parentNode || node.parentNode.tagName !== "svg");
  }
  function searchPseudoElements(root) {
    if (!IS_DOM)
      return;
    return new Promise(function(resolve, reject) {
      var operations = toArray(root.querySelectorAll("*")).filter(processable).map(replace2);
      var end3 = perf.begin("searchPseudoElements");
      disableObservation();
      Promise.all(operations).then(function() {
        end3();
        enableObservation();
        resolve();
      }).catch(function() {
        end3();
        enableObservation();
        reject();
      });
    });
  }
  var PseudoElements = {
    hooks: function hooks3() {
      return {
        mutationObserverCallbacks: function mutationObserverCallbacks(accumulator) {
          accumulator.pseudoElementsCallback = searchPseudoElements;
          return accumulator;
        }
      };
    },
    provides: function provides3(providers$$1) {
      providers$$1.pseudoElements2svg = function(params) {
        var _params$node = params.node, node = _params$node === void 0 ? DOCUMENT : _params$node;
        if (config.searchPseudoElements) {
          searchPseudoElements(node);
        }
      };
    }
  };
  var _unwatched = false;
  var MutationObserver$1 = {
    mixout: function mixout6() {
      return {
        dom: {
          unwatch: function unwatch() {
            disableObservation();
            _unwatched = true;
          }
        }
      };
    },
    hooks: function hooks4() {
      return {
        bootstrap: function bootstrap() {
          observe(chainHooks("mutationObserverCallbacks", {}));
        },
        noAuto: function noAuto3() {
          disconnect();
        },
        watch: function watch2(params) {
          var observeMutationsRoot = params.observeMutationsRoot;
          if (_unwatched) {
            enableObservation();
          } else {
            observe(chainHooks("mutationObserverCallbacks", {
              observeMutationsRoot
            }));
          }
        }
      };
    }
  };
  var parseTransformString = function parseTransformString2(transformString) {
    var transform = {
      size: 16,
      x: 0,
      y: 0,
      flipX: false,
      flipY: false,
      rotate: 0
    };
    return transformString.toLowerCase().split(" ").reduce(function(acc, n) {
      var parts = n.toLowerCase().split("-");
      var first = parts[0];
      var rest = parts.slice(1).join("-");
      if (first && rest === "h") {
        acc.flipX = true;
        return acc;
      }
      if (first && rest === "v") {
        acc.flipY = true;
        return acc;
      }
      rest = parseFloat(rest);
      if (isNaN(rest)) {
        return acc;
      }
      switch (first) {
        case "grow":
          acc.size = acc.size + rest;
          break;
        case "shrink":
          acc.size = acc.size - rest;
          break;
        case "left":
          acc.x = acc.x - rest;
          break;
        case "right":
          acc.x = acc.x + rest;
          break;
        case "up":
          acc.y = acc.y - rest;
          break;
        case "down":
          acc.y = acc.y + rest;
          break;
        case "rotate":
          acc.rotate = acc.rotate + rest;
          break;
      }
      return acc;
    }, transform);
  };
  var PowerTransforms = {
    mixout: function mixout7() {
      return {
        parse: {
          transform: function transform(transformString) {
            return parseTransformString(transformString);
          }
        }
      };
    },
    hooks: function hooks5() {
      return {
        parseNodeAttributes: function parseNodeAttributes(accumulator, node) {
          var transformString = node.getAttribute("data-fa-transform");
          if (transformString) {
            accumulator.transform = parseTransformString(transformString);
          }
          return accumulator;
        }
      };
    },
    provides: function provides4(providers2) {
      providers2.generateAbstractTransformGrouping = function(_ref2) {
        var main = _ref2.main, transform = _ref2.transform, containerWidth = _ref2.containerWidth, iconWidth = _ref2.iconWidth;
        var outer = {
          transform: "translate(".concat(containerWidth / 2, " 256)")
        };
        var innerTranslate = "translate(".concat(transform.x * 32, ", ").concat(transform.y * 32, ") ");
        var innerScale = "scale(".concat(transform.size / 16 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / 16 * (transform.flipY ? -1 : 1), ") ");
        var innerRotate = "rotate(".concat(transform.rotate, " 0 0)");
        var inner = {
          transform: "".concat(innerTranslate, " ").concat(innerScale, " ").concat(innerRotate)
        };
        var path = {
          transform: "translate(".concat(iconWidth / 2 * -1, " -256)")
        };
        var operations = {
          outer,
          inner,
          path
        };
        return {
          tag: "g",
          attributes: _objectSpread2({}, operations.outer),
          children: [{
            tag: "g",
            attributes: _objectSpread2({}, operations.inner),
            children: [{
              tag: main.icon.tag,
              children: main.icon.children,
              attributes: _objectSpread2(_objectSpread2({}, main.icon.attributes), operations.path)
            }]
          }]
        };
      };
    }
  };
  var ALL_SPACE = {
    x: 0,
    y: 0,
    width: "100%",
    height: "100%"
  };
  function fillBlack(abstract) {
    var force = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    if (abstract.attributes && (abstract.attributes.fill || force)) {
      abstract.attributes.fill = "black";
    }
    return abstract;
  }
  function deGroup(abstract) {
    if (abstract.tag === "g") {
      return abstract.children;
    } else {
      return [abstract];
    }
  }
  var Masks = {
    hooks: function hooks6() {
      return {
        parseNodeAttributes: function parseNodeAttributes(accumulator, node) {
          var maskData = node.getAttribute("data-fa-mask");
          var mask = !maskData ? emptyCanonicalIcon() : getCanonicalIcon(maskData.split(" ").map(function(i) {
            return i.trim();
          }));
          if (!mask.prefix) {
            mask.prefix = getDefaultUsablePrefix();
          }
          accumulator.mask = mask;
          accumulator.maskId = node.getAttribute("data-fa-mask-id");
          return accumulator;
        }
      };
    },
    provides: function provides5(providers2) {
      providers2.generateAbstractMask = function(_ref2) {
        var children = _ref2.children, attributes = _ref2.attributes, main = _ref2.main, mask = _ref2.mask, explicitMaskId = _ref2.maskId, transform = _ref2.transform;
        var mainWidth = main.width, mainPath = main.icon;
        var maskWidth = mask.width, maskPath = mask.icon;
        var trans = transformForSvg({
          transform,
          containerWidth: maskWidth,
          iconWidth: mainWidth
        });
        var maskRect = {
          tag: "rect",
          attributes: _objectSpread2(_objectSpread2({}, ALL_SPACE), {}, {
            fill: "white"
          })
        };
        var maskInnerGroupChildrenMixin = mainPath.children ? {
          children: mainPath.children.map(fillBlack)
        } : {};
        var maskInnerGroup = {
          tag: "g",
          attributes: _objectSpread2({}, trans.inner),
          children: [fillBlack(_objectSpread2({
            tag: mainPath.tag,
            attributes: _objectSpread2(_objectSpread2({}, mainPath.attributes), trans.path)
          }, maskInnerGroupChildrenMixin))]
        };
        var maskOuterGroup = {
          tag: "g",
          attributes: _objectSpread2({}, trans.outer),
          children: [maskInnerGroup]
        };
        var maskId = "mask-".concat(explicitMaskId || nextUniqueId());
        var clipId = "clip-".concat(explicitMaskId || nextUniqueId());
        var maskTag = {
          tag: "mask",
          attributes: _objectSpread2(_objectSpread2({}, ALL_SPACE), {}, {
            id: maskId,
            maskUnits: "userSpaceOnUse",
            maskContentUnits: "userSpaceOnUse"
          }),
          children: [maskRect, maskOuterGroup]
        };
        var defs = {
          tag: "defs",
          children: [{
            tag: "clipPath",
            attributes: {
              id: clipId
            },
            children: deGroup(maskPath)
          }, maskTag]
        };
        children.push(defs, {
          tag: "rect",
          attributes: _objectSpread2({
            fill: "currentColor",
            "clip-path": "url(#".concat(clipId, ")"),
            mask: "url(#".concat(maskId, ")")
          }, ALL_SPACE)
        });
        return {
          children,
          attributes
        };
      };
    }
  };
  var MissingIconIndicator = {
    provides: function provides6(providers2) {
      var reduceMotion = false;
      if (WINDOW.matchMedia) {
        reduceMotion = WINDOW.matchMedia("(prefers-reduced-motion: reduce)").matches;
      }
      providers2.missingIconAbstract = function() {
        var gChildren = [];
        var FILL = {
          fill: "currentColor"
        };
        var ANIMATION_BASE = {
          attributeType: "XML",
          repeatCount: "indefinite",
          dur: "2s"
        };
        gChildren.push({
          tag: "path",
          attributes: _objectSpread2(_objectSpread2({}, FILL), {}, {
            d: "M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"
          })
        });
        var OPACITY_ANIMATE = _objectSpread2(_objectSpread2({}, ANIMATION_BASE), {}, {
          attributeName: "opacity"
        });
        var dot = {
          tag: "circle",
          attributes: _objectSpread2(_objectSpread2({}, FILL), {}, {
            cx: "256",
            cy: "364",
            r: "28"
          }),
          children: []
        };
        if (!reduceMotion) {
          dot.children.push({
            tag: "animate",
            attributes: _objectSpread2(_objectSpread2({}, ANIMATION_BASE), {}, {
              attributeName: "r",
              values: "28;14;28;28;14;28;"
            })
          }, {
            tag: "animate",
            attributes: _objectSpread2(_objectSpread2({}, OPACITY_ANIMATE), {}, {
              values: "1;0;1;1;0;1;"
            })
          });
        }
        gChildren.push(dot);
        gChildren.push({
          tag: "path",
          attributes: _objectSpread2(_objectSpread2({}, FILL), {}, {
            opacity: "1",
            d: "M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"
          }),
          children: reduceMotion ? [] : [{
            tag: "animate",
            attributes: _objectSpread2(_objectSpread2({}, OPACITY_ANIMATE), {}, {
              values: "1;0;0;0;0;1;"
            })
          }]
        });
        if (!reduceMotion) {
          gChildren.push({
            tag: "path",
            attributes: _objectSpread2(_objectSpread2({}, FILL), {}, {
              opacity: "0",
              d: "M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"
            }),
            children: [{
              tag: "animate",
              attributes: _objectSpread2(_objectSpread2({}, OPACITY_ANIMATE), {}, {
                values: "0;0;1;1;0;0;"
              })
            }]
          });
        }
        return {
          tag: "g",
          attributes: {
            "class": "missing"
          },
          children: gChildren
        };
      };
    }
  };
  var SvgSymbols = {
    hooks: function hooks7() {
      return {
        parseNodeAttributes: function parseNodeAttributes(accumulator, node) {
          var symbolData = node.getAttribute("data-fa-symbol");
          var symbol = symbolData === null ? false : symbolData === "" ? true : symbolData;
          accumulator["symbol"] = symbol;
          return accumulator;
        }
      };
    }
  };
  var plugins = [InjectCSS, ReplaceElements, Layers, LayersCounter, LayersText, PseudoElements, MutationObserver$1, PowerTransforms, Masks, MissingIconIndicator, SvgSymbols];
  registerPlugins(plugins, {
    mixoutsTo: api
  });
  var noAuto$1 = api.noAuto;
  var config$1 = api.config;
  var library$1 = api.library;
  var dom$1 = api.dom;
  var parse$1 = api.parse;
  var findIconDefinition$1 = api.findIconDefinition;
  var toHtml$1 = api.toHtml;
  var icon2 = api.icon;
  var layer = api.layer;
  var text = api.text;
  var counter = api.counter;

  // node_modules/@fortawesome/free-solid-svg-icons/index.mjs
  var faPencil = {
    prefix: "fas",
    iconName: "pencil",
    icon: [512, 512, [9999, 61504, "pencil-alt"], "f303", "M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"]
  };
  var faHourglassEnd = {
    prefix: "fas",
    iconName: "hourglass-end",
    icon: [384, 512, [8987, "hourglass-3"], "f253", "M32 0C14.3 0 0 14.3 0 32S14.3 64 32 64V75c0 42.4 16.9 83.1 46.9 113.1L146.7 256 78.9 323.9C48.9 353.9 32 394.6 32 437v11c-17.7 0-32 14.3-32 32s14.3 32 32 32H64 320h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V437c0-42.4-16.9-83.1-46.9-113.1L237.3 256l67.9-67.9c30-30 46.9-70.7 46.9-113.1V64c17.7 0 32-14.3 32-32s-14.3-32-32-32H320 64 32zM96 75V64H288V75c0 25.5-10.1 49.9-28.1 67.9L192 210.7l-67.9-67.9C106.1 124.9 96 100.4 96 75z"]
  };
  var faUsers = {
    prefix: "fas",
    iconName: "users",
    icon: [640, 512, [], "f0c0", "M144 160c-44.2 0-80-35.8-80-80S99.8 0 144 0s80 35.8 80 80s-35.8 80-80 80zm368 0c-44.2 0-80-35.8-80-80s35.8-80 80-80s80 35.8 80 80s-35.8 80-80 80zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM416 224c0 53-43 96-96 96s-96-43-96-96s43-96 96-96s96 43 96 96zM128 485.3C128 411.7 187.7 352 261.3 352H378.7C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z"]
  };
  var faHourglassStart = {
    prefix: "fas",
    iconName: "hourglass-start",
    icon: [384, 512, ["hourglass-1"], "f251", "M32 0C14.3 0 0 14.3 0 32S14.3 64 32 64V75c0 42.4 16.9 83.1 46.9 113.1L146.7 256 78.9 323.9C48.9 353.9 32 394.6 32 437v11c-17.7 0-32 14.3-32 32s14.3 32 32 32H64 320h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V437c0-42.4-16.9-83.1-46.9-113.1L237.3 256l67.9-67.9c30-30 46.9-70.7 46.9-113.1V64c17.7 0 32-14.3 32-32s-14.3-32-32-32H320 64 32zM288 437v11H96V437c0-25.5 10.1-49.9 28.1-67.9L192 301.3l67.9 67.9c18 18 28.1 42.4 28.1 67.9z"]
  };
  var faEye = {
    prefix: "fas",
    iconName: "eye",
    icon: [576, 512, [128065], "f06e", "M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM432 256c0 79.5-64.5 144-144 144s-144-64.5-144-144s64.5-144 144-144s144 64.5 144 144zM288 192c0 35.3-28.7 64-64 64c-11.5 0-22.3-3-31.6-8.4c-.2 2.8-.4 5.5-.4 8.4c0 53 43 96 96 96s96-43 96-96s-43-96-96-96c-2.8 0-5.6 .1-8.4 .4c5.3 9.3 8.4 20.1 8.4 31.6z"]
  };
  var faTrash = {
    prefix: "fas",
    iconName: "trash",
    icon: [448, 512, [], "f1f8", "M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"]
  };
  var faEnvelope = {
    prefix: "fas",
    iconName: "envelope",
    icon: [512, 512, [128386, 9993, 61443], "f0e0", "M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"]
  };
  var faClock = {
    prefix: "fas",
    iconName: "clock",
    icon: [512, 512, [128339, "clock-four"], "f017", "M256 512C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256s-114.6 256-256 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"]
  };
  var faHouse = {
    prefix: "fas",
    iconName: "house",
    icon: [576, 512, [127968, 63498, 63500, "home", "home-alt", "home-lg-alt"], "f015", "M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"]
  };
  var faHome = faHouse;
  var faCalendarWeek = {
    prefix: "fas",
    iconName: "calendar-week",
    icon: [448, 512, [], "f784", "M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm80 64c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16H368c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H80z"]
  };
  var faLink = {
    prefix: "fas",
    iconName: "link",
    icon: [640, 512, [128279, "chain"], "f0c1", "M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"]
  };
  var faChevronLeft = {
    prefix: "fas",
    iconName: "chevron-left",
    icon: [384, 512, [9001], "f053", "M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 278.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"]
  };
  var faChevronRight = {
    prefix: "fas",
    iconName: "chevron-right",
    icon: [384, 512, [9002], "f054", "M342.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"]
  };
  var faCircleXmark = {
    prefix: "fas",
    iconName: "circle-xmark",
    icon: [512, 512, [61532, "times-circle", "xmark-circle"], "f057", "M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"]
  };
  var faTimesCircle = faCircleXmark;

  // public/assets/FontAwesomeIcons.ts
  library$1.add(faCalendarWeek);
  library$1.add(faChevronLeft);
  library$1.add(faChevronRight);
  library$1.add(faClock);
  library$1.add(faEnvelope);
  library$1.add(faEye);
  library$1.add(faHome);
  library$1.add(faHourglassEnd);
  library$1.add(faHourglassStart);
  library$1.add(faLink);
  library$1.add(faPencil);
  library$1.add(faTimesCircle);
  library$1.add(faTrash);
  library$1.add(faUsers);
  var calendarWeek = icon2({ prefix: "fas", iconName: "calendar-week" }).html[0];
  var chevronLeft = icon2({ prefix: "fas", iconName: "chevron-left" }).html[0];
  var chevronRight = icon2({ prefix: "fas", iconName: "chevron-right" }).html[0];
  var clockIcon = icon2({ prefix: "fas", iconName: "clock" }).html[0];
  var envelopIcon = icon2({ prefix: "fas", iconName: "envelope" }).html[0];
  var eyeIcon = icon2({ prefix: "fas", iconName: "eye" }).html[0];
  var home = icon2({ prefix: "fas", iconName: "home" }).html[0];
  var hourglassEnd = icon2({ prefix: "fas", iconName: "hourglass-end" }).html[0];
  var hourglassStart = icon2({
    prefix: "fas",
    iconName: "hourglass-start"
  }).html[0];
  var link = icon2({ prefix: "fas", iconName: "link" }).html[0];
  var pencil = icon2({ prefix: "fas", iconName: "pencil" }).html[0];
  var times = icon2({ prefix: "fas", iconName: "times-circle" }).html[0];
  var trash = icon2({ prefix: "fas", iconName: "trash" }).html[0];
  var usersIcon = icon2({ prefix: "fas", iconName: "users" }).html[0];

  // src/views/Day/Day.ts
  var bgColours = ["#0B094F46", "#7A8ACF", colors.royalBlueLight];
  var arrowStyles = {
    background: "none",
    border: "none",
    color: basics.whiteColor,
    fontSize: "24px",
    paddingTop: "12px",
    paddingBottom: "12px"
  };
  function Day(date) {
    let dayView = date ? new Date(date) : new Date();
    const el = Div({
      styles: {
        maxWidth: "1000px",
        marginLeft: "auto",
        marginRight: "auto"
      }
    });
    function init2() {
      return __async(this, null, function* () {
        const headerDate = Div({
          styles: __spreadProps(__spreadValues({}, flexAlignItemsCenter), {
            margin: "12px 20px"
          })
        });
        const title = H1({
          attr: {
            innerText: new Intl.DateTimeFormat("en-US", dateOptions).format(
              dayView
            )
          },
          styles: {
            fontFamily: fonts.poppins,
            fontWeight: "400",
            fontSize: "32px,",
            color: basics.whiteColor,
            padding: "12px"
          }
        });
        setStyle(title, { padding: "12px" });
        const prevDay = Button({
          selectors: {
            id: "left-chevron"
          },
          attr: {
            innerHTML: chevronLeft,
            onclick: () => goToSelectedDayView(dayView, "previous"),
            onmouseover: () => {
              const button2 = byId("left-chevron");
              if (button2) {
                button2.style.background = colors.royalBlueLight;
                button2.style.borderRadius = "4px";
                button2.style.color = basics.whiteColor;
              }
            },
            onmouseout: () => {
              const button2 = byId("left-chevron");
              if (button2) {
                button2.style.color = basics.whiteColor;
                button2.style.background = "none";
                button2.style.borderRadius = "none";
              }
            }
          },
          styles: arrowStyles
        });
        const nextDay = Button({
          selectors: {
            id: "right-chevron"
          },
          attr: {
            innerHTML: chevronRight,
            onclick: () => goToSelectedDayView(dayView, "next"),
            onmouseover: () => {
              const button2 = byId("right-chevron");
              if (button2) {
                button2.style.background = colors.royalBlueLight;
                button2.style.borderRadius = "4px";
                button2.style.color = basics.whiteColor;
              }
            },
            onmouseout: () => {
              const button2 = byId("right-chevron");
              if (button2) {
                button2.style.color = basics.whiteColor;
                button2.style.background = "none";
              }
            }
          },
          styles: arrowStyles
        });
        headerDate.appendChild(prevDay);
        headerDate.appendChild(nextDay);
        headerDate.appendChild(title);
        el.appendChild(headerDate);
        const eventsList = Div();
        const allDayEventsContainer = Div({
          styles: { display: "flex", gap: "16px", margin: "12px 20px" }
        });
        const events = yield getEventsForDay(dayView);
        if (events.length) {
          events.sort(
            (date1, date2) => date1.start.valueOf() - date2.start.valueOf()
          );
          events.forEach((event, idx) => {
            if (event.allDay) {
              const allDayEventStyles = {
                borderRadius: "4px",
                width: "fit-content",
                backgroundColor: basics.whiteColor,
                color: colors.mandarine,
                cursor: "pointer"
              };
              const allDayEvents = createEventCard(event, allDayEventStyles);
              allDayEventsContainer.append(allDayEvents);
            } else {
              const eventContainer = Div({
                styles: __spreadValues({
                  borderRadius: "4px",
                  margin: "0 20px",
                  gridGap: "16px"
                }, flexAlignItemsCenter)
              });
              const times2 = Div({
                styles: {
                  display: "flex",
                  marginBottom: "auto",
                  maxWidth: "172px",
                  width: "100%",
                  padding: "8px 12px 8px 0"
                }
              });
              if (event.start && event.end) {
                const startTime = `${formatDateTime(timeOptions, event.start)} `;
                const endTime = `${formatDateTime(timeOptions, event.end)}`;
                const timesText = Span({
                  attr: {
                    innerText: `${startTime} - ${endTime}`.replace(/\./g, "")
                  },
                  styles: {
                    textTransform: "uppercase",
                    fontFamily: fonts.montserrat,
                    color: basics.darkCharcoal,
                    fontWeight: fontsWeight.regular,
                    fontSize: "14px",
                    padding: "12px 0"
                  }
                });
                times2.appendChild(timesText);
              }
              eventContainer.appendChild(times2);
              const eventStyles = {
                borderRadius: "4px",
                width: "100%",
                backgroundColor: bgColours[idx % bgColours.length],
                color: basics.whiteColor,
                cursor: "pointer",
                maxWidth: "980px"
              };
              const eventCard = createEventCard(event, eventStyles);
              eventContainer.appendChild(eventCard);
              eventsList.appendChild(eventContainer);
            }
          });
          el.appendChild(allDayEventsContainer);
          el.appendChild(eventsList);
        } else {
          const noEventsLabel = Div({
            attr: { innerText: "No events." },
            styles: {
              fontFamily: fonts.montserrat,
              margin: "12px 20px",
              fontStyle: "italic",
              color: basics.slateGray
            }
          });
          el.appendChild(noEventsLabel);
        }
        const button = Button({
          attr: {
            innerHTML: "grid",
            onclick: () => {
              setURL("/grid");
            }
          }
        });
      });
    }
    function changeActiveDay(e) {
      if (e.key === "ArrowRight") {
        goToSelectedDayView(dayView, "next");
      }
      if (e.key === "ArrowLeft") {
        goToSelectedDayView(dayView, "previous");
      }
      return;
    }
    init2();
    return el;
  }
  function createEventCard(event, styles3) {
    const eventCard = Div({ styles: styles3 });
    const title = P({
      attr: {
        innerText: event.title,
        onclick: () => setURL(`/events/${event._id}`)
      },
      styles: {
        fontFamily: fonts.poppins,
        fontWeight: "400",
        padding: "12px"
      }
    });
    eventCard.appendChild(title);
    return eventCard;
  }
  function goToSelectedDayView(currentDayView, direction) {
    const moveDay = direction === "previous" ? currentDayView.getDate() - 1 : currentDayView.getDate() + 1;
    const previousDay = currentDayView.setDate(moveDay);
    currentDayView = new Date(previousDay);
    const dateString = formatSplitDate(currentDayView, "/", "yyyy-mm-dd");
    setURL(`/day/${dateString}`);
  }

  // node_modules/autolinker/dist/es2015/version.js
  var version = "4.0.0";

  // node_modules/autolinker/dist/es2015/utils.js
  function isUndefined(value) {
    return value === void 0;
  }
  function isBoolean(value) {
    return typeof value === "boolean";
  }
  function defaults(dest, src) {
    for (var prop in src) {
      if (src.hasOwnProperty(prop) && isUndefined(dest[prop])) {
        dest[prop] = src[prop];
      }
    }
    return dest;
  }
  function ellipsis(str, truncateLen, ellipsisChars) {
    var ellipsisLength;
    if (str.length > truncateLen) {
      if (ellipsisChars == null) {
        ellipsisChars = "&hellip;";
        ellipsisLength = 3;
      } else {
        ellipsisLength = ellipsisChars.length;
      }
      str = str.substring(0, truncateLen - ellipsisLength) + ellipsisChars;
    }
    return str;
  }
  function remove(arr, item) {
    for (var i = arr.length - 1; i >= 0; i--) {
      if (arr[i] === item) {
        arr.splice(i, 1);
      }
    }
  }
  function removeWithPredicate(arr, fn) {
    for (var i = arr.length - 1; i >= 0; i--) {
      if (fn(arr[i]) === true) {
        arr.splice(i, 1);
      }
    }
  }
  function assertNever(theValue) {
    throw new Error("Unhandled case for value: '".concat(theValue, "'"));
  }

  // node_modules/autolinker/dist/es2015/regex-lib.js
  var letterRe = /[A-Za-z]/;
  var digitRe = /[\d]/;
  var whitespaceRe = /\s/;
  var quoteRe = /['"]/;
  var controlCharsRe = /[\x00-\x1F\x7F]/;
  var alphaCharsStr = /A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC/.source;
  var emojiStr = /\u2700-\u27bf\udde6-\uddff\ud800-\udbff\udc00-\udfff\ufe0e\ufe0f\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0\ud83c\udffb-\udfff\u200d\u3299\u3297\u303d\u3030\u24c2\ud83c\udd70-\udd71\udd7e-\udd7f\udd8e\udd91-\udd9a\udde6-\uddff\ude01-\ude02\ude1a\ude2f\ude32-\ude3a\ude50-\ude51\u203c\u2049\u25aa-\u25ab\u25b6\u25c0\u25fb-\u25fe\u00a9\u00ae\u2122\u2139\udc04\u2600-\u26FF\u2b05\u2b06\u2b07\u2b1b\u2b1c\u2b50\u2b55\u231a\u231b\u2328\u23cf\u23e9-\u23f3\u23f8-\u23fa\udccf\u2935\u2934\u2190-\u21ff/.source;
  var marksStr = /\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D4-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C03\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D01-\u0D03\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u192B\u1930-\u193B\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF5\u1DFB-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C5\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F/.source;
  var alphaCharsAndMarksStr = alphaCharsStr + emojiStr + marksStr;
  var decimalNumbersStr = /0-9\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29\u1040-\u1049\u1090-\u1099\u17E0-\u17E9\u1810-\u1819\u1946-\u194F\u19D0-\u19D9\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\uA620-\uA629\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19/.source;
  var alphaNumericCharsRe = new RegExp("[".concat(alphaCharsStr + decimalNumbersStr, "]"));
  var alphaNumericAndMarksCharsStr = alphaCharsAndMarksStr + decimalNumbersStr;
  var alphaNumericAndMarksRe = new RegExp("[".concat(alphaNumericAndMarksCharsStr, "]"));

  // node_modules/autolinker/dist/es2015/html-tag.js
  var HtmlTag = function() {
    function HtmlTag2(cfg) {
      if (cfg === void 0) {
        cfg = {};
      }
      this.tagName = "";
      this.attrs = {};
      this.innerHTML = "";
      this.tagName = cfg.tagName || "";
      this.attrs = cfg.attrs || {};
      this.innerHTML = cfg.innerHtml || cfg.innerHTML || "";
    }
    HtmlTag2.prototype.setTagName = function(tagName) {
      this.tagName = tagName;
      return this;
    };
    HtmlTag2.prototype.getTagName = function() {
      return this.tagName || "";
    };
    HtmlTag2.prototype.setAttr = function(attrName, attrValue) {
      var tagAttrs = this.getAttrs();
      tagAttrs[attrName] = attrValue;
      return this;
    };
    HtmlTag2.prototype.getAttr = function(attrName) {
      return this.getAttrs()[attrName];
    };
    HtmlTag2.prototype.setAttrs = function(attrs) {
      Object.assign(this.getAttrs(), attrs);
      return this;
    };
    HtmlTag2.prototype.getAttrs = function() {
      return this.attrs || (this.attrs = {});
    };
    HtmlTag2.prototype.setClass = function(cssClass) {
      return this.setAttr("class", cssClass);
    };
    HtmlTag2.prototype.addClass = function(cssClass) {
      var classAttr = this.getClass(), classes = !classAttr ? [] : classAttr.split(whitespaceRe), newClasses = cssClass.split(whitespaceRe), newClass;
      while (newClass = newClasses.shift()) {
        if (classes.indexOf(newClass) === -1) {
          classes.push(newClass);
        }
      }
      this.getAttrs()["class"] = classes.join(" ");
      return this;
    };
    HtmlTag2.prototype.removeClass = function(cssClass) {
      var classAttr = this.getClass(), classes = !classAttr ? [] : classAttr.split(whitespaceRe), removeClasses = cssClass.split(whitespaceRe), removeClass;
      while (classes.length && (removeClass = removeClasses.shift())) {
        var idx = classes.indexOf(removeClass);
        if (idx !== -1) {
          classes.splice(idx, 1);
        }
      }
      this.getAttrs()["class"] = classes.join(" ");
      return this;
    };
    HtmlTag2.prototype.getClass = function() {
      return this.getAttrs()["class"] || "";
    };
    HtmlTag2.prototype.hasClass = function(cssClass) {
      return (" " + this.getClass() + " ").indexOf(" " + cssClass + " ") !== -1;
    };
    HtmlTag2.prototype.setInnerHTML = function(html) {
      this.innerHTML = html;
      return this;
    };
    HtmlTag2.prototype.setInnerHtml = function(html) {
      return this.setInnerHTML(html);
    };
    HtmlTag2.prototype.getInnerHTML = function() {
      return this.innerHTML || "";
    };
    HtmlTag2.prototype.getInnerHtml = function() {
      return this.getInnerHTML();
    };
    HtmlTag2.prototype.toAnchorString = function() {
      var tagName = this.getTagName(), attrsStr = this.buildAttrsStr();
      attrsStr = attrsStr ? " " + attrsStr : "";
      return ["<", tagName, attrsStr, ">", this.getInnerHtml(), "</", tagName, ">"].join("");
    };
    HtmlTag2.prototype.buildAttrsStr = function() {
      if (!this.attrs)
        return "";
      var attrs = this.getAttrs(), attrsArr = [];
      for (var prop in attrs) {
        if (attrs.hasOwnProperty(prop)) {
          attrsArr.push(prop + '="' + attrs[prop] + '"');
        }
      }
      return attrsArr.join(" ");
    };
    return HtmlTag2;
  }();

  // node_modules/autolinker/dist/es2015/truncate/truncate-smart.js
  function truncateSmart(url, truncateLen, ellipsisChars) {
    var ellipsisLengthBeforeParsing;
    var ellipsisLength;
    if (ellipsisChars == null) {
      ellipsisChars = "&hellip;";
      ellipsisLength = 3;
      ellipsisLengthBeforeParsing = 8;
    } else {
      ellipsisLength = ellipsisChars.length;
      ellipsisLengthBeforeParsing = ellipsisChars.length;
    }
    var parse_url = function(url2) {
      var urlObj2 = {};
      var urlSub = url2;
      var match = urlSub.match(/^([a-z]+):\/\//i);
      if (match) {
        urlObj2.scheme = match[1];
        urlSub = urlSub.substr(match[0].length);
      }
      match = urlSub.match(/^(.*?)(?=(\?|#|\/|$))/i);
      if (match) {
        urlObj2.host = match[1];
        urlSub = urlSub.substr(match[0].length);
      }
      match = urlSub.match(/^\/(.*?)(?=(\?|#|$))/i);
      if (match) {
        urlObj2.path = match[1];
        urlSub = urlSub.substr(match[0].length);
      }
      match = urlSub.match(/^\?(.*?)(?=(#|$))/i);
      if (match) {
        urlObj2.query = match[1];
        urlSub = urlSub.substr(match[0].length);
      }
      match = urlSub.match(/^#(.*?)$/i);
      if (match) {
        urlObj2.fragment = match[1];
      }
      return urlObj2;
    };
    var buildUrl = function(urlObj2) {
      var url2 = "";
      if (urlObj2.scheme && urlObj2.host) {
        url2 += urlObj2.scheme + "://";
      }
      if (urlObj2.host) {
        url2 += urlObj2.host;
      }
      if (urlObj2.path) {
        url2 += "/" + urlObj2.path;
      }
      if (urlObj2.query) {
        url2 += "?" + urlObj2.query;
      }
      if (urlObj2.fragment) {
        url2 += "#" + urlObj2.fragment;
      }
      return url2;
    };
    var buildSegment = function(segment, remainingAvailableLength3) {
      var remainingAvailableLengthHalf = remainingAvailableLength3 / 2, startOffset = Math.ceil(remainingAvailableLengthHalf), endOffset = -1 * Math.floor(remainingAvailableLengthHalf), end4 = "";
      if (endOffset < 0) {
        end4 = segment.substr(endOffset);
      }
      return segment.substr(0, startOffset) + ellipsisChars + end4;
    };
    if (url.length <= truncateLen) {
      return url;
    }
    var availableLength = truncateLen - ellipsisLength;
    var urlObj = parse_url(url);
    if (urlObj.query) {
      var matchQuery = urlObj.query.match(/^(.*?)(?=(\?|\#))(.*?)$/i);
      if (matchQuery) {
        urlObj.query = urlObj.query.substr(0, matchQuery[1].length);
        url = buildUrl(urlObj);
      }
    }
    if (url.length <= truncateLen) {
      return url;
    }
    if (urlObj.host) {
      urlObj.host = urlObj.host.replace(/^www\./, "");
      url = buildUrl(urlObj);
    }
    if (url.length <= truncateLen) {
      return url;
    }
    var str = "";
    if (urlObj.host) {
      str += urlObj.host;
    }
    if (str.length >= availableLength) {
      if (urlObj.host.length == truncateLen) {
        return (urlObj.host.substr(0, truncateLen - ellipsisLength) + ellipsisChars).substr(0, availableLength + ellipsisLengthBeforeParsing);
      }
      return buildSegment(str, availableLength).substr(0, availableLength + ellipsisLengthBeforeParsing);
    }
    var pathAndQuery = "";
    if (urlObj.path) {
      pathAndQuery += "/" + urlObj.path;
    }
    if (urlObj.query) {
      pathAndQuery += "?" + urlObj.query;
    }
    if (pathAndQuery) {
      if ((str + pathAndQuery).length >= availableLength) {
        if ((str + pathAndQuery).length == truncateLen) {
          return (str + pathAndQuery).substr(0, truncateLen);
        }
        var remainingAvailableLength = availableLength - str.length;
        return (str + buildSegment(pathAndQuery, remainingAvailableLength)).substr(0, availableLength + ellipsisLengthBeforeParsing);
      } else {
        str += pathAndQuery;
      }
    }
    if (urlObj.fragment) {
      var fragment = "#" + urlObj.fragment;
      if ((str + fragment).length >= availableLength) {
        if ((str + fragment).length == truncateLen) {
          return (str + fragment).substr(0, truncateLen);
        }
        var remainingAvailableLength2 = availableLength - str.length;
        return (str + buildSegment(fragment, remainingAvailableLength2)).substr(0, availableLength + ellipsisLengthBeforeParsing);
      } else {
        str += fragment;
      }
    }
    if (urlObj.scheme && urlObj.host) {
      var scheme = urlObj.scheme + "://";
      if ((str + scheme).length < availableLength) {
        return (scheme + str).substr(0, truncateLen);
      }
    }
    if (str.length <= truncateLen) {
      return str;
    }
    var end3 = "";
    if (availableLength > 0) {
      end3 = str.substr(-1 * Math.floor(availableLength / 2));
    }
    return (str.substr(0, Math.ceil(availableLength / 2)) + ellipsisChars + end3).substr(0, availableLength + ellipsisLengthBeforeParsing);
  }

  // node_modules/autolinker/dist/es2015/truncate/truncate-middle.js
  function truncateMiddle(url, truncateLen, ellipsisChars) {
    if (url.length <= truncateLen) {
      return url;
    }
    var ellipsisLengthBeforeParsing;
    var ellipsisLength;
    if (ellipsisChars == null) {
      ellipsisChars = "&hellip;";
      ellipsisLengthBeforeParsing = 8;
      ellipsisLength = 3;
    } else {
      ellipsisLengthBeforeParsing = ellipsisChars.length;
      ellipsisLength = ellipsisChars.length;
    }
    var availableLength = truncateLen - ellipsisLength;
    var end3 = "";
    if (availableLength > 0) {
      end3 = url.substr(-1 * Math.floor(availableLength / 2));
    }
    return (url.substr(0, Math.ceil(availableLength / 2)) + ellipsisChars + end3).substr(0, availableLength + ellipsisLengthBeforeParsing);
  }

  // node_modules/autolinker/dist/es2015/truncate/truncate-end.js
  function truncateEnd(anchorText, truncateLen, ellipsisChars) {
    return ellipsis(anchorText, truncateLen, ellipsisChars);
  }

  // node_modules/autolinker/dist/es2015/anchor-tag-builder.js
  var AnchorTagBuilder = function() {
    function AnchorTagBuilder2(cfg) {
      if (cfg === void 0) {
        cfg = {};
      }
      this.newWindow = false;
      this.truncate = {};
      this.className = "";
      this.newWindow = cfg.newWindow || false;
      this.truncate = cfg.truncate || {};
      this.className = cfg.className || "";
    }
    AnchorTagBuilder2.prototype.build = function(match) {
      return new HtmlTag({
        tagName: "a",
        attrs: this.createAttrs(match),
        innerHtml: this.processAnchorText(match.getAnchorText())
      });
    };
    AnchorTagBuilder2.prototype.createAttrs = function(match) {
      var attrs = {
        href: match.getAnchorHref()
        // we'll always have the `href` attribute
      };
      var cssClass = this.createCssClass(match);
      if (cssClass) {
        attrs["class"] = cssClass;
      }
      if (this.newWindow) {
        attrs["target"] = "_blank";
        attrs["rel"] = "noopener noreferrer";
      }
      if (this.truncate) {
        if (this.truncate.length && this.truncate.length < match.getAnchorText().length) {
          attrs["title"] = match.getAnchorHref();
        }
      }
      return attrs;
    };
    AnchorTagBuilder2.prototype.createCssClass = function(match) {
      var className = this.className;
      if (!className) {
        return "";
      } else {
        var returnClasses = [className], cssClassSuffixes = match.getCssClassSuffixes();
        for (var i = 0, len = cssClassSuffixes.length; i < len; i++) {
          returnClasses.push(className + "-" + cssClassSuffixes[i]);
        }
        return returnClasses.join(" ");
      }
    };
    AnchorTagBuilder2.prototype.processAnchorText = function(anchorText) {
      anchorText = this.doTruncate(anchorText);
      return anchorText;
    };
    AnchorTagBuilder2.prototype.doTruncate = function(anchorText) {
      var truncate = this.truncate;
      if (!truncate || !truncate.length)
        return anchorText;
      var truncateLength = truncate.length, truncateLocation = truncate.location;
      if (truncateLocation === "smart") {
        return truncateSmart(anchorText, truncateLength);
      } else if (truncateLocation === "middle") {
        return truncateMiddle(anchorText, truncateLength);
      } else {
        return truncateEnd(anchorText, truncateLength);
      }
    };
    return AnchorTagBuilder2;
  }();

  // node_modules/tslib/tslib.es6.js
  var extendStatics = function(d2, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b2) {
      d3.__proto__ = b2;
    } || function(d3, b2) {
      for (var p2 in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p2))
          d3[p2] = b2[p2];
    };
    return extendStatics(d2, b);
  };
  function __extends(d2, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d2, b);
    function __() {
      this.constructor = d2;
    }
    d2.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var __assign = function() {
    __assign = Object.assign || function __assign2(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p2 in s)
          if (Object.prototype.hasOwnProperty.call(s, p2))
            t[p2] = s[p2];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };

  // node_modules/autolinker/dist/es2015/match/abstract-match.js
  var AbstractMatch = function() {
    function AbstractMatch2(cfg) {
      this._ = null;
      this.matchedText = "";
      this.offset = 0;
      this.tagBuilder = cfg.tagBuilder;
      this.matchedText = cfg.matchedText;
      this.offset = cfg.offset;
    }
    AbstractMatch2.prototype.getMatchedText = function() {
      return this.matchedText;
    };
    AbstractMatch2.prototype.setOffset = function(offset) {
      this.offset = offset;
    };
    AbstractMatch2.prototype.getOffset = function() {
      return this.offset;
    };
    AbstractMatch2.prototype.getCssClassSuffixes = function() {
      return [this.type];
    };
    AbstractMatch2.prototype.buildTag = function() {
      return this.tagBuilder.build(this);
    };
    return AbstractMatch2;
  }();

  // node_modules/autolinker/dist/es2015/parser/tld-regex.js
  var tldRegexStr = "(?:xn--vermgensberatung-pwb|xn--vermgensberater-ctb|xn--clchc0ea0b2g2a9gcd|xn--w4r85el8fhu5dnra|northwesternmutual|travelersinsurance|verm\xF6gensberatung|xn--5su34j936bgsg|xn--bck1b9a5dre4c|xn--mgbah1a3hjkrd|xn--mgbai9azgqp6j|xn--mgberp4a5d4ar|xn--xkc2dl3a5ee0h|verm\xF6gensberater|xn--fzys8d69uvgm|xn--mgba7c0bbn0a|xn--mgbcpq6gpa1a|xn--xkc2al3hye2a|americanexpress|kerryproperties|sandvikcoromant|xn--i1b6b1a6a2e|xn--kcrx77d1x4a|xn--lgbbat1ad8j|xn--mgba3a4f16a|xn--mgbaakc7dvf|xn--mgbc0a9azcg|xn--nqv7fs00ema|americanfamily|bananarepublic|cancerresearch|cookingchannel|kerrylogistics|weatherchannel|xn--54b7fta0cc|xn--6qq986b3xl|xn--80aqecdr1a|xn--b4w605ferd|xn--fiq228c5hs|xn--h2breg3eve|xn--jlq480n2rg|xn--jlq61u9w7b|xn--mgba3a3ejt|xn--mgbaam7a8h|xn--mgbayh7gpa|xn--mgbbh1a71e|xn--mgbca7dzdo|xn--mgbi4ecexp|xn--mgbx4cd0ab|xn--rvc1e0am3e|international|lifeinsurance|travelchannel|wolterskluwer|xn--cckwcxetd|xn--eckvdtc9d|xn--fpcrj9c3d|xn--fzc2c9e2c|xn--h2brj9c8c|xn--tiq49xqyj|xn--yfro4i67o|xn--ygbi2ammx|construction|lplfinancial|scholarships|versicherung|xn--3e0b707e|xn--45br5cyl|xn--4dbrk0ce|xn--80adxhks|xn--80asehdb|xn--8y0a063a|xn--gckr3f0f|xn--mgb9awbf|xn--mgbab2bd|xn--mgbgu82a|xn--mgbpl2fh|xn--mgbt3dhd|xn--mk1bu44c|xn--ngbc5azd|xn--ngbe9e0a|xn--ogbpf8fl|xn--qcka1pmc|accountants|barclaycard|blackfriday|blockbuster|bridgestone|calvinklein|contractors|creditunion|engineering|enterprises|foodnetwork|investments|kerryhotels|lamborghini|motorcycles|olayangroup|photography|playstation|productions|progressive|redumbrella|williamhill|xn--11b4c3d|xn--1ck2e1b|xn--1qqw23a|xn--2scrj9c|xn--3bst00m|xn--3ds443g|xn--3hcrj9c|xn--42c2d9a|xn--45brj9c|xn--55qw42g|xn--6frz82g|xn--80ao21a|xn--9krt00a|xn--cck2b3b|xn--czr694b|xn--d1acj3b|xn--efvy88h|xn--fct429k|xn--fjq720a|xn--flw351e|xn--g2xx48c|xn--gecrj9c|xn--gk3at1e|xn--h2brj9c|xn--hxt814e|xn--imr513n|xn--j6w193g|xn--jvr189m|xn--kprw13d|xn--kpry57d|xn--mgbbh1a|xn--mgbtx2b|xn--mix891f|xn--nyqy26a|xn--otu796d|xn--pgbs0dh|xn--q9jyb4c|xn--rhqv96g|xn--rovu88b|xn--s9brj9c|xn--ses554g|xn--t60b56a|xn--vuq861b|xn--w4rs40l|xn--xhq521b|xn--zfr164b|\u0B9A\u0BBF\u0B99\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0BC2\u0BB0\u0BCD|accountant|apartments|associates|basketball|bnpparibas|boehringer|capitalone|consulting|creditcard|cuisinella|eurovision|extraspace|foundation|healthcare|immobilien|industries|management|mitsubishi|nextdirect|properties|protection|prudential|realestate|republican|restaurant|schaeffler|tatamotors|technology|university|vlaanderen|volkswagen|xn--30rr7y|xn--3pxu8k|xn--45q11c|xn--4gbrim|xn--55qx5d|xn--5tzm5g|xn--80aswg|xn--90a3ac|xn--9dbq2a|xn--9et52u|xn--c2br7g|xn--cg4bki|xn--czrs0t|xn--czru2d|xn--fiq64b|xn--fiqs8s|xn--fiqz9s|xn--io0a7i|xn--kput3i|xn--mxtq1m|xn--o3cw4h|xn--pssy2u|xn--q7ce6a|xn--unup4y|xn--wgbh1c|xn--wgbl6a|xn--y9a3aq|accenture|alfaromeo|allfinanz|amsterdam|analytics|aquarelle|barcelona|bloomberg|christmas|community|directory|education|equipment|fairwinds|financial|firestone|fresenius|frontdoor|furniture|goldpoint|hisamitsu|homedepot|homegoods|homesense|institute|insurance|kuokgroup|lancaster|landrover|lifestyle|marketing|marshalls|melbourne|microsoft|panasonic|passagens|pramerica|richardli|shangrila|solutions|statebank|statefarm|stockholm|travelers|vacations|xn--90ais|xn--c1avg|xn--d1alf|xn--e1a4c|xn--fhbei|xn--j1aef|xn--j1amh|xn--l1acc|xn--ngbrx|xn--nqv7f|xn--p1acf|xn--qxa6a|xn--tckwe|xn--vhquv|yodobashi|\u0645\u0648\u0631\u064A\u062A\u0627\u0646\u064A\u0627|abudhabi|airforce|allstate|attorney|barclays|barefoot|bargains|baseball|boutique|bradesco|broadway|brussels|builders|business|capetown|catering|catholic|cipriani|cityeats|cleaning|clinique|clothing|commbank|computer|delivery|deloitte|democrat|diamonds|discount|discover|download|engineer|ericsson|etisalat|exchange|feedback|fidelity|firmdale|football|frontier|goodyear|grainger|graphics|guardian|hdfcbank|helsinki|holdings|hospital|infiniti|ipiranga|istanbul|jpmorgan|lighting|lundbeck|marriott|maserati|mckinsey|memorial|merckmsd|mortgage|observer|partners|pharmacy|pictures|plumbing|property|redstone|reliance|saarland|samsclub|security|services|shopping|showtime|softbank|software|stcgroup|supplies|training|vanguard|ventures|verisign|woodside|xn--90ae|xn--node|xn--p1ai|xn--qxam|yokohama|\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629|abogado|academy|agakhan|alibaba|android|athleta|auction|audible|auspost|avianca|banamex|bauhaus|bentley|bestbuy|booking|brother|bugatti|capital|caravan|careers|channel|charity|chintai|citadel|clubmed|college|cologne|comcast|company|compare|contact|cooking|corsica|country|coupons|courses|cricket|cruises|dentist|digital|domains|exposed|express|farmers|fashion|ferrari|ferrero|finance|fishing|fitness|flights|florist|flowers|forsale|frogans|fujitsu|gallery|genting|godaddy|grocery|guitars|hamburg|hangout|hitachi|holiday|hosting|hoteles|hotmail|hyundai|ismaili|jewelry|juniper|kitchen|komatsu|lacaixa|lanxess|lasalle|latrobe|leclerc|limited|lincoln|markets|monster|netbank|netflix|network|neustar|okinawa|oldnavy|organic|origins|philips|pioneer|politie|realtor|recipes|rentals|reviews|rexroth|samsung|sandvik|schmidt|schwarz|science|shiksha|singles|staples|storage|support|surgery|systems|temasek|theater|theatre|tickets|tiffany|toshiba|trading|walmart|wanggou|watches|weather|website|wedding|whoswho|windows|winners|xfinity|yamaxun|youtube|zuerich|\u043A\u0430\u0442\u043E\u043B\u0438\u043A|\u0627\u062A\u0635\u0627\u0644\u0627\u062A|\u0627\u0644\u0628\u062D\u0631\u064A\u0646|\u0627\u0644\u062C\u0632\u0627\u0626\u0631|\u0627\u0644\u0639\u0644\u064A\u0627\u0646|\u067E\u0627\u06A9\u0633\u062A\u0627\u0646|\u0643\u0627\u062B\u0648\u0644\u064A\u0643|\u0B87\u0BA8\u0BCD\u0BA4\u0BBF\u0BAF\u0BBE|abarth|abbott|abbvie|africa|agency|airbus|airtel|alipay|alsace|alstom|amazon|anquan|aramco|author|bayern|beauty|berlin|bharti|bostik|boston|broker|camera|career|casino|center|chanel|chrome|church|circle|claims|clinic|coffee|comsec|condos|coupon|credit|cruise|dating|datsun|dealer|degree|dental|design|direct|doctor|dunlop|dupont|durban|emerck|energy|estate|events|expert|family|flickr|futbol|gallup|garden|george|giving|global|google|gratis|health|hermes|hiphop|hockey|hotels|hughes|imamat|insure|intuit|jaguar|joburg|juegos|kaufen|kinder|kindle|kosher|lancia|latino|lawyer|lefrak|living|locker|london|luxury|madrid|maison|makeup|market|mattel|mobile|monash|mormon|moscow|museum|mutual|nagoya|natura|nissan|nissay|norton|nowruz|office|olayan|online|oracle|orange|otsuka|pfizer|photos|physio|pictet|quebec|racing|realty|reisen|repair|report|review|rocher|rogers|ryukyu|safety|sakura|sanofi|school|schule|search|secure|select|shouji|soccer|social|stream|studio|supply|suzuki|swatch|sydney|taipei|taobao|target|tattoo|tennis|tienda|tjmaxx|tkmaxx|toyota|travel|unicom|viajes|viking|villas|virgin|vision|voting|voyage|vuelos|walter|webcam|xihuan|yachts|yandex|zappos|\u043C\u043E\u0441\u043A\u0432\u0430|\u043E\u043D\u043B\u0430\u0439\u043D|\u0627\u0628\u0648\u0638\u0628\u064A|\u0627\u0631\u0627\u0645\u0643\u0648|\u0627\u0644\u0627\u0631\u062F\u0646|\u0627\u0644\u0645\u063A\u0631\u0628|\u0627\u0645\u0627\u0631\u0627\u062A|\u0641\u0644\u0633\u0637\u064A\u0646|\u0645\u0644\u064A\u0633\u064A\u0627|\u092D\u093E\u0930\u0924\u092E\u094D|\u0B87\u0BB2\u0B99\u0BCD\u0B95\u0BC8|\u30D5\u30A1\u30C3\u30B7\u30E7\u30F3|actor|adult|aetna|amfam|amica|apple|archi|audio|autos|azure|baidu|beats|bible|bingo|black|boats|bosch|build|canon|cards|chase|cheap|cisco|citic|click|cloud|coach|codes|crown|cymru|dabur|dance|deals|delta|drive|dubai|earth|edeka|email|epson|faith|fedex|final|forex|forum|gallo|games|gifts|gives|glass|globo|gmail|green|gripe|group|gucci|guide|homes|honda|horse|house|hyatt|ikano|irish|jetzt|koeln|kyoto|lamer|lease|legal|lexus|lilly|linde|lipsy|loans|locus|lotte|lotto|macys|mango|media|miami|money|movie|music|nexus|nikon|ninja|nokia|nowtv|omega|osaka|paris|parts|party|phone|photo|pizza|place|poker|praxi|press|prime|promo|quest|radio|rehab|reise|ricoh|rocks|rodeo|rugby|salon|sener|seven|sharp|shell|shoes|skype|sling|smart|smile|solar|space|sport|stada|store|study|style|sucks|swiss|tatar|tires|tirol|tmall|today|tokyo|tools|toray|total|tours|trade|trust|tunes|tushu|ubank|vegas|video|vodka|volvo|wales|watch|weber|weibo|works|world|xerox|yahoo|\u05D9\u05E9\u05E8\u05D0\u05DC|\u0627\u06CC\u0631\u0627\u0646|\u0628\u0627\u0632\u0627\u0631|\u0628\u06BE\u0627\u0631\u062A|\u0633\u0648\u062F\u0627\u0646|\u0633\u0648\u0631\u064A\u0629|\u0647\u0645\u0631\u0627\u0647|\u092D\u093E\u0930\u094B\u0924|\u0938\u0902\u0917\u0920\u0928|\u09AC\u09BE\u0982\u09B2\u09BE|\u0C2D\u0C3E\u0C30\u0C24\u0C4D|\u0D2D\u0D3E\u0D30\u0D24\u0D02|\u5609\u91CC\u5927\u9152\u5E97|aarp|able|adac|aero|akdn|ally|amex|arab|army|arpa|arte|asda|asia|audi|auto|baby|band|bank|bbva|beer|best|bike|bing|blog|blue|bofa|bond|book|buzz|cafe|call|camp|care|cars|casa|case|cash|cbre|cern|chat|citi|city|club|cool|coop|cyou|data|date|dclk|deal|dell|desi|diet|dish|docs|dvag|erni|fage|fail|fans|farm|fast|fiat|fido|film|fire|fish|flir|food|ford|free|fund|game|gbiz|gent|ggee|gift|gmbh|gold|golf|goog|guge|guru|hair|haus|hdfc|help|here|hgtv|host|hsbc|icbc|ieee|imdb|immo|info|itau|java|jeep|jobs|jprs|kddi|kids|kiwi|kpmg|kred|land|lego|lgbt|lidl|life|like|limo|link|live|loan|loft|love|ltda|luxe|maif|meet|meme|menu|mini|mint|mobi|moda|moto|name|navy|news|next|nico|nike|ollo|open|page|pars|pccw|pics|ping|pink|play|plus|pohl|porn|post|prod|prof|qpon|read|reit|rent|rest|rich|room|rsvp|ruhr|safe|sale|sarl|save|saxo|scot|seat|seek|sexy|shaw|shia|shop|show|silk|sina|site|skin|sncf|sohu|song|sony|spot|star|surf|talk|taxi|team|tech|teva|tiaa|tips|town|toys|tube|vana|visa|viva|vivo|vote|voto|wang|weir|wien|wiki|wine|work|xbox|yoga|zara|zero|zone|\u0434\u0435\u0442\u0438|\u0441\u0430\u0439\u0442|\u0628\u0627\u0631\u062A|\u0628\u064A\u062A\u0643|\u0680\u0627\u0631\u062A|\u062A\u0648\u0646\u0633|\u0634\u0628\u0643\u0629|\u0639\u0631\u0627\u0642|\u0639\u0645\u0627\u0646|\u0645\u0648\u0642\u0639|\u092D\u093E\u0930\u0924|\u09AD\u09BE\u09B0\u09A4|\u09AD\u09BE\u09F0\u09A4|\u0A2D\u0A3E\u0A30\u0A24|\u0AAD\u0ABE\u0AB0\u0AA4|\u0B2D\u0B3E\u0B30\u0B24|\u0CAD\u0CBE\u0CB0\u0CA4|\u0DBD\u0D82\u0D9A\u0DCF|\u30A2\u30DE\u30BE\u30F3|\u30B0\u30FC\u30B0\u30EB|\u30AF\u30E9\u30A6\u30C9|\u30DD\u30A4\u30F3\u30C8|\u7EC4\u7EC7\u673A\u6784|\u96FB\u8A0A\u76C8\u79D1|\u9999\u683C\u91CC\u62C9|aaa|abb|abc|aco|ads|aeg|afl|aig|anz|aol|app|art|aws|axa|bar|bbc|bbt|bcg|bcn|bet|bid|bio|biz|bms|bmw|bom|boo|bot|box|buy|bzh|cab|cal|cam|car|cat|cba|cbn|cbs|ceo|cfa|cfd|com|cpa|crs|dad|day|dds|dev|dhl|diy|dnp|dog|dot|dtv|dvr|eat|eco|edu|esq|eus|fan|fit|fly|foo|fox|frl|ftr|fun|fyi|gal|gap|gay|gdn|gea|gle|gmo|gmx|goo|gop|got|gov|hbo|hiv|hkt|hot|how|ibm|ice|icu|ifm|inc|ing|ink|int|ist|itv|jcb|jio|jll|jmp|jnj|jot|joy|kfh|kia|kim|kpn|krd|lat|law|lds|llc|llp|lol|lpl|ltd|man|map|mba|med|men|mil|mit|mlb|mls|mma|moe|moi|mom|mov|msd|mtn|mtr|nab|nba|nec|net|new|nfl|ngo|nhk|now|nra|nrw|ntt|nyc|obi|one|ong|onl|ooo|org|ott|ovh|pay|pet|phd|pid|pin|pnc|pro|pru|pub|pwc|red|ren|ril|rio|rip|run|rwe|sap|sas|sbi|sbs|sca|scb|ses|sew|sex|sfr|ski|sky|soy|spa|srl|stc|tab|tax|tci|tdk|tel|thd|tjx|top|trv|tui|tvs|ubs|uno|uol|ups|vet|vig|vin|vip|wed|win|wme|wow|wtc|wtf|xin|xxx|xyz|you|yun|zip|\u0431\u0435\u043B|\u043A\u043E\u043C|\u049B\u0430\u0437|\u043C\u043A\u0434|\u043C\u043E\u043D|\u043E\u0440\u0433|\u0440\u0443\u0441|\u0441\u0440\u0431|\u0443\u043A\u0440|\u0570\u0561\u0575|\u05E7\u05D5\u05DD|\u0639\u0631\u0628|\u0642\u0637\u0631|\u0643\u0648\u0645|\u0645\u0635\u0631|\u0915\u0949\u092E|\u0928\u0947\u091F|\u0E04\u0E2D\u0E21|\u0E44\u0E17\u0E22|\u0EA5\u0EB2\u0EA7|\u30B9\u30C8\u30A2|\u30BB\u30FC\u30EB|\u307F\u3093\u306A|\u4E2D\u6587\u7F51|\u4E9A\u9A6C\u900A|\u5929\u4E3B\u6559|\u6211\u7231\u4F60|\u65B0\u52A0\u5761|\u6DE1\u9A6C\u9521|\u8BFA\u57FA\u4E9A|\u98DE\u5229\u6D66|ac|ad|ae|af|ag|ai|al|am|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cw|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw|\u03B5\u03BB|\u03B5\u03C5|\u0431\u0433|\u0435\u044E|\u0440\u0444|\u10D2\u10D4|\uB2F7\uB137|\uB2F7\uCEF4|\uC0BC\uC131|\uD55C\uAD6D|\u30B3\u30E0|\u4E16\u754C|\u4E2D\u4FE1|\u4E2D\u56FD|\u4E2D\u570B|\u4F01\u4E1A|\u4F5B\u5C71|\u4FE1\u606F|\u5065\u5EB7|\u516B\u5366|\u516C\u53F8|\u516C\u76CA|\u53F0\u6E7E|\u53F0\u7063|\u5546\u57CE|\u5546\u5E97|\u5546\u6807|\u5609\u91CC|\u5728\u7EBF|\u5927\u62FF|\u5A31\u4E50|\u5BB6\u96FB|\u5E7F\u4E1C|\u5FAE\u535A|\u6148\u5584|\u624B\u673A|\u62DB\u8058|\u653F\u52A1|\u653F\u5E9C|\u65B0\u95FB|\u65F6\u5C1A|\u66F8\u7C4D|\u673A\u6784|\u6E38\u620F|\u6FB3\u9580|\u70B9\u770B|\u79FB\u52A8|\u7F51\u5740|\u7F51\u5E97|\u7F51\u7AD9|\u7F51\u7EDC|\u8054\u901A|\u8C37\u6B4C|\u8D2D\u7269|\u901A\u8CA9|\u96C6\u56E2|\u98DF\u54C1|\u9910\u5385|\u9999\u6E2F)";
  var tldRegex = new RegExp("^" + tldRegexStr + "$");

  // node_modules/autolinker/dist/es2015/parser/uri-utils.js
  var urlSuffixStartCharsRe = /[\/?#]/;
  var urlSuffixAllowedSpecialCharsRe = /[-+&@#/%=~_()|'$*\[\]{}\u2713]/;
  var urlSuffixNotAllowedAsLastCharRe = /[?!:,.;^]/;
  var httpSchemeRe = /https?:\/\//i;
  var httpSchemePrefixRe = new RegExp("^" + httpSchemeRe.source, "i");
  var urlSuffixedCharsNotAllowedAtEndRe = new RegExp(urlSuffixNotAllowedAsLastCharRe.source + "$");
  var invalidSchemeRe = /^(javascript|vbscript):/i;
  var schemeUrlRe = /^[A-Za-z][-.+A-Za-z0-9]*:(\/\/)?([^:/]*)/;
  var tldUrlHostRe = /^(?:\/\/)?([^/#?:]+)/;
  function isSchemeStartChar(char) {
    return letterRe.test(char);
  }
  function isSchemeChar(char) {
    return letterRe.test(char) || digitRe.test(char) || char === "+" || char === "-" || char === ".";
  }
  function isDomainLabelStartChar(char) {
    return alphaNumericAndMarksRe.test(char);
  }
  function isDomainLabelChar(char) {
    return char === "_" || isDomainLabelStartChar(char);
  }
  function isPathChar(char) {
    return alphaNumericAndMarksRe.test(char) || urlSuffixAllowedSpecialCharsRe.test(char) || urlSuffixNotAllowedAsLastCharRe.test(char);
  }
  function isUrlSuffixStartChar(char) {
    return urlSuffixStartCharsRe.test(char);
  }
  function isKnownTld(tld) {
    return tldRegex.test(tld.toLowerCase());
  }
  function isValidSchemeUrl(url) {
    if (invalidSchemeRe.test(url)) {
      return false;
    }
    var schemeMatch = url.match(schemeUrlRe);
    if (!schemeMatch) {
      return false;
    }
    var isAuthorityMatch = !!schemeMatch[1];
    var host = schemeMatch[2];
    if (isAuthorityMatch) {
      return true;
    }
    if (host.indexOf(".") === -1 || !letterRe.test(host)) {
      return false;
    }
    return true;
  }
  function isValidTldMatch(url) {
    var tldUrlHostMatch = url.match(tldUrlHostRe);
    if (!tldUrlHostMatch) {
      return false;
    }
    var host = tldUrlHostMatch[0];
    var hostLabels = host.split(".");
    if (hostLabels.length < 2) {
      return false;
    }
    var tld = hostLabels[hostLabels.length - 1];
    if (!isKnownTld(tld)) {
      return false;
    }
    return true;
  }
  var ipV4Re = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  var ipV4PartRe = /[:/?#]/;
  function isValidIpV4Address(url) {
    var ipV4Part = url.split(ipV4PartRe, 1)[0];
    return ipV4Re.test(ipV4Part);
  }

  // node_modules/autolinker/dist/es2015/match/url-match.js
  var wwwPrefixRegex = /^(https?:\/\/)?(www\.)?/i;
  var protocolRelativeRegex = /^\/\//;
  var UrlMatch = function(_super) {
    __extends(UrlMatch2, _super);
    function UrlMatch2(cfg) {
      var _this = _super.call(this, cfg) || this;
      _this.type = "url";
      _this.url = "";
      _this.urlMatchType = "scheme";
      _this.protocolRelativeMatch = false;
      _this.stripPrefix = {
        scheme: true,
        www: true
      };
      _this.stripTrailingSlash = true;
      _this.decodePercentEncoding = true;
      _this.protocolPrepended = false;
      _this.urlMatchType = cfg.urlMatchType;
      _this.url = cfg.url;
      _this.protocolRelativeMatch = cfg.protocolRelativeMatch;
      _this.stripPrefix = cfg.stripPrefix;
      _this.stripTrailingSlash = cfg.stripTrailingSlash;
      _this.decodePercentEncoding = cfg.decodePercentEncoding;
      return _this;
    }
    UrlMatch2.prototype.getType = function() {
      return "url";
    };
    UrlMatch2.prototype.getUrlMatchType = function() {
      return this.urlMatchType;
    };
    UrlMatch2.prototype.getUrl = function() {
      var url = this.url;
      if (!this.protocolRelativeMatch && this.urlMatchType !== "scheme" && !this.protocolPrepended) {
        url = this.url = "http://" + url;
        this.protocolPrepended = true;
      }
      return url;
    };
    UrlMatch2.prototype.getAnchorHref = function() {
      var url = this.getUrl();
      return url.replace(/&amp;/g, "&");
    };
    UrlMatch2.prototype.getAnchorText = function() {
      var anchorText = this.getMatchedText();
      if (this.protocolRelativeMatch) {
        anchorText = stripProtocolRelativePrefix(anchorText);
      }
      if (this.stripPrefix.scheme) {
        anchorText = stripSchemePrefix(anchorText);
      }
      if (this.stripPrefix.www) {
        anchorText = stripWwwPrefix(anchorText);
      }
      if (this.stripTrailingSlash) {
        anchorText = removeTrailingSlash(anchorText);
      }
      if (this.decodePercentEncoding) {
        anchorText = removePercentEncoding(anchorText);
      }
      return anchorText;
    };
    return UrlMatch2;
  }(AbstractMatch);
  function stripSchemePrefix(url) {
    return url.replace(httpSchemePrefixRe, "");
  }
  function stripWwwPrefix(url) {
    return url.replace(wwwPrefixRegex, "$1");
  }
  function stripProtocolRelativePrefix(text2) {
    return text2.replace(protocolRelativeRegex, "");
  }
  function removeTrailingSlash(anchorText) {
    if (anchorText.charAt(anchorText.length - 1) === "/") {
      anchorText = anchorText.slice(0, -1);
    }
    return anchorText;
  }
  function removePercentEncoding(anchorText) {
    var preProcessedEntityAnchorText = anchorText.replace(/%22/gi, "&quot;").replace(/%26/gi, "&amp;").replace(/%27/gi, "&#39;").replace(/%3C/gi, "&lt;").replace(/%3E/gi, "&gt;");
    try {
      return decodeURIComponent(preProcessedEntityAnchorText);
    } catch (e) {
      return preProcessedEntityAnchorText;
    }
  }

  // node_modules/autolinker/dist/es2015/parser/email-utils.js
  var mailtoSchemePrefixRe = /^mailto:/i;
  var emailLocalPartCharRegex = new RegExp("[".concat(alphaNumericAndMarksCharsStr, "!#$%&'*+/=?^_`{|}~-]"));
  function isEmailLocalPartStartChar(char) {
    return alphaNumericAndMarksRe.test(char);
  }
  function isEmailLocalPartChar(char) {
    return emailLocalPartCharRegex.test(char);
  }
  function isValidEmail(emailAddress) {
    var emailAddressTld = emailAddress.split(".").pop() || "";
    return isKnownTld(emailAddressTld);
  }

  // node_modules/autolinker/dist/es2015/match/email-match.js
  var EmailMatch = function(_super) {
    __extends(EmailMatch2, _super);
    function EmailMatch2(cfg) {
      var _this = _super.call(this, cfg) || this;
      _this.type = "email";
      _this.email = "";
      _this.email = cfg.email;
      return _this;
    }
    EmailMatch2.prototype.getType = function() {
      return "email";
    };
    EmailMatch2.prototype.getEmail = function() {
      return this.email;
    };
    EmailMatch2.prototype.getAnchorHref = function() {
      return "mailto:" + this.email;
    };
    EmailMatch2.prototype.getAnchorText = function() {
      return this.email;
    };
    return EmailMatch2;
  }(AbstractMatch);

  // node_modules/autolinker/dist/es2015/parser/hashtag-utils.js
  function isHashtagTextChar(char) {
    return char === "_" || alphaNumericAndMarksRe.test(char);
  }
  function isValidHashtag(hashtag) {
    return hashtag.length <= 140;
  }
  var hashtagServices = ["twitter", "facebook", "instagram", "tiktok"];

  // node_modules/autolinker/dist/es2015/match/hashtag-match.js
  var HashtagMatch = function(_super) {
    __extends(HashtagMatch2, _super);
    function HashtagMatch2(cfg) {
      var _this = _super.call(this, cfg) || this;
      _this.type = "hashtag";
      _this.serviceName = "twitter";
      _this.hashtag = "";
      _this.serviceName = cfg.serviceName;
      _this.hashtag = cfg.hashtag;
      return _this;
    }
    HashtagMatch2.prototype.getType = function() {
      return "hashtag";
    };
    HashtagMatch2.prototype.getServiceName = function() {
      return this.serviceName;
    };
    HashtagMatch2.prototype.getHashtag = function() {
      return this.hashtag;
    };
    HashtagMatch2.prototype.getAnchorHref = function() {
      var serviceName = this.serviceName, hashtag = this.hashtag;
      switch (serviceName) {
        case "twitter":
          return "https://twitter.com/hashtag/" + hashtag;
        case "facebook":
          return "https://www.facebook.com/hashtag/" + hashtag;
        case "instagram":
          return "https://instagram.com/explore/tags/" + hashtag;
        case "tiktok":
          return "https://www.tiktok.com/tag/" + hashtag;
        default:
          assertNever(serviceName);
          throw new Error("Invalid hashtag service: ".concat(serviceName));
      }
    };
    HashtagMatch2.prototype.getAnchorText = function() {
      return "#" + this.hashtag;
    };
    HashtagMatch2.prototype.getCssClassSuffixes = function() {
      var cssClassSuffixes = _super.prototype.getCssClassSuffixes.call(this), serviceName = this.getServiceName();
      if (serviceName) {
        cssClassSuffixes.push(serviceName);
      }
      return cssClassSuffixes;
    };
    return HashtagMatch2;
  }(AbstractMatch);

  // node_modules/autolinker/dist/es2015/parser/mention-utils.js
  var mentionRegexes = {
    twitter: /^@\w{1,15}$/,
    instagram: /^@[_\w]{1,30}$/,
    soundcloud: /^@[-a-z0-9_]{3,25}$/,
    // TikTok usernames are 1-24 characters containing letters, numbers, underscores
    // and periods, but cannot end in a period: https://support.tiktok.com/en/getting-started/setting-up-your-profile/changing-your-username
    tiktok: /^@[.\w]{1,23}[\w]$/
  };
  var mentionTextCharRe = /[-\w.]/;
  function isMentionTextChar(char) {
    return mentionTextCharRe.test(char);
  }
  function isValidMention(mention, serviceName) {
    var re = mentionRegexes[serviceName];
    return re.test(mention);
  }
  var mentionServices = ["twitter", "instagram", "soundcloud", "tiktok"];

  // node_modules/autolinker/dist/es2015/match/mention-match.js
  var MentionMatch = function(_super) {
    __extends(MentionMatch2, _super);
    function MentionMatch2(cfg) {
      var _this = _super.call(this, cfg) || this;
      _this.type = "mention";
      _this.serviceName = "twitter";
      _this.mention = "";
      _this.mention = cfg.mention;
      _this.serviceName = cfg.serviceName;
      return _this;
    }
    MentionMatch2.prototype.getType = function() {
      return "mention";
    };
    MentionMatch2.prototype.getMention = function() {
      return this.mention;
    };
    MentionMatch2.prototype.getServiceName = function() {
      return this.serviceName;
    };
    MentionMatch2.prototype.getAnchorHref = function() {
      switch (this.serviceName) {
        case "twitter":
          return "https://twitter.com/" + this.mention;
        case "instagram":
          return "https://instagram.com/" + this.mention;
        case "soundcloud":
          return "https://soundcloud.com/" + this.mention;
        case "tiktok":
          return "https://www.tiktok.com/@" + this.mention;
        default:
          throw new Error("Unknown service name to point mention to: " + this.serviceName);
      }
    };
    MentionMatch2.prototype.getAnchorText = function() {
      return "@" + this.mention;
    };
    MentionMatch2.prototype.getCssClassSuffixes = function() {
      var cssClassSuffixes = _super.prototype.getCssClassSuffixes.call(this), serviceName = this.getServiceName();
      if (serviceName) {
        cssClassSuffixes.push(serviceName);
      }
      return cssClassSuffixes;
    };
    return MentionMatch2;
  }(AbstractMatch);

  // node_modules/autolinker/dist/es2015/parser/phone-number-utils.js
  var separatorCharRe = /[-. ]/;
  var hasDelimCharsRe = /[-. ()]/;
  var controlCharRe = /[,;]/;
  var mostPhoneNumbers = /(?:(?:(?:(\+)?\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4})|(?:(\+)(?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)[-. ]?(?:\d[-. ]?){6,12}\d+))([,;]+[0-9]+#?)*/;
  var japanesePhoneRe = /(0([1-9]-?[1-9]\d{3}|[1-9]{2}-?\d{3}|[1-9]{2}\d{1}-?\d{2}|[1-9]{2}\d{2}-?\d{1})-?\d{4}|0[789]0-?\d{4}-?\d{4}|050-?\d{4}-?\d{4})/;
  var validPhoneNumberRe = new RegExp("^".concat(mostPhoneNumbers.source, "|").concat(japanesePhoneRe.source, "$"));
  function isPhoneNumberSeparatorChar(char) {
    return separatorCharRe.test(char);
  }
  function isPhoneNumberControlChar(char) {
    return controlCharRe.test(char);
  }
  function isValidPhoneNumber(phoneNumberText) {
    var hasDelimiters = phoneNumberText.charAt(0) === "+" || hasDelimCharsRe.test(phoneNumberText);
    return hasDelimiters && validPhoneNumberRe.test(phoneNumberText);
  }

  // node_modules/autolinker/dist/es2015/match/phone-match.js
  var PhoneMatch = function(_super) {
    __extends(PhoneMatch2, _super);
    function PhoneMatch2(cfg) {
      var _this = _super.call(this, cfg) || this;
      _this.type = "phone";
      _this.number = "";
      _this.plusSign = false;
      _this.number = cfg.number;
      _this.plusSign = cfg.plusSign;
      return _this;
    }
    PhoneMatch2.prototype.getType = function() {
      return "phone";
    };
    PhoneMatch2.prototype.getPhoneNumber = function() {
      return this.number;
    };
    PhoneMatch2.prototype.getNumber = function() {
      return this.getPhoneNumber();
    };
    PhoneMatch2.prototype.getAnchorHref = function() {
      return "tel:" + (this.plusSign ? "+" : "") + this.number;
    };
    PhoneMatch2.prototype.getAnchorText = function() {
      return this.matchedText;
    };
    return PhoneMatch2;
  }(AbstractMatch);

  // node_modules/autolinker/dist/es2015/parser/parse-matches.js
  function parseMatches(text2, args) {
    var tagBuilder = args.tagBuilder;
    var stripPrefix = args.stripPrefix;
    var stripTrailingSlash = args.stripTrailingSlash;
    var decodePercentEncoding = args.decodePercentEncoding;
    var hashtagServiceName = args.hashtagServiceName;
    var mentionServiceName = args.mentionServiceName;
    var matches = [];
    var textLen = text2.length;
    var stateMachines = [];
    var charIdx = 0;
    for (; charIdx < textLen; charIdx++) {
      var char = text2.charAt(charIdx);
      if (stateMachines.length === 0) {
        stateNoMatch(char);
      } else {
        for (var stateIdx = stateMachines.length - 1; stateIdx >= 0; stateIdx--) {
          var stateMachine = stateMachines[stateIdx];
          switch (stateMachine.state) {
            case 11:
              stateProtocolRelativeSlash1(stateMachine, char);
              break;
            case 12:
              stateProtocolRelativeSlash2(stateMachine, char);
              break;
            case 0:
              stateSchemeChar(stateMachine, char);
              break;
            case 1:
              stateSchemeHyphen(stateMachine, char);
              break;
            case 2:
              stateSchemeColon(stateMachine, char);
              break;
            case 3:
              stateSchemeSlash1(stateMachine, char);
              break;
            case 4:
              stateSchemeSlash2(stateMachine, char);
              break;
            case 5:
              stateDomainLabelChar(stateMachine, char);
              break;
            case 6:
              stateDomainHyphen(stateMachine, char);
              break;
            case 7:
              stateDomainDot(stateMachine, char);
              break;
            case 13:
              stateIpV4Digit(stateMachine, char);
              break;
            case 14:
              stateIPv4Dot(stateMachine, char);
              break;
            case 8:
              statePortColon(stateMachine, char);
              break;
            case 9:
              statePortNumber(stateMachine, char);
              break;
            case 10:
              statePath(stateMachine, char);
              break;
            case 15:
              stateEmailMailto_M(stateMachine, char);
              break;
            case 16:
              stateEmailMailto_A(stateMachine, char);
              break;
            case 17:
              stateEmailMailto_I(stateMachine, char);
              break;
            case 18:
              stateEmailMailto_L(stateMachine, char);
              break;
            case 19:
              stateEmailMailto_T(stateMachine, char);
              break;
            case 20:
              stateEmailMailto_O(stateMachine, char);
              break;
            case 21:
              stateEmailMailtoColon(stateMachine, char);
              break;
            case 22:
              stateEmailLocalPart(stateMachine, char);
              break;
            case 23:
              stateEmailLocalPartDot(stateMachine, char);
              break;
            case 24:
              stateEmailAtSign(stateMachine, char);
              break;
            case 25:
              stateEmailDomainChar(stateMachine, char);
              break;
            case 26:
              stateEmailDomainHyphen(stateMachine, char);
              break;
            case 27:
              stateEmailDomainDot(stateMachine, char);
              break;
            case 28:
              stateHashtagHashChar(stateMachine, char);
              break;
            case 29:
              stateHashtagTextChar(stateMachine, char);
              break;
            case 30:
              stateMentionAtChar(stateMachine, char);
              break;
            case 31:
              stateMentionTextChar(stateMachine, char);
              break;
            case 32:
              statePhoneNumberOpenParen(stateMachine, char);
              break;
            case 33:
              statePhoneNumberAreaCodeDigit1(stateMachine, char);
              break;
            case 34:
              statePhoneNumberAreaCodeDigit2(stateMachine, char);
              break;
            case 35:
              statePhoneNumberAreaCodeDigit3(stateMachine, char);
              break;
            case 36:
              statePhoneNumberCloseParen(stateMachine, char);
              break;
            case 37:
              statePhoneNumberPlus(stateMachine, char);
              break;
            case 38:
              statePhoneNumberDigit(stateMachine, char);
              break;
            case 39:
              statePhoneNumberSeparator(stateMachine, char);
              break;
            case 40:
              statePhoneNumberControlChar(stateMachine, char);
              break;
            case 41:
              statePhoneNumberPoundChar(stateMachine, char);
              break;
            default:
              assertNever(stateMachine.state);
          }
        }
      }
    }
    for (var i = stateMachines.length - 1; i >= 0; i--) {
      stateMachines.forEach(function(stateMachine2) {
        return captureMatchIfValidAndRemove(stateMachine2);
      });
    }
    return matches;
    function stateNoMatch(char2) {
      if (char2 === "#") {
        stateMachines.push(createHashtagStateMachine(
          charIdx,
          28
          /* HashtagHashChar */
        ));
      } else if (char2 === "@") {
        stateMachines.push(createMentionStateMachine(
          charIdx,
          30
          /* MentionAtChar */
        ));
      } else if (char2 === "/") {
        stateMachines.push(createTldUrlStateMachine(
          charIdx,
          11
          /* ProtocolRelativeSlash1 */
        ));
      } else if (char2 === "+") {
        stateMachines.push(createPhoneNumberStateMachine(
          charIdx,
          37
          /* PhoneNumberPlus */
        ));
      } else if (char2 === "(") {
        stateMachines.push(createPhoneNumberStateMachine(
          charIdx,
          32
          /* PhoneNumberOpenParen */
        ));
      } else {
        if (digitRe.test(char2)) {
          stateMachines.push(createPhoneNumberStateMachine(
            charIdx,
            38
            /* PhoneNumberDigit */
          ));
          stateMachines.push(createIpV4UrlStateMachine(
            charIdx,
            13
            /* IpV4Digit */
          ));
        }
        if (isEmailLocalPartStartChar(char2)) {
          var startState = char2.toLowerCase() === "m" ? 15 : 22;
          stateMachines.push(createEmailStateMachine(charIdx, startState));
        }
        if (isSchemeStartChar(char2)) {
          stateMachines.push(createSchemeUrlStateMachine(
            charIdx,
            0
            /* SchemeChar */
          ));
        }
        if (alphaNumericAndMarksRe.test(char2)) {
          stateMachines.push(createTldUrlStateMachine(
            charIdx,
            5
            /* DomainLabelChar */
          ));
        }
      }
    }
    function stateSchemeChar(stateMachine2, char2) {
      if (char2 === ":") {
        stateMachine2.state = 2;
      } else if (char2 === "-") {
        stateMachine2.state = 1;
      } else if (isSchemeChar(char2)) {
      } else {
        remove(stateMachines, stateMachine2);
      }
    }
    function stateSchemeHyphen(stateMachine2, char2) {
      if (char2 === "-") {
      } else if (char2 === "/") {
        remove(stateMachines, stateMachine2);
        stateMachines.push(createTldUrlStateMachine(
          charIdx,
          11
          /* ProtocolRelativeSlash1 */
        ));
      } else if (isSchemeChar(char2)) {
        stateMachine2.state = 0;
      } else {
        remove(stateMachines, stateMachine2);
      }
    }
    function stateSchemeColon(stateMachine2, char2) {
      if (char2 === "/") {
        stateMachine2.state = 3;
      } else if (char2 === ".") {
        remove(stateMachines, stateMachine2);
      } else if (isDomainLabelStartChar(char2)) {
        stateMachine2.state = 5;
        if (isSchemeStartChar(char2)) {
          stateMachines.push(createSchemeUrlStateMachine(
            charIdx,
            0
            /* SchemeChar */
          ));
        }
      } else {
        remove(stateMachines, stateMachine2);
      }
    }
    function stateSchemeSlash1(stateMachine2, char2) {
      if (char2 === "/") {
        stateMachine2.state = 4;
      } else if (isPathChar(char2)) {
        stateMachine2.state = 10;
        stateMachine2.acceptStateReached = true;
      } else {
        captureMatchIfValidAndRemove(stateMachine2);
      }
    }
    function stateSchemeSlash2(stateMachine2, char2) {
      if (char2 === "/") {
        stateMachine2.state = 10;
      } else if (isDomainLabelStartChar(char2)) {
        stateMachine2.state = 5;
        stateMachine2.acceptStateReached = true;
      } else {
        remove(stateMachines, stateMachine2);
      }
    }
    function stateProtocolRelativeSlash1(stateMachine2, char2) {
      if (char2 === "/") {
        stateMachine2.state = 12;
      } else {
        remove(stateMachines, stateMachine2);
      }
    }
    function stateProtocolRelativeSlash2(stateMachine2, char2) {
      if (isDomainLabelStartChar(char2)) {
        stateMachine2.state = 5;
      } else {
        remove(stateMachines, stateMachine2);
      }
    }
    function stateDomainLabelChar(stateMachine2, char2) {
      if (char2 === ".") {
        stateMachine2.state = 7;
      } else if (char2 === "-") {
        stateMachine2.state = 6;
      } else if (char2 === ":") {
        stateMachine2.state = 8;
      } else if (isUrlSuffixStartChar(char2)) {
        stateMachine2.state = 10;
      } else if (isDomainLabelChar(char2)) {
      } else {
        captureMatchIfValidAndRemove(stateMachine2);
      }
    }
    function stateDomainHyphen(stateMachine2, char2) {
      if (char2 === "-") {
      } else if (char2 === ".") {
        captureMatchIfValidAndRemove(stateMachine2);
      } else if (isDomainLabelStartChar(char2)) {
        stateMachine2.state = 5;
      } else {
        captureMatchIfValidAndRemove(stateMachine2);
      }
    }
    function stateDomainDot(stateMachine2, char2) {
      if (char2 === ".") {
        captureMatchIfValidAndRemove(stateMachine2);
      } else if (isDomainLabelStartChar(char2)) {
        stateMachine2.state = 5;
        stateMachine2.acceptStateReached = true;
      } else {
        captureMatchIfValidAndRemove(stateMachine2);
      }
    }
    function stateIpV4Digit(stateMachine2, char2) {
      if (char2 === ".") {
        stateMachine2.state = 14;
      } else if (char2 === ":") {
        stateMachine2.state = 8;
      } else if (digitRe.test(char2)) {
      } else if (isUrlSuffixStartChar(char2)) {
        stateMachine2.state = 10;
      } else if (alphaNumericAndMarksRe.test(char2)) {
        remove(stateMachines, stateMachine2);
      } else {
        captureMatchIfValidAndRemove(stateMachine2);
      }
    }
    function stateIPv4Dot(stateMachine2, char2) {
      if (digitRe.test(char2)) {
        stateMachine2.octetsEncountered++;
        if (stateMachine2.octetsEncountered === 4) {
          stateMachine2.acceptStateReached = true;
        }
        stateMachine2.state = 13;
      } else {
        captureMatchIfValidAndRemove(stateMachine2);
      }
    }
    function statePortColon(stateMachine2, char2) {
      if (digitRe.test(char2)) {
        stateMachine2.state = 9;
      } else {
        captureMatchIfValidAndRemove(stateMachine2);
      }
    }
    function statePortNumber(stateMachine2, char2) {
      if (digitRe.test(char2)) {
      } else if (isUrlSuffixStartChar(char2)) {
        stateMachine2.state = 10;
      } else {
        captureMatchIfValidAndRemove(stateMachine2);
      }
    }
    function statePath(stateMachine2, char2) {
      if (isPathChar(char2)) {
      } else {
        captureMatchIfValidAndRemove(stateMachine2);
      }
    }
    function stateEmailMailto_M(stateMachine2, char2) {
      if (char2.toLowerCase() === "a") {
        stateMachine2.state = 16;
      } else {
        stateEmailLocalPart(stateMachine2, char2);
      }
    }
    function stateEmailMailto_A(stateMachine2, char2) {
      if (char2.toLowerCase() === "i") {
        stateMachine2.state = 17;
      } else {
        stateEmailLocalPart(stateMachine2, char2);
      }
    }
    function stateEmailMailto_I(stateMachine2, char2) {
      if (char2.toLowerCase() === "l") {
        stateMachine2.state = 18;
      } else {
        stateEmailLocalPart(stateMachine2, char2);
      }
    }
    function stateEmailMailto_L(stateMachine2, char2) {
      if (char2.toLowerCase() === "t") {
        stateMachine2.state = 19;
      } else {
        stateEmailLocalPart(stateMachine2, char2);
      }
    }
    function stateEmailMailto_T(stateMachine2, char2) {
      if (char2.toLowerCase() === "o") {
        stateMachine2.state = 20;
      } else {
        stateEmailLocalPart(stateMachine2, char2);
      }
    }
    function stateEmailMailto_O(stateMachine2, char2) {
      if (char2.toLowerCase() === ":") {
        stateMachine2.state = 21;
      } else {
        stateEmailLocalPart(stateMachine2, char2);
      }
    }
    function stateEmailMailtoColon(stateMachine2, char2) {
      if (isEmailLocalPartChar(char2)) {
        stateMachine2.state = 22;
      } else {
        remove(stateMachines, stateMachine2);
      }
    }
    function stateEmailLocalPart(stateMachine2, char2) {
      if (char2 === ".") {
        stateMachine2.state = 23;
      } else if (char2 === "@") {
        stateMachine2.state = 24;
      } else if (isEmailLocalPartChar(char2)) {
        stateMachine2.state = 22;
      } else {
        remove(stateMachines, stateMachine2);
      }
    }
    function stateEmailLocalPartDot(stateMachine2, char2) {
      if (char2 === ".") {
        remove(stateMachines, stateMachine2);
      } else if (char2 === "@") {
        remove(stateMachines, stateMachine2);
      } else if (isEmailLocalPartChar(char2)) {
        stateMachine2.state = 22;
      } else {
        remove(stateMachines, stateMachine2);
      }
    }
    function stateEmailAtSign(stateMachine2, char2) {
      if (isDomainLabelStartChar(char2)) {
        stateMachine2.state = 25;
      } else {
        remove(stateMachines, stateMachine2);
      }
    }
    function stateEmailDomainChar(stateMachine2, char2) {
      if (char2 === ".") {
        stateMachine2.state = 27;
      } else if (char2 === "-") {
        stateMachine2.state = 26;
      } else if (isDomainLabelChar(char2)) {
      } else {
        captureMatchIfValidAndRemove(stateMachine2);
      }
    }
    function stateEmailDomainHyphen(stateMachine2, char2) {
      if (char2 === "-" || char2 === ".") {
        captureMatchIfValidAndRemove(stateMachine2);
      } else if (isDomainLabelChar(char2)) {
        stateMachine2.state = 25;
      } else {
        captureMatchIfValidAndRemove(stateMachine2);
      }
    }
    function stateEmailDomainDot(stateMachine2, char2) {
      if (char2 === "." || char2 === "-") {
        captureMatchIfValidAndRemove(stateMachine2);
      } else if (isDomainLabelStartChar(char2)) {
        stateMachine2.state = 25;
        stateMachine2.acceptStateReached = true;
      } else {
        captureMatchIfValidAndRemove(stateMachine2);
      }
    }
    function stateHashtagHashChar(stateMachine2, char2) {
      if (isHashtagTextChar(char2)) {
        stateMachine2.state = 29;
        stateMachine2.acceptStateReached = true;
      } else {
        remove(stateMachines, stateMachine2);
      }
    }
    function stateHashtagTextChar(stateMachine2, char2) {
      if (isHashtagTextChar(char2)) {
      } else {
        captureMatchIfValidAndRemove(stateMachine2);
      }
    }
    function stateMentionAtChar(stateMachine2, char2) {
      if (isMentionTextChar(char2)) {
        stateMachine2.state = 31;
        stateMachine2.acceptStateReached = true;
      } else {
        remove(stateMachines, stateMachine2);
      }
    }
    function stateMentionTextChar(stateMachine2, char2) {
      if (isMentionTextChar(char2)) {
      } else if (alphaNumericAndMarksRe.test(char2)) {
        remove(stateMachines, stateMachine2);
      } else {
        captureMatchIfValidAndRemove(stateMachine2);
      }
    }
    function statePhoneNumberPlus(stateMachine2, char2) {
      if (digitRe.test(char2)) {
        stateMachine2.state = 38;
      } else {
        remove(stateMachines, stateMachine2);
        stateNoMatch(char2);
      }
    }
    function statePhoneNumberOpenParen(stateMachine2, char2) {
      if (digitRe.test(char2)) {
        stateMachine2.state = 33;
      } else {
        remove(stateMachines, stateMachine2);
      }
      stateNoMatch(char2);
    }
    function statePhoneNumberAreaCodeDigit1(stateMachine2, char2) {
      if (digitRe.test(char2)) {
        stateMachine2.state = 34;
      } else {
        remove(stateMachines, stateMachine2);
      }
    }
    function statePhoneNumberAreaCodeDigit2(stateMachine2, char2) {
      if (digitRe.test(char2)) {
        stateMachine2.state = 35;
      } else {
        remove(stateMachines, stateMachine2);
      }
    }
    function statePhoneNumberAreaCodeDigit3(stateMachine2, char2) {
      if (char2 === ")") {
        stateMachine2.state = 36;
      } else {
        remove(stateMachines, stateMachine2);
      }
    }
    function statePhoneNumberCloseParen(stateMachine2, char2) {
      if (digitRe.test(char2)) {
        stateMachine2.state = 38;
      } else if (isPhoneNumberSeparatorChar(char2)) {
        stateMachine2.state = 39;
      } else {
        remove(stateMachines, stateMachine2);
      }
    }
    function statePhoneNumberDigit(stateMachine2, char2) {
      stateMachine2.acceptStateReached = true;
      if (isPhoneNumberControlChar(char2)) {
        stateMachine2.state = 40;
      } else if (char2 === "#") {
        stateMachine2.state = 41;
      } else if (digitRe.test(char2)) {
      } else if (char2 === "(") {
        stateMachine2.state = 32;
      } else if (isPhoneNumberSeparatorChar(char2)) {
        stateMachine2.state = 39;
      } else {
        captureMatchIfValidAndRemove(stateMachine2);
        if (isSchemeStartChar(char2)) {
          stateMachines.push(createSchemeUrlStateMachine(
            charIdx,
            0
            /* SchemeChar */
          ));
        }
      }
    }
    function statePhoneNumberSeparator(stateMachine2, char2) {
      if (digitRe.test(char2)) {
        stateMachine2.state = 38;
      } else if (char2 === "(") {
        stateMachine2.state = 32;
      } else {
        captureMatchIfValidAndRemove(stateMachine2);
        stateNoMatch(char2);
      }
    }
    function statePhoneNumberControlChar(stateMachine2, char2) {
      if (isPhoneNumberControlChar(char2)) {
      } else if (char2 === "#") {
        stateMachine2.state = 41;
      } else if (digitRe.test(char2)) {
        stateMachine2.state = 38;
      } else {
        captureMatchIfValidAndRemove(stateMachine2);
      }
    }
    function statePhoneNumberPoundChar(stateMachine2, char2) {
      if (isPhoneNumberControlChar(char2)) {
        stateMachine2.state = 40;
      } else if (digitRe.test(char2)) {
        remove(stateMachines, stateMachine2);
      } else {
        captureMatchIfValidAndRemove(stateMachine2);
      }
    }
    function captureMatchIfValidAndRemove(stateMachine2) {
      remove(stateMachines, stateMachine2);
      if (!stateMachine2.acceptStateReached) {
        return;
      }
      var startIdx = stateMachine2.startIdx;
      var matchedText = text2.slice(stateMachine2.startIdx, charIdx);
      matchedText = excludeUnbalancedTrailingBracesAndPunctuation(matchedText);
      if (stateMachine2.type === "url") {
        var charBeforeUrlMatch = text2.charAt(stateMachine2.startIdx - 1);
        if (charBeforeUrlMatch === "@") {
          return;
        }
        var urlMatchType = stateMachine2.matchType;
        if (urlMatchType === "scheme") {
          var httpSchemeMatch = httpSchemeRe.exec(matchedText);
          if (httpSchemeMatch) {
            startIdx = startIdx + httpSchemeMatch.index;
            matchedText = matchedText.slice(httpSchemeMatch.index);
          }
          if (!isValidSchemeUrl(matchedText)) {
            return;
          }
        } else if (urlMatchType === "tld") {
          if (!isValidTldMatch(matchedText)) {
            return;
          }
        } else if (urlMatchType === "ipV4") {
          if (!isValidIpV4Address(matchedText)) {
            return;
          }
        } else {
          assertNever(urlMatchType);
        }
        matches.push(new UrlMatch({
          tagBuilder,
          matchedText,
          offset: startIdx,
          urlMatchType,
          url: matchedText,
          protocolRelativeMatch: matchedText.slice(0, 2) === "//",
          // TODO: Do these settings need to be passed to the match,
          // or should we handle them here in UrlMatcher?
          stripPrefix,
          stripTrailingSlash,
          decodePercentEncoding
        }));
      } else if (stateMachine2.type === "email") {
        if (isValidEmail(matchedText)) {
          matches.push(new EmailMatch({
            tagBuilder,
            matchedText,
            offset: startIdx,
            email: matchedText.replace(mailtoSchemePrefixRe, "")
          }));
        }
      } else if (stateMachine2.type === "hashtag") {
        if (isValidHashtag(matchedText)) {
          matches.push(new HashtagMatch({
            tagBuilder,
            matchedText,
            offset: startIdx,
            serviceName: hashtagServiceName,
            hashtag: matchedText.slice(1)
          }));
        }
      } else if (stateMachine2.type === "mention") {
        if (isValidMention(matchedText, mentionServiceName)) {
          matches.push(new MentionMatch({
            tagBuilder,
            matchedText,
            offset: startIdx,
            serviceName: mentionServiceName,
            mention: matchedText.slice(1)
            // strip off the '@' character at the beginning
          }));
        }
      } else if (stateMachine2.type === "phone") {
        matchedText = matchedText.replace(/ +$/g, "");
        if (isValidPhoneNumber(matchedText)) {
          var cleanNumber = matchedText.replace(/[^0-9,;#]/g, "");
          matches.push(new PhoneMatch({
            tagBuilder,
            matchedText,
            offset: startIdx,
            number: cleanNumber,
            plusSign: matchedText.charAt(0) === "+"
          }));
        }
      } else {
        assertNever(stateMachine2);
      }
    }
  }
  var openBraceRe = /[\(\{\[]/;
  var closeBraceRe = /[\)\}\]]/;
  var oppositeBrace = {
    ")": "(",
    "}": "{",
    "]": "["
  };
  function excludeUnbalancedTrailingBracesAndPunctuation(matchedText) {
    var braceCounts = {
      "(": 0,
      "{": 0,
      "[": 0
    };
    for (var i = 0; i < matchedText.length; i++) {
      var char_1 = matchedText.charAt(i);
      if (openBraceRe.test(char_1)) {
        braceCounts[char_1]++;
      } else if (closeBraceRe.test(char_1)) {
        braceCounts[oppositeBrace[char_1]]--;
      }
    }
    var endIdx = matchedText.length - 1;
    var char;
    while (endIdx >= 0) {
      char = matchedText.charAt(endIdx);
      if (closeBraceRe.test(char)) {
        var oppositeBraceChar = oppositeBrace[char];
        if (braceCounts[oppositeBraceChar] < 0) {
          braceCounts[oppositeBraceChar]++;
          endIdx--;
        } else {
          break;
        }
      } else if (urlSuffixedCharsNotAllowedAtEndRe.test(char)) {
        endIdx--;
      } else {
        break;
      }
    }
    return matchedText.slice(0, endIdx + 1);
  }
  function createSchemeUrlStateMachine(startIdx, state) {
    return {
      type: "url",
      startIdx,
      state,
      acceptStateReached: false,
      matchType: "scheme"
    };
  }
  function createTldUrlStateMachine(startIdx, state) {
    return {
      type: "url",
      startIdx,
      state,
      acceptStateReached: false,
      matchType: "tld"
    };
  }
  function createIpV4UrlStateMachine(startIdx, state) {
    return {
      type: "url",
      startIdx,
      state,
      acceptStateReached: false,
      matchType: "ipV4",
      octetsEncountered: 1
      // starts at 1 because we create this machine when encountering the first octet
    };
  }
  function createEmailStateMachine(startIdx, state) {
    return {
      type: "email",
      startIdx,
      state,
      acceptStateReached: false
    };
  }
  function createHashtagStateMachine(startIdx, state) {
    return {
      type: "hashtag",
      startIdx,
      state,
      acceptStateReached: false
    };
  }
  function createMentionStateMachine(startIdx, state) {
    return {
      type: "mention",
      startIdx,
      state,
      acceptStateReached: false
    };
  }
  function createPhoneNumberStateMachine(startIdx, state) {
    return {
      type: "phone",
      startIdx,
      state,
      acceptStateReached: false
    };
  }

  // node_modules/autolinker/dist/es2015/htmlParser/parse-html.js
  function parseHtml(html, _a) {
    var onOpenTag = _a.onOpenTag, onCloseTag = _a.onCloseTag, onText = _a.onText, onComment = _a.onComment, onDoctype = _a.onDoctype;
    var noCurrentTag = new CurrentTag();
    var charIdx = 0, len = html.length, state = 0, currentDataIdx = 0, currentTag = noCurrentTag;
    while (charIdx < len) {
      var char = html.charAt(charIdx);
      switch (state) {
        case 0:
          stateData(char);
          break;
        case 1:
          stateTagOpen(char);
          break;
        case 2:
          stateEndTagOpen(char);
          break;
        case 3:
          stateTagName(char);
          break;
        case 4:
          stateBeforeAttributeName(char);
          break;
        case 5:
          stateAttributeName(char);
          break;
        case 6:
          stateAfterAttributeName(char);
          break;
        case 7:
          stateBeforeAttributeValue(char);
          break;
        case 8:
          stateAttributeValueDoubleQuoted(char);
          break;
        case 9:
          stateAttributeValueSingleQuoted(char);
          break;
        case 10:
          stateAttributeValueUnquoted(char);
          break;
        case 11:
          stateAfterAttributeValueQuoted(char);
          break;
        case 12:
          stateSelfClosingStartTag(char);
          break;
        case 13:
          stateMarkupDeclarationOpen(char);
          break;
        case 14:
          stateCommentStart(char);
          break;
        case 15:
          stateCommentStartDash(char);
          break;
        case 16:
          stateComment(char);
          break;
        case 17:
          stateCommentEndDash(char);
          break;
        case 18:
          stateCommentEnd(char);
          break;
        case 19:
          stateCommentEndBang(char);
          break;
        case 20:
          stateDoctype(char);
          break;
        default:
          assertNever(state);
      }
      charIdx++;
    }
    if (currentDataIdx < charIdx) {
      emitText();
    }
    function stateData(char2) {
      if (char2 === "<") {
        startNewTag();
      }
    }
    function stateTagOpen(char2) {
      if (char2 === "!") {
        state = 13;
      } else if (char2 === "/") {
        state = 2;
        currentTag = new CurrentTag(__assign(__assign({}, currentTag), { isClosing: true }));
      } else if (char2 === "<") {
        startNewTag();
      } else if (letterRe.test(char2)) {
        state = 3;
        currentTag = new CurrentTag(__assign(__assign({}, currentTag), { isOpening: true }));
      } else {
        state = 0;
        currentTag = noCurrentTag;
      }
    }
    function stateTagName(char2) {
      if (whitespaceRe.test(char2)) {
        currentTag = new CurrentTag(__assign(__assign({}, currentTag), { name: captureTagName() }));
        state = 4;
      } else if (char2 === "<") {
        startNewTag();
      } else if (char2 === "/") {
        currentTag = new CurrentTag(__assign(__assign({}, currentTag), { name: captureTagName() }));
        state = 12;
      } else if (char2 === ">") {
        currentTag = new CurrentTag(__assign(__assign({}, currentTag), { name: captureTagName() }));
        emitTagAndPreviousTextNode();
      } else if (!letterRe.test(char2) && !digitRe.test(char2) && char2 !== ":") {
        resetToDataState();
      } else {
      }
    }
    function stateEndTagOpen(char2) {
      if (char2 === ">") {
        resetToDataState();
      } else if (letterRe.test(char2)) {
        state = 3;
      } else {
        resetToDataState();
      }
    }
    function stateBeforeAttributeName(char2) {
      if (whitespaceRe.test(char2)) {
      } else if (char2 === "/") {
        state = 12;
      } else if (char2 === ">") {
        emitTagAndPreviousTextNode();
      } else if (char2 === "<") {
        startNewTag();
      } else if (char2 === "=" || quoteRe.test(char2) || controlCharsRe.test(char2)) {
        resetToDataState();
      } else {
        state = 5;
      }
    }
    function stateAttributeName(char2) {
      if (whitespaceRe.test(char2)) {
        state = 6;
      } else if (char2 === "/") {
        state = 12;
      } else if (char2 === "=") {
        state = 7;
      } else if (char2 === ">") {
        emitTagAndPreviousTextNode();
      } else if (char2 === "<") {
        startNewTag();
      } else if (quoteRe.test(char2)) {
        resetToDataState();
      } else {
      }
    }
    function stateAfterAttributeName(char2) {
      if (whitespaceRe.test(char2)) {
      } else if (char2 === "/") {
        state = 12;
      } else if (char2 === "=") {
        state = 7;
      } else if (char2 === ">") {
        emitTagAndPreviousTextNode();
      } else if (char2 === "<") {
        startNewTag();
      } else if (quoteRe.test(char2)) {
        resetToDataState();
      } else {
        state = 5;
      }
    }
    function stateBeforeAttributeValue(char2) {
      if (whitespaceRe.test(char2)) {
      } else if (char2 === '"') {
        state = 8;
      } else if (char2 === "'") {
        state = 9;
      } else if (/[>=`]/.test(char2)) {
        resetToDataState();
      } else if (char2 === "<") {
        startNewTag();
      } else {
        state = 10;
      }
    }
    function stateAttributeValueDoubleQuoted(char2) {
      if (char2 === '"') {
        state = 11;
      } else {
      }
    }
    function stateAttributeValueSingleQuoted(char2) {
      if (char2 === "'") {
        state = 11;
      } else {
      }
    }
    function stateAttributeValueUnquoted(char2) {
      if (whitespaceRe.test(char2)) {
        state = 4;
      } else if (char2 === ">") {
        emitTagAndPreviousTextNode();
      } else if (char2 === "<") {
        startNewTag();
      } else {
      }
    }
    function stateAfterAttributeValueQuoted(char2) {
      if (whitespaceRe.test(char2)) {
        state = 4;
      } else if (char2 === "/") {
        state = 12;
      } else if (char2 === ">") {
        emitTagAndPreviousTextNode();
      } else if (char2 === "<") {
        startNewTag();
      } else {
        state = 4;
        reconsumeCurrentCharacter();
      }
    }
    function stateSelfClosingStartTag(char2) {
      if (char2 === ">") {
        currentTag = new CurrentTag(__assign(__assign({}, currentTag), { isClosing: true }));
        emitTagAndPreviousTextNode();
      } else {
        state = 4;
      }
    }
    function stateMarkupDeclarationOpen(char2) {
      if (html.substr(charIdx, 2) === "--") {
        charIdx += 2;
        currentTag = new CurrentTag(__assign(__assign({}, currentTag), { type: "comment" }));
        state = 14;
      } else if (html.substr(charIdx, 7).toUpperCase() === "DOCTYPE") {
        charIdx += 7;
        currentTag = new CurrentTag(__assign(__assign({}, currentTag), { type: "doctype" }));
        state = 20;
      } else {
        resetToDataState();
      }
    }
    function stateCommentStart(char2) {
      if (char2 === "-") {
        state = 15;
      } else if (char2 === ">") {
        resetToDataState();
      } else {
        state = 16;
      }
    }
    function stateCommentStartDash(char2) {
      if (char2 === "-") {
        state = 18;
      } else if (char2 === ">") {
        resetToDataState();
      } else {
        state = 16;
      }
    }
    function stateComment(char2) {
      if (char2 === "-") {
        state = 17;
      } else {
      }
    }
    function stateCommentEndDash(char2) {
      if (char2 === "-") {
        state = 18;
      } else {
        state = 16;
      }
    }
    function stateCommentEnd(char2) {
      if (char2 === ">") {
        emitTagAndPreviousTextNode();
      } else if (char2 === "!") {
        state = 19;
      } else if (char2 === "-") {
      } else {
        state = 16;
      }
    }
    function stateCommentEndBang(char2) {
      if (char2 === "-") {
        state = 17;
      } else if (char2 === ">") {
        emitTagAndPreviousTextNode();
      } else {
        state = 16;
      }
    }
    function stateDoctype(char2) {
      if (char2 === ">") {
        emitTagAndPreviousTextNode();
      } else if (char2 === "<") {
        startNewTag();
      } else {
      }
    }
    function resetToDataState() {
      state = 0;
      currentTag = noCurrentTag;
    }
    function startNewTag() {
      state = 1;
      currentTag = new CurrentTag({ idx: charIdx });
    }
    function emitTagAndPreviousTextNode() {
      var textBeforeTag = html.slice(currentDataIdx, currentTag.idx);
      if (textBeforeTag) {
        onText(textBeforeTag, currentDataIdx);
      }
      if (currentTag.type === "comment") {
        onComment(currentTag.idx);
      } else if (currentTag.type === "doctype") {
        onDoctype(currentTag.idx);
      } else {
        if (currentTag.isOpening) {
          onOpenTag(currentTag.name, currentTag.idx);
        }
        if (currentTag.isClosing) {
          onCloseTag(currentTag.name, currentTag.idx);
        }
      }
      resetToDataState();
      currentDataIdx = charIdx + 1;
    }
    function emitText() {
      var text2 = html.slice(currentDataIdx, charIdx);
      onText(text2, currentDataIdx);
      currentDataIdx = charIdx + 1;
    }
    function captureTagName() {
      var startIdx = currentTag.idx + (currentTag.isClosing ? 2 : 1);
      return html.slice(startIdx, charIdx).toLowerCase();
    }
    function reconsumeCurrentCharacter() {
      charIdx--;
    }
  }
  var CurrentTag = function() {
    function CurrentTag2(cfg) {
      if (cfg === void 0) {
        cfg = {};
      }
      this.idx = cfg.idx !== void 0 ? cfg.idx : -1;
      this.type = cfg.type || "tag";
      this.name = cfg.name || "";
      this.isOpening = !!cfg.isOpening;
      this.isClosing = !!cfg.isClosing;
    }
    return CurrentTag2;
  }();

  // node_modules/autolinker/dist/es2015/autolinker.js
  var Autolinker = function() {
    function Autolinker2(cfg) {
      if (cfg === void 0) {
        cfg = {};
      }
      this.version = Autolinker2.version;
      this.urls = {};
      this.email = true;
      this.phone = true;
      this.hashtag = false;
      this.mention = false;
      this.newWindow = true;
      this.stripPrefix = {
        scheme: true,
        www: true
      };
      this.stripTrailingSlash = true;
      this.decodePercentEncoding = true;
      this.truncate = {
        length: 0,
        location: "end"
      };
      this.className = "";
      this.replaceFn = null;
      this.context = void 0;
      this.sanitizeHtml = false;
      this.tagBuilder = null;
      this.urls = normalizeUrlsCfg(cfg.urls);
      this.email = isBoolean(cfg.email) ? cfg.email : this.email;
      this.phone = isBoolean(cfg.phone) ? cfg.phone : this.phone;
      this.hashtag = cfg.hashtag || this.hashtag;
      this.mention = cfg.mention || this.mention;
      this.newWindow = isBoolean(cfg.newWindow) ? cfg.newWindow : this.newWindow;
      this.stripPrefix = normalizeStripPrefixCfg(cfg.stripPrefix);
      this.stripTrailingSlash = isBoolean(cfg.stripTrailingSlash) ? cfg.stripTrailingSlash : this.stripTrailingSlash;
      this.decodePercentEncoding = isBoolean(cfg.decodePercentEncoding) ? cfg.decodePercentEncoding : this.decodePercentEncoding;
      this.sanitizeHtml = cfg.sanitizeHtml || false;
      var mention = this.mention;
      if (mention !== false && mentionServices.indexOf(mention) === -1) {
        throw new Error("invalid `mention` cfg '".concat(mention, "' - see docs"));
      }
      var hashtag = this.hashtag;
      if (hashtag !== false && hashtagServices.indexOf(hashtag) === -1) {
        throw new Error("invalid `hashtag` cfg '".concat(hashtag, "' - see docs"));
      }
      this.truncate = normalizeTruncateCfg(cfg.truncate);
      this.className = cfg.className || this.className;
      this.replaceFn = cfg.replaceFn || this.replaceFn;
      this.context = cfg.context || this;
    }
    Autolinker2.link = function(textOrHtml, options) {
      var autolinker = new Autolinker2(options);
      return autolinker.link(textOrHtml);
    };
    Autolinker2.parse = function(textOrHtml, options) {
      var autolinker = new Autolinker2(options);
      return autolinker.parse(textOrHtml);
    };
    Autolinker2.prototype.parse = function(textOrHtml) {
      var _this = this;
      var skipTagNames = ["a", "style", "script"], skipTagsStackCount = 0, matches = [];
      parseHtml(textOrHtml, {
        onOpenTag: function(tagName) {
          if (skipTagNames.indexOf(tagName) >= 0) {
            skipTagsStackCount++;
          }
        },
        onText: function(text2, offset) {
          if (skipTagsStackCount === 0) {
            var htmlCharacterEntitiesRegex = /(&nbsp;|&#160;|&lt;|&#60;|&gt;|&#62;|&quot;|&#34;|&#39;)/gi;
            var textSplit = text2.split(htmlCharacterEntitiesRegex);
            var currentOffset_1 = offset;
            textSplit.forEach(function(splitText, i) {
              if (i % 2 === 0) {
                var textNodeMatches = _this.parseText(splitText, currentOffset_1);
                matches.push.apply(matches, textNodeMatches);
              }
              currentOffset_1 += splitText.length;
            });
          }
        },
        onCloseTag: function(tagName) {
          if (skipTagNames.indexOf(tagName) >= 0) {
            skipTagsStackCount = Math.max(skipTagsStackCount - 1, 0);
          }
        },
        onComment: function(_offset) {
        },
        onDoctype: function(_offset) {
        }
        // no need to process doctype nodes
      });
      matches = this.compactMatches(matches);
      matches = this.removeUnwantedMatches(matches);
      return matches;
    };
    Autolinker2.prototype.compactMatches = function(matches) {
      matches.sort(function(a, b) {
        return a.getOffset() - b.getOffset();
      });
      var i = 0;
      while (i < matches.length - 1) {
        var match = matches[i], offset = match.getOffset(), matchedTextLength = match.getMatchedText().length, endIdx = offset + matchedTextLength;
        if (i + 1 < matches.length) {
          if (matches[i + 1].getOffset() === offset) {
            var removeIdx = matches[i + 1].getMatchedText().length > matchedTextLength ? i : i + 1;
            matches.splice(removeIdx, 1);
            continue;
          }
          if (matches[i + 1].getOffset() < endIdx) {
            matches.splice(i + 1, 1);
            continue;
          }
        }
        i++;
      }
      return matches;
    };
    Autolinker2.prototype.removeUnwantedMatches = function(matches) {
      if (!this.hashtag)
        removeWithPredicate(matches, function(match) {
          return match.getType() === "hashtag";
        });
      if (!this.email)
        removeWithPredicate(matches, function(match) {
          return match.getType() === "email";
        });
      if (!this.phone)
        removeWithPredicate(matches, function(match) {
          return match.getType() === "phone";
        });
      if (!this.mention)
        removeWithPredicate(matches, function(match) {
          return match.getType() === "mention";
        });
      if (!this.urls.schemeMatches) {
        removeWithPredicate(matches, function(m) {
          return m.getType() === "url" && m.getUrlMatchType() === "scheme";
        });
      }
      if (!this.urls.tldMatches) {
        removeWithPredicate(matches, function(m) {
          return m.getType() === "url" && m.getUrlMatchType() === "tld";
        });
      }
      if (!this.urls.ipV4Matches) {
        removeWithPredicate(matches, function(m) {
          return m.getType() === "url" && m.getUrlMatchType() === "ipV4";
        });
      }
      return matches;
    };
    Autolinker2.prototype.parseText = function(text2, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      offset = offset || 0;
      var matches = parseMatches(text2, {
        tagBuilder: this.getTagBuilder(),
        stripPrefix: this.stripPrefix,
        stripTrailingSlash: this.stripTrailingSlash,
        decodePercentEncoding: this.decodePercentEncoding,
        hashtagServiceName: this.hashtag,
        mentionServiceName: this.mention || "twitter"
      });
      for (var i = 0, numTextMatches = matches.length; i < numTextMatches; i++) {
        matches[i].setOffset(offset + matches[i].getOffset());
      }
      return matches;
    };
    Autolinker2.prototype.link = function(textOrHtml) {
      if (!textOrHtml) {
        return "";
      }
      if (this.sanitizeHtml) {
        textOrHtml = textOrHtml.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      }
      var matches = this.parse(textOrHtml), newHtml = [], lastIndex = 0;
      for (var i = 0, len = matches.length; i < len; i++) {
        var match = matches[i];
        newHtml.push(textOrHtml.substring(lastIndex, match.getOffset()));
        newHtml.push(this.createMatchReturnVal(match));
        lastIndex = match.getOffset() + match.getMatchedText().length;
      }
      newHtml.push(textOrHtml.substring(lastIndex));
      return newHtml.join("");
    };
    Autolinker2.prototype.createMatchReturnVal = function(match) {
      var replaceFnResult;
      if (this.replaceFn) {
        replaceFnResult = this.replaceFn.call(this.context, match);
      }
      if (typeof replaceFnResult === "string") {
        return replaceFnResult;
      } else if (replaceFnResult === false) {
        return match.getMatchedText();
      } else if (replaceFnResult instanceof HtmlTag) {
        return replaceFnResult.toAnchorString();
      } else {
        var anchorTag = match.buildTag();
        return anchorTag.toAnchorString();
      }
    };
    Autolinker2.prototype.getTagBuilder = function() {
      var tagBuilder = this.tagBuilder;
      if (!tagBuilder) {
        tagBuilder = this.tagBuilder = new AnchorTagBuilder({
          newWindow: this.newWindow,
          truncate: this.truncate,
          className: this.className
        });
      }
      return tagBuilder;
    };
    Autolinker2.version = version;
    return Autolinker2;
  }();
  var autolinker_default = Autolinker;
  function normalizeUrlsCfg(urls) {
    if (urls == null)
      urls = true;
    if (isBoolean(urls)) {
      return { schemeMatches: urls, tldMatches: urls, ipV4Matches: urls };
    } else {
      return {
        schemeMatches: isBoolean(urls.schemeMatches) ? urls.schemeMatches : true,
        tldMatches: isBoolean(urls.tldMatches) ? urls.tldMatches : true,
        ipV4Matches: isBoolean(urls.ipV4Matches) ? urls.ipV4Matches : true
      };
    }
  }
  function normalizeStripPrefixCfg(stripPrefix) {
    if (stripPrefix == null)
      stripPrefix = true;
    if (isBoolean(stripPrefix)) {
      return { scheme: stripPrefix, www: stripPrefix };
    } else {
      return {
        scheme: isBoolean(stripPrefix.scheme) ? stripPrefix.scheme : true,
        www: isBoolean(stripPrefix.www) ? stripPrefix.www : true
      };
    }
  }
  function normalizeTruncateCfg(truncate) {
    if (typeof truncate === "number") {
      return { length: truncate, location: "end" };
    } else {
      return defaults(truncate || {}, {
        length: Number.POSITIVE_INFINITY,
        location: "end"
      });
    }
  }

  // node_modules/autolinker/dist/es2015/index.js
  var es2015_default = autolinker_default;

  // public/css/componentStyles.ts
  var inputStyles = {
    border: "none",
    background: "none",
    borderRadius: "4px",
    padding: "4px 8px",
    fontSize: "14px",
    outline: "none",
    fontFamily: fonts.montserrat,
    color: basics.darkCharcoal,
    backgroundColor: "#ffffff45"
  };
  var buttonStyles = {
    background: colors.royalBlueLight,
    border: "none",
    color: basics.whiteColor,
    fontFamily: fonts.montserrat,
    fontWeight: "400",
    fontSize: "14px",
    borderRadius: "4px",
    padding: "8px 16px",
    letterSpacing: "1",
    lineHeight: "22px"
  };

  // src/views/Event/EventDateSelect.ts
  function EventDateSelect(event, onEventStateChange) {
    const el = Div({
      styles: __spreadProps(__spreadValues({}, flexAlignItemsCenter), {
        padding: "12px"
      })
    });
    const datesContainer = Div({
      styles: { marginRight: event.allDay ? "" : "auto" }
    });
    datesContainer.appendChild(
      event.allDay ? newStartDateInput() : newStartTimeInput()
    );
    const toLabel = Label({
      attr: { innerText: "to" },
      styles: {
        marginRight: "8px"
      }
    });
    if (!event.allDay) {
      datesContainer.appendChild(toLabel);
      datesContainer.appendChild(endTimeInput());
    }
    const allDayContainer = Div({ styles: __spreadValues({}, flexAlignItemsCenter) });
    const allDayInput = Input({
      attr: {
        type: "checkbox",
        checked: event.allDay,
        onchange: onAllDayChange
      },
      selectors: {
        id: "allDay"
      }
    });
    allDayContainer.appendChild(allDayInput);
    const allDayLabel = Label({
      attr: { innerText: "All day", for: "allDay" },
      styles: { marginLeft: "4px" }
    });
    allDayContainer.appendChild(allDayLabel);
    function dateTimeString() {
      return formatDateTimeInputValue(event.start);
    }
    function newStartTimeInput() {
      return Input({
        selectors: { id: "start" },
        attr: {
          type: "datetime-local",
          value: event.start ? dateTimeString() : void 0,
          required: true,
          onchange: (e) => {
            const selectedValue = e.target.value;
            let newStartDate = new Date(selectedValue);
            const endDateTime = byId("end");
            const newEndDate = addMinutesToDate(newStartDate, 30);
            const endDateTimeString = formatDateTimeInputValue(newEndDate);
            endDateTime.value = endDateTimeString;
            onEventStateChange({
              start: newStartDate,
              end: newEndDate
            });
          }
        },
        styles: __spreadProps(__spreadValues({}, inputStyles), {
          marginRight: "8px"
        })
      });
    }
    function newStartDateInput() {
      return Input({
        selectors: { id: "start" },
        attr: {
          type: "date",
          value: formatSplitDate(
            convertMidnightUTCToLocalDay(event.start),
            "-",
            "yyyy-mm-dd"
          ),
          required: true,
          onchange: (e) => {
            const selectedValue = e.target.value;
            let newStartDate = new Date(selectedValue);
            newStartDate.setUTCHours(0, 0, 0, 0);
            onEventStateChange({
              start: newStartDate,
              end: void 0
            });
          }
        },
        styles: __spreadProps(__spreadValues({}, inputStyles), {
          marginRight: "8px"
        })
      });
    }
    function endTimeInput() {
      return Input({
        attr: {
          type: "datetime-local",
          value: event.end ? formatDateTimeInputValue(event.end) : "",
          required: true,
          onchange: (e) => {
            onEventStateChange({
              end: new Date(e.target.value)
            });
          }
        },
        styles: __spreadProps(__spreadValues({}, inputStyles), {
          marginRight: "8px"
        }),
        selectors: { id: "end" }
      });
    }
    function onAllDayChange(e) {
      const isChecked = e.target.checked;
      const dateInput = byId("start");
      const endDatetimeInput = byId("end");
      if (isChecked) {
        datesContainer.removeChild(dateInput);
        datesContainer.removeChild(toLabel);
        datesContainer.removeChild(endDatetimeInput);
        const copiedDate = new Date(event.start.getTime());
        copiedDate.setHours(0, 0, 0, 0);
        onEventStateChange({
          start: copiedDate,
          allDay: isChecked,
          end: isChecked ? void 0 : event.end
        });
        datesContainer.style.marginRight = "0";
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
          end: void 0
        });
        datesContainer.style.marginRight = "auto";
        datesContainer.prepend(newStartTimeInput());
      }
    }
    el.appendChild(datesContainer);
    el.appendChild(allDayContainer);
    return el;
  }

  // src/components/RadioButtons.ts
  function RadioButtons(props) {
    var _a;
    const el = Div({ styles: { display: "flex" } });
    (_a = props.options) == null ? void 0 : _a.map((option) => {
      const firstLabel = Label({
        attr: { for: option, innerText: option },
        styles: { marginRight: "8px" }
      });
      const first = Input({
        selectors: { id: option },
        attr: {
          checked: option === props.selected,
          type: "radio",
          name: props.name,
          value: option,
          onchange: (e) => {
            props.onChange(e.target.value);
          }
        },
        styles: { margin: "0 4px" }
      });
      el.appendChild(first);
      el.appendChild(firstLabel);
    });
    return el;
  }

  // src/views/Event/UsersCheckboxes.ts
  function UsersCheckboxes(id, selectedUserIds, onChange2) {
    const checkboxEl = Div({
      selectors: { id },
      styles: { padding: "0 12px 12px" }
    });
    function init2() {
      return __async(this, null, function* () {
        const currentUser = yield fetchSelf();
        const users2 = yield getUsers();
        const everyone = !selectedUserIds.length;
        let selectedIds = everyone ? users2.map((user) => user._id) : selectedUserIds;
        users2.forEach((option) => {
          const optionContainer = Div({
            styles: __spreadValues({ padding: "4px 0" }, flexAlignItemsCenter)
          });
          const { name, _id } = option;
          const isCurrentUser = (currentUser == null ? void 0 : currentUser._id) === _id;
          const optionLabel = Label({
            attr: {
              innerText: `${name}${isCurrentUser ? " (Organizer)" : ""}`,
              for: name
            }
          });
          const optionEl = Input({
            selectors: {
              id: _id
            },
            attr: {
              type: "checkbox",
              disabled: isCurrentUser,
              checked: selectedIds.includes(_id),
              value: name,
              onchange: (e) => {
                const isChecked = e.target.checked;
                if (isChecked) {
                  selectedIds.push(_id);
                } else {
                  selectedIds = selectedIds.filter(
                    (optionSelected) => optionSelected !== _id
                  );
                }
                const everyoneSelected = selectedIds.length === users2.length;
                onChange2(everyoneSelected ? [] : selectedIds);
              }
            },
            styles: {
              marginRight: "8px"
            }
          });
          optionContainer.appendChild(optionEl);
          optionContainer.appendChild(optionLabel);
          checkboxEl.appendChild(optionContainer);
        });
      });
    }
    init2();
    return checkboxEl;
  }

  // src/views/Event/EventGuests.ts
  function EventGuests(currentUserId, selectedUserIds, onEventStateChange) {
    const el = Div();
    const sharedOptions = Div({
      styles: __spreadValues({ padding: "12px" }, flexAlignItemsCenter)
    });
    const label = Label({
      attr: { innerText: "Guests:" },
      styles: { marginRight: "8px" }
    });
    const currentGuests = (selectedUserIds == null ? void 0 : selectedUserIds.length) === 1 && selectedUserIds[0] === currentUserId;
    let guests = currentGuests ? "Me" : "Others";
    const guestsRadioButtons = RadioButtons({
      selected: guests,
      options: ["Me", "Others"],
      name: "users",
      onChange: onRadioButtonChange
    });
    const usersCheckboxes = UsersCheckboxes(
      "users-select",
      selectedUserIds,
      (ids) => {
        onEventStateChange({ users: ids });
      }
    );
    function onRadioButtonChange(option) {
      onEventStateChange({
        users: [currentUserId]
      });
      if (option === "Others") {
        el.appendChild(usersCheckboxes);
      } else {
        const usersSelect = byId("users-select");
        usersSelect && el.removeChild(usersSelect);
      }
    }
    sharedOptions.appendChild(label);
    sharedOptions.appendChild(guestsRadioButtons);
    el.appendChild(sharedOptions);
    if (guests === "Others") {
      el.append(usersCheckboxes);
    }
    return el;
  }

  // src/views/Event/EventPrivacy.ts
  function EventPrivacy(visibility, onEventStateChange) {
    const el = Div({
      styles: __spreadValues({ padding: "12px" }, flexAlignItemsCenter)
    });
    const label = Label({
      attr: { innerText: "Who can see this?" },
      styles: { marginRight: "8px" }
    });
    const privacyTypeRadioButtons = RadioButtons({
      selected: visibility === "private" ? "Only guests" : "Everyone",
      options: ["Only guests", "Everyone"],
      name: "privacy",
      onChange: (e) => {
        onEventStateChange({
          visibility: e === "Only guests" ? "private" : "public"
        });
      }
    });
    el.append(label);
    el.append(privacyTypeRadioButtons);
    return el;
  }

  // src/views/Event/Modal.ts
  function Modal(props) {
    const router = document.getElementById("router");
    if (!router)
      return;
    const el = Div({
      selectors: { id: "modal" },
      styles: {
        height: "100vh",
        width: "100vw",
        top: "0",
        left: "0",
        position: "fixed",
        backgroundColor: "#303030ab"
      }
    });
    const modal = Div({
      styles: {
        padding: "24px",
        background: " white",
        top: "25%",
        position: " relative",
        maxWidth: "500px",
        width: "100%",
        margin: "auto",
        borderRadius: " 4px",
        boxShadow: "0px 4px 4px rgb(133 131 131 / 25%)"
      }
    });
    const text2 = Label({
      attr: {
        innerHTML: props.label
      },
      styles: {
        display: "block",
        textAlign: "center"
      }
    });
    const cancelButton = Button({
      selectors: {
        id: "close-modal-btn"
      },
      attr: {
        innerHTML: times,
        type: "button",
        onclick: () => {
          el.remove();
        },
        onmouseover: () => {
          const button = byId("close-modal-btn");
          if (button) {
            button.style.color = colors.strongRed;
          }
        },
        onmouseout: () => {
          const button = byId("close-modal-btn");
          if (button) {
            button.style.color = basics.silver;
          }
        }
      },
      styles: {
        display: "block",
        marginLeft: "auto",
        background: "none",
        border: "none",
        color: basics.silver,
        fontSize: "26px",
        padding: "0px",
        margin: "10px 12px auto auto"
      }
    });
    const icon4 = Div({
      attr: {
        innerHTML: props.icon
      },
      styles: {
        height: "60px",
        width: "60px",
        background: colors.mandarine,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        margin: "0 auto 20px auto",
        fontSize: "24px"
      }
    });
    const buttons = Div({
      styles: {
        padding: "12px 0",
        marginLeft: "auto",
        display: "flex",
        justifyContent: "center",
        marginTop: "8px"
      }
    });
    const notifyButton = Button({
      selectors: { id: "notify-btn" },
      attr: {
        textContent: props.options[0],
        type: "submit",
        onclick: () => {
          props.onClick(props.options[0]);
        },
        onmouseover: () => {
          const button = byId("notify-btn");
          if (button) {
            button.style.opacity = ".9";
          }
        },
        onmouseout: () => {
          const button = byId("notify-btn");
          if (button) {
            button.style.opacity = "1";
          }
        }
      },
      styles: buttonStyles
    });
    const continueButton = Button({
      selectors: { id: "continue-btn" },
      attr: {
        textContent: props.options[1],
        type: "button",
        onclick: () => {
          props.onClick(props.options[1]);
        },
        onmouseover: () => {
          const button = byId("continue-btn");
          if (button) {
            button.style.opacity = ".9";
          }
        },
        onmouseout: () => {
          const button = byId("continue-btn");
          if (button) {
            button.style.opacity = "1";
          }
        }
      },
      styles: __spreadProps(__spreadValues({}, buttonStyles), {
        backgroundColor: basics.spanishGray,
        marginLeft: "20px"
      })
    });
    buttons.append(notifyButton);
    buttons.append(continueButton);
    modal.append(cancelButton);
    modal.append(icon4);
    modal.append(text2);
    modal.append(buttons);
    el.append(modal);
    router.append(el);
  }

  // src/views/Event/EventForm.ts
  var modalOptions = ["Yes, please.", "Nah, it's ok."];
  function EventForm(event) {
    const form = Form({
      styles: {
        maxWidth: "600px",
        paddingTop: "24px",
        marginLeft: "auto",
        marginRight: "auto",
        background: "#ffffff12",
        borderRadius: "4px"
      }
    });
    function init2() {
      return __async(this, null, function* () {
        const currentUser = yield fetchSelf();
        if (!currentUser) {
          return;
        }
        let initialStart = new Date();
        if (window.location.pathname.includes("/add/")) {
          initialStart = new Date(getDateStringFromUrl());
        }
        let eventTemplate = {
          title: "",
          description: "",
          start: initialStart,
          allDay: false,
          users: [currentUser == null ? void 0 : currentUser._id],
          visibility: "private",
          owner: currentUser._id
        };
        const eventState = event ? __spreadValues({}, event) : __spreadValues({}, eventTemplate);
        const setEventState = (newValue) => {
          Object.assign(eventState, newValue);
        };
        const headerContainer = Div({
          styles: __spreadProps(__spreadValues({}, flexAlignItemsCenter), {
            justifyContent: "space-between",
            padding: "0px 12px"
          })
        });
        const editEventHeader = H3({
          attr: { innerText: `${eventState._id ? "Edit" : "Add"} event` },
          styles: { color: basics.darkCharcoal, fontWeight: fontsWeight.semiBold }
        });
        const cancelButton = Button({
          selectors: {
            id: "cancel-btn"
          },
          attr: {
            innerHTML: times,
            type: "button",
            onclick: () => setURL("/"),
            onmouseover: () => {
              const button = byId("cancel-btn");
              if (button) {
                button.style.color = colors.strongRed;
              }
            },
            onmouseout: () => {
              const button = byId("cancel-btn");
              if (button) {
                button.style.color = basics.granite;
              }
            }
          },
          styles: {
            background: "none",
            border: "none",
            color: basics.granite,
            fontSize: "24px",
            padding: "0"
          }
        });
        headerContainer.appendChild(editEventHeader);
        headerContainer.appendChild(cancelButton);
        form.appendChild(headerContainer);
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
          },
          styles: __spreadProps(__spreadValues({}, inputStyles), { width: "100%" })
        });
        titleContainer.appendChild(titleInput);
        form.appendChild(titleContainer);
        const descriptionContainer = Div({
          styles: { padding: "12px", display: "flex", flexDirection: "column" }
        });
        const descriptionLabel = Label({
          attr: { innerText: "Description:" },
          styles: {
            marginBottom: "4px"
          }
        });
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
          },
          styles: __spreadProps(__spreadValues({}, inputStyles), { minHeight: "160px" })
        });
        descriptionContainer.appendChild(descriptionLabel);
        descriptionContainer.appendChild(descriptionInput);
        form.appendChild(descriptionContainer);
        const dateContainer = EventDateSelect(eventState, setEventState);
        form.appendChild(dateContainer);
        const connect = Div({ styles: { padding: "12px" } });
        const connectLabel = Span({
          attr: { innerHTML: link },
          styles: { color: basics.granite }
        });
        const connectLink = Label({
          attr: {
            innerHTML: eventState._id ? es2015_default.link(
              `https://preview-iyris.cloud.engramhq.xyz/${eventState._id}`
            ) : "Connect link will be created with event."
          },
          styles: {
            marginLeft: "8px",
            color: basics.granite
          }
        });
        connect.appendChild(connectLabel);
        connect.appendChild(connectLink);
        form.appendChild(connect);
        const guests = EventGuests(
          currentUser._id,
          (eventState == null ? void 0 : eventState.users) || [],
          setEventState
        );
        form.appendChild(guests);
        const privacy = EventPrivacy(
          eventState.visibility || "private",
          setEventState
        );
        form.appendChild(privacy);
        const buttons = Div({
          styles: { marginTop: "8px", padding: "12px" }
        });
        const saveButton = Button({
          selectors: { id: "save-btn" },
          attr: {
            textContent: "Save",
            type: "submit",
            onmouseover: () => {
              const button = byId("save-btn");
              if (button) {
                button.style.opacity = ".9";
              }
            },
            onmouseout: () => {
              const button = byId("save-btn");
              if (button) {
                button.style.opacity = "1";
              }
            }
          },
          styles: buttonStyles
        });
        buttons.appendChild(saveButton);
        form.appendChild(buttons);
        form.onsubmit = (e) => {
          var _a;
          e.preventDefault();
          let start = eventState.start;
          if (eventState.allDay) {
            const midnightDate = new Date(eventState.start.getTime());
            midnightDate.setUTCHours(0, 0, 0, 0);
            start = midnightDate;
            delete eventState.end;
          }
          setEventState({ start });
          const isOnlyOwner = ((_a = eventState.users) == null ? void 0 : _a.length) === 1 && eventState.users[0] === eventState.owner;
          isOnlyOwner ? onModalResponse(modalOptions[1]) : Modal({
            icon: envelopIcon,
            label: eventState._id ? "Email guests with updated event?" : "Notify guests by email?",
            options: modalOptions,
            onClick: onModalResponse
          });
        };
        function onModalResponse(response) {
          return __async(this, null, function* () {
            let eventId = eventState._id;
            const sendEmail = response === modalOptions[0] ? true : false;
            if (eventId) {
              yield editEvent(eventState, sendEmail);
            } else {
              eventId = yield createEvent(eventState, sendEmail);
            }
            setURL(`/events/${eventId}`);
          });
        }
      });
    }
    init2();
    return form;
  }

  // src/views/Event/Event.ts
  var ownerModalOptions = ["Yes, delete, adi\xF3s!", "No! Don't delete."];
  var notificationModalOptions = [
    "Yes, delete and notify.",
    "Delete but don't notify."
  ];
  var styles2 = __spreadProps(__spreadValues({}, flexAlignItemsCenter), {
    fontFamily: fonts.montserrat,
    fontSize: "14px",
    padding: "4px 0",
    marginTop: "12px"
  });
  var iconStyles = __spreadProps(__spreadValues({
    marginRight: "8px",
    color: basics.slateGray,
    width: "20px",
    height: "20px"
  }, flexAlignItemsCenter), {
    justifyContent: "center"
  });
  function icon3(iconName) {
    return Span({
      attr: { innerHTML: iconName },
      styles: iconStyles
    });
  }
  function Event2(event) {
    const el = Div({
      styles: {
        padding: "12px",
        margin: "8px auto 32px auto",
        maxWidth: "600px"
      }
    });
    const wrapper = Div({ styles: { backgroundColor: "#ffffff12" } });
    wrapper.append(el);
    function init2() {
      return __async(this, null, function* () {
        var _a, _b, _c;
        const users2 = yield getUsers();
        const currentUser = yield fetchSelf();
        const titleContainer = Div({
          styles: {
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "16px"
          }
        });
        const title = H3({
          attr: { innerText: event.title },
          styles: {
            padding: "4px 0",
            marginRight: "16px",
            fontWeight: fontsWeight.semiBold
          }
        });
        const buttons = Div({ styles: __spreadProps(__spreadValues({}, styles2), { marginTop: "0" }) });
        const visibilityTooltip = Div({
          attr: {
            innerHTML: event.visibility === "private" ? "Event visible to guests only." : "Event visible to all users."
          },
          styles: {
            display: "none",
            position: "absolute",
            top: " -36px",
            width: "max-content",
            background: "#555555",
            padding: " 4px 8px",
            borderRadius: "4px",
            fontStyle: "italic",
            color: basics.whiteColor
          }
        });
        const visibility = Div({
          attr: {
            innerHTML: eyeIcon,
            onmouseover: () => visibilityTooltip.style.display = "block",
            onmouseout: () => visibilityTooltip.style.display = "none"
          },
          styles: __spreadProps(__spreadValues({}, iconStyles), { position: "relative" })
        });
        visibility.append(visibilityTooltip);
        buttons.append(visibility);
        const isOnlyOwner = ((_a = event.users) == null ? void 0 : _a.length) === 1 && event.users[0] === event.owner;
        if (event.owner === (currentUser == null ? void 0 : currentUser._id)) {
          const removeBtn = Button({
            attr: {
              innerHTML: trash,
              onclick: (e) => {
                e.preventDefault();
                Modal({
                  icon: trash,
                  label: isOnlyOwner ? "Are you sure you want to delete this event?" : "You are about to delete this event. Do you want to notify guests by email?",
                  options: isOnlyOwner ? ownerModalOptions : notificationModalOptions,
                  onClick: handleDeleteEvent
                });
              },
              onmouseover: () => removeBtn.style.opacity = ".8",
              onmouseout: () => removeBtn.style.opacity = "1"
            },
            styles: __spreadProps(__spreadValues({}, buttonStyles), {
              fontSize: "17px",
              padding: "8px",
              marginLeft: "4px",
              background: "none",
              color: colors.strongRed,
              opacity: ".9"
            })
          });
          const editBtn = Button({
            attr: {
              innerHTML: pencil,
              onclick: (e) => __async(this, null, function* () {
                e.preventDefault();
                setURL(`/events/edit/${event._id}`);
              }),
              onmouseover: () => editBtn.style.opacity = ".8",
              onmouseout: () => editBtn.style.opacity = "1"
            },
            styles: __spreadProps(__spreadValues({}, buttonStyles), {
              fontSize: "17px",
              background: "none",
              color: colors.violetGlow,
              padding: "8px"
            })
          });
          buttons.append(editBtn);
          buttons.append(removeBtn);
        }
        titleContainer.append(title);
        titleContainer.append(buttons);
        el.append(titleContainer);
        if (event.description) {
          const description = Div({
            attr: { innerHTML: es2015_default.link(event.description) },
            styles: __spreadProps(__spreadValues({}, styles2), { display: "block", whiteSpace: "pre-line" })
          });
          el.append(description);
        }
        if (event.allDay) {
          const day = Div({ styles: styles2 });
          const dateIcon = icon3(calendarWeek);
          const localDay = convertMidnightUTCToLocalDay(event.start);
          const dayText = Span({
            attr: { innerHTML: `${formatDateTime(dateOptions, localDay)}` }
          });
          day.append(dateIcon);
          day.append(dayText);
          el.append(day);
        } else {
          const datesContainer = Div({ styles: styles2 });
          const endsSameDay = event.start.toDateString() === ((_b = event.end) == null ? void 0 : _b.toDateString());
          const dates = Div({
            styles: endsSameDay ? __spreadProps(__spreadValues({}, flexAlignItemsCenter), { width: "50%" }) : { display: "flex", alignItems: "flex-start" }
          });
          const datesIcon = icon3(endsSameDay ? calendarWeek : hourglassStart);
          const startDate = Span({
            attr: {
              innerHTML: `${formatDateTime(
                endsSameDay ? dateOptions : __spreadValues(__spreadValues({}, dateTimeOptions), addTimeZoneOptions),
                event.start
              )}`
            }
          });
          dates.append(datesIcon);
          dates.append(startDate);
          if (!endsSameDay) {
            const hourglassEndIcon = icon3(hourglassEnd);
            hourglassEndIcon.style.justifyContent = "flex-end";
            const endDateFormat = event.end ? `${formatDateTime(
              __spreadValues(__spreadValues({}, dateTimeOptions), addTimeZoneOptions),
              event.end
            )}` : "";
            const endDate = Span({ attr: { innerHTML: endDateFormat } });
            dates.append(hourglassEndIcon);
            dates.append(endDate);
          }
          datesContainer.append(dates);
          if (endsSameDay) {
            const times2 = Div({
              styles: __spreadProps(__spreadValues({}, flexAlignItemsCenter), { width: "50%" })
            });
            const timeIcon = icon3(clockIcon);
            const startTime = Span({
              attr: { innerHTML: `${formatDateTime(timeOptions, event.start)}` }
            });
            const toLabel = Label({
              attr: { innerHTML: "-" },
              styles: { padding: "0 8px" }
            });
            const endTimeFormat = event.end ? `${formatDateTime(
              __spreadValues(__spreadValues({}, timeOptions), addTimeZoneOptions),
              event.end
            )}` : "";
            const endTime = Span({ attr: { innerHTML: endTimeFormat } });
            times2.append(timeIcon);
            times2.append(startTime);
            times2.append(toLabel);
            times2.append(endTime);
            datesContainer.append(times2);
          }
          el.append(datesContainer);
        }
        const connect = Div({ styles: styles2 });
        const connectIcon = icon3(link);
        const connectLink = Span({
          attr: {
            innerHTML: es2015_default.link(
              `https://preview-iyris.cloud.engramhq.xyz/${event._id}`
            )
          }
        });
        connect.append(connectIcon);
        connect.append(connectLink);
        el.append(connect);
        const guests = Div({
          styles: __spreadProps(__spreadValues({}, styles2), { margin: "8px 0", alignItems: "flex-start" })
        });
        const usersList = ((_c = event.users) == null ? void 0 : _c.length) ? users2.filter((user) => {
          var _a2;
          return (_a2 = event.users) == null ? void 0 : _a2.includes(user._id);
        }) : users2;
        const oneGuest = usersList.length === 1;
        const guestsIcon = icon3(usersIcon);
        const guestsList = Div();
        const guestsLabel = Label({
          attr: { innerHTML: `Guest${oneGuest ? "" : "s"}:` }
        });
        guestsList.append(guestsLabel);
        usersList.map((user) => {
          const container = Div({
            styles: __spreadProps(__spreadValues({}, flexAlignItemsCenter), { margin: "12px 0" })
          });
          const userIcon = Div({
            styles: {
              display: "flex",
              flexShrink: "0",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              borderRadius: "999px",
              height: "30px",
              width: "30px",
              backgroundColor: user.color || "black",
              color: "white",
              textAlign: "center",
              lineHeight: "30px",
              marginRight: "10px",
              fontSize: "12px"
            }
          });
          const firstInitial = user.name.charAt(0);
          const lastInitial = user.name.split(" ")[1].charAt(0);
          userIcon.innerText = firstInitial + lastInitial;
          const name = Div({
            attr: {
              innerHTML: `${user.name} ${user._id === event.owner ? "(Organizer)" : ""}`
            }
          });
          container.append(userIcon);
          container.append(name);
          guestsList.append(container);
        });
        guests.append(guestsIcon);
        guests.append(guestsList);
        el.append(guests);
        function handleDeleteEvent(response) {
          return __async(this, null, function* () {
            const cancelDeleteEvent = response === ownerModalOptions[1];
            if (cancelDeleteEvent) {
              const modal = byId("modal");
              modal.remove();
              return;
            }
            const sendEmail = response === notificationModalOptions[0] ? true : false;
            try {
              yield deleteEvent(event._id, sendEmail);
              setURL("/");
            } catch (e) {
              const temporaryError = Div({
                attr: { innerText: "Could not delete event" }
              });
              el.append(temporaryError);
            }
          });
        }
      });
    }
    init2();
    return wrapper;
  }

  // src/apis/AuthApi.ts
  var logIn = (_0) => __async(void 0, [_0], function* ({ email, password }) {
    const res = yield fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      return !!res.ok;
    } else {
      throw new Error("Incorrect credentials.");
    }
  });
  var logOut = () => __async(void 0, null, function* () {
    const res = yield fetch("/api/users/logout");
    if (res.ok) {
      return !!res.ok;
    } else {
      throw new Error("Unable to log out.");
    }
  });

  // src/apis/PushNotificationApi.ts
  function getPublicKey() {
    return __async(this, null, function* () {
      const data = yield fetch("/api/subscriptions/publickey");
      const jsonData = yield data.json();
      return jsonData.publickey;
    });
  }
  function saveSubscription(subscription) {
    return __async(this, null, function* () {
      const response = yield fetch("/api/subscriptions", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "content-type": "application/json"
        }
      });
      return response.json();
    });
  }
  function deleteSubscription() {
    return __async(this, null, function* () {
      yield fetch("/api/subscriptions", {
        method: "DELETE",
        headers: {
          "content-type": "application/json"
        }
      });
    });
  }

  // src/services/PushNotificationService.ts
  var isSubscribed = false;
  var serviceWorker;
  function initializePushNotificationService() {
    return __async(this, null, function* () {
      if (!checkPushNotificationsSupport) {
        console.error("Push notifications are not supported");
        return;
      }
      try {
        const serviceWorkerRegistration = yield navigator.serviceWorker.register(
          "/service-worker.js"
        );
        serviceWorker = serviceWorkerRegistration;
        init();
      } catch (err) {
        console.error("Service worker error", err);
      }
    });
  }
  function checkPushNotificationsSupport() {
    return "serviceWorker" in navigator && "PushManager" in window;
  }
  function init() {
    return __async(this, null, function* () {
      try {
        const subscription = yield serviceWorker.pushManager.getSubscription();
        isSubscribed = !(subscription === null);
      } catch (err) {
        console.error(err);
      }
    });
  }
  function subscribeUser() {
    return __async(this, null, function* () {
      const applicationServerKey = urlBase64ToUint8Array(yield getPublicKey());
      try {
        const subscription = yield serviceWorker.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey
        });
        updateSubscriptionOnServer(subscription);
        isSubscribed = true;
      } catch (err) {
        console.error("Failed to subscribe the user: ", err);
      }
    });
  }
  function unsubscribeUser() {
    return __async(this, null, function* () {
      try {
        const subscription = yield serviceWorker.pushManager.getSubscription();
        yield subscription == null ? void 0 : subscription.unsubscribe();
        yield updateSubscriptionOnServer(null);
        isSubscribed = false;
      } catch (err) {
        console.log("Error unsubscribing", err);
      }
    });
  }
  function updateSubscriptionOnServer(subscription) {
    return __async(this, null, function* () {
      subscription ? yield saveSubscription(subscription) : yield deleteSubscription();
    });
  }
  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  function arePushNotificationsEnabled() {
    return isSubscribed;
  }

  // src/views/Header/Header.ts
  var headerButtonStyles = {
    background: "none",
    border: "none",
    color: basics.darkCharcoal,
    fontFamily: fonts.montserrat,
    fontWeight: "400",
    fontSize: "14px",
    marginLeft: "20px"
  };
  var todayButtonStyles = __spreadProps(__spreadValues({}, headerButtonStyles), {
    borderRadius: "4px",
    background: colors.mandarine,
    color: basics.whiteColor,
    padding: "8px 12px"
  });
  function Header(view, dateURL) {
    var _a;
    const isHome = view === "home";
    const isEvent = view === "event";
    const isEditEvent = view === "edit";
    const isAddEvent = view === "add";
    const isDay = view === "day";
    const showTopRightButton = !isAddEvent;
    const windowPath = window.location.pathname;
    const pathSplit = windowPath.split("/");
    const eventId = (_a = pathSplit[pathSplit.length - 1]) == null ? void 0 : _a.toString();
    const header = Div({
      styles: __spreadProps(__spreadValues({
        height: "80px",
        padding: "0 28px"
      }, flexAlignItemsCenter), {
        justifyContent: "flex-end",
        //not sure about this, added it last minute
        position: "sticky",
        width: "100%",
        zIndex: "1",
        top: "0"
      })
    });
    const logo = Div({
      styles: {
        display: "flex",
        alignItems: "center",
        marginRight: "auto",
        cursor: "pointer"
      },
      attr: { onclick: () => setURL("/") }
    });
    const image = document.createElement("img");
    image.src = "/assets/Logo.svg";
    const name = P({
      attr: { innerHTML: "Trentcrim" },
      styles: {
        marginLeft: "12px",
        fontFamily: "Poppins",
        fontSize: "18px"
      }
    });
    logo.append(image);
    logo.append(name);
    header.append(logo);
    const todayButton = Button({
      selectors: { id: "today-btn" },
      attr: {
        innerHTML: isHome ? "" : "Today",
        onclick: (e) => {
          e.preventDefault();
          onLeftButtonClick();
        },
        onmouseover: () => {
          const button = byId("today-btn");
          if (button) {
            button.style.backgroundColor = "#e8856a";
          }
        },
        onmouseout: () => {
          const button = byId("today-btn");
          if (button) {
            button.style.backgroundColor = colors.mandarine;
          }
        }
      },
      styles: isHome ? { display: "none" } : todayButtonStyles
    });
    header.append(todayButton);
    if (showTopRightButton) {
      const rightButton = Button({
        selectors: { id: "right-link" },
        attr: {
          innerHTML: "Add event",
          onclick: (e) => {
            e.preventDefault();
            onRightButtonClick();
          },
          onmouseover: () => {
            const button = byId("right-link");
            if (button) {
              button.style.color = "#d25635";
            }
          },
          onmouseout: () => {
            const button = byId("right-link");
            if (button) {
              button.style.color = basics.darkCharcoal;
            }
          }
        },
        styles: headerButtonStyles
      });
      header.append(rightButton);
    }
    const logoutButton = Button({
      selectors: {
        id: "logout"
      },
      attr: {
        textContent: "Log out",
        onclick: (e) => {
          e.preventDefault();
          try {
            logOut();
            window.location.reload();
          } catch (err) {
            console.error("Unable to log out.");
          }
        },
        onmouseover: () => {
          const button = byId("logout");
          if (button) {
            button.style.color = "#d25635";
          }
        },
        onmouseout: () => {
          const button = byId("logout");
          if (button) {
            button.style.color = basics.darkCharcoal;
          }
        }
      },
      styles: headerButtonStyles
    });
    isLoggedIn() && header.append(logoutButton);
    function onLeftButtonClick() {
      let nextURL = "/";
      if (isEvent) {
        nextURL = `/day/${dateURL}`;
      }
      if (isEditEvent) {
        nextURL = `/events/${eventId}`;
      }
      setURL(nextURL);
    }
    function onRightButtonClick() {
      if (window.location.pathname === "/") {
        setURL(`/add`);
      } else {
        setURL(`/add/${getDateStringFromUrl()}`);
      }
    }
    const pushNotificationsButton = Button({
      selectors: { id: "pushButton" },
      attr: {
        type: "button",
        innerHTML: buttonText(),
        disabled: buttonText() === "Push notifications blocked",
        onclick: (e) => __async(this, null, function* () {
          e.preventDefault();
          pushNotificationsButton.disabled = true;
          arePushNotificationsEnabled() ? yield unsubscribeUser() : yield subscribeUser();
          pushNotificationsButton.innerHTML = buttonText();
          pushNotificationsButton.disabled = false;
        })
      }
    });
    return header;
  }
  function buttonText() {
    if (Notification.permission === "denied") {
      unsubscribeUser();
      return "Push notifications blocked";
    }
    return `${arePushNotificationsEnabled() ? "Disable " : "Enable "} push notifications`;
  }

  // src/views/LogIn/LogIn.ts
  function LogIn() {
    let logInState = {
      email: "",
      password: ""
    };
    const form = Form({
      styles: {
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        margin: "40px"
      }
    });
    const email = formInput("email");
    const password = formInput("password");
    const error = Div({
      attr: {
        innerText: "Please provide correct email and password."
      }
    });
    const submitBtn = Button({
      attr: {
        type: "submit",
        textContent: "submit",
        onclick: (e) => __async(this, null, function* () {
          e.preventDefault();
          try {
            yield logIn(logInState);
            window.location.reload();
          } catch (err) {
            form.appendChild(error);
          }
        })
      }
    });
    form.appendChild(email);
    form.appendChild(password);
    form.appendChild(submitBtn);
    function formInput(field) {
      return Input({
        attr: {
          name: field,
          placeholder: field,
          type: field === "password" ? "password" : "text",
          onchange: (e) => {
            logInState[field] = e.target.value;
          }
        }
      });
    }
    return form;
  }

  // src/views/Day/DayGrid.ts/DayGrid.ts
  var hours = [
    "00",
    "1 AM",
    "2 AM",
    "3 AM",
    "4 AM",
    "5 AM",
    "6 AM",
    "7 AM",
    "8 AM",
    "9 AM",
    "10 AM",
    "11 AM",
    "12 PM",
    "1 PM",
    "2 PM",
    "3 PM",
    "4 PM",
    "5 PM",
    "6 PM",
    "7 PM",
    "8 PM",
    "9 PM",
    "10 PM",
    "11 PM"
  ];
  function DayGrid() {
    const el = Div({
      styles: {
        // maxWidth: '1000px',
        marginLeft: "auto",
        marginRight: "auto"
      }
    });
    function init2() {
      return __async(this, null, function* () {
        const gridContainer = Div();
        gridContainer.setAttribute(
          "style",
          // 'width: 100%; height: fit-content; display: flex;background-image: linear-gradient(to bottom, #114357, #F29492, #114357);'
          "width: 100%; height: fit-content; display: flex;"
        );
        const eventsGrid = Div();
        eventsGrid.setAttribute(
          "style",
          "position: relative; width: 90%; height: 100%;"
        );
        hours.map((hour) => {
          const timeContainer = Div({
            styles: {
              position: "relative",
              height: `${60 * 1}px`,
              width: "100%",
              display: "flex",
              justifyContent: "center"
            }
          });
          const divider = Div({
            styles: {
              position: "absolute",
              top: "0",
              height: "1px",
              width: "100%",
              background: basics.whiteColor,
              opacity: ".2"
            }
          });
          timeContainer.append(divider);
          eventsGrid.append(timeContainer);
        });
        const timeColumn = Div();
        timeColumn.setAttribute(
          "style",
          "width: 10%; height: 100%; display: flex; flex-direction: column; align-items: flex-end; color: #333; font-size: 14px;"
        );
        hours.map((hour) => {
          const timeContainer = Div({
            styles: {
              position: "relative",
              height: `${60 * 1}px`,
              width: "100%",
              display: "flex",
              justifyContent: "center"
            }
          });
          const divider = Div({
            styles: {
              position: "absolute",
              top: "0",
              height: "1px",
              width: "40%",
              right: "0",
              background: basics.whiteColor,
              opacity: ".2"
            }
          });
          const time = Div({
            attr: { innerHTML: hour },
            styles: {
              position: "absolute",
              top: "-10px",
              left: "5px",
              fontFamily: fonts.montserrat,
              color: basics.whiteColor,
              padding: "0 8px"
            }
          });
          timeContainer.append(divider);
          timeContainer.append(time);
          timeColumn.append(timeContainer);
        });
        gridContainer.append(timeColumn);
        gridContainer.append(eventsGrid);
        el.append(gridContainer);
        const events = yield getEventsForDay(new Date());
        events.forEach((event) => {
          if (!event.allDay) {
            const eventCard = createEventCard2(event);
            eventsGrid.appendChild(eventCard);
          }
        });
      });
    }
    init2();
    return el;
  }
  function createEventCard2(event) {
    const { _id, start, end: end3, title } = event;
    const eventCard = Div({
      styles: {
        width: "100%",
        maxWidth: "980px",
        position: "absolute",
        height: "100%",
        top: "0"
      }
    });
    const startTime = `${formatDateTime(timeOptions, start)} `;
    const endTime = `${formatDateTime(timeOptions, end3)}`;
    const eventInMinutes = Math.abs(end3 - start) / 6e4;
    const startTimeHour = start.getHours() * 60;
    const startTimeMinutes = start.getMinutes();
    const timeOffset = startTimeHour + startTimeMinutes;
    console.log("timeOffset", timeOffset);
    const eventTitle = Div({
      attr: {
        innerHTML: `${title} ${startTime} - ${endTime}`.replace(/\./g, ""),
        onclick: () => setURL(`/events/${_id}`)
      },
      styles: {
        backgroundColor: colors.keppel,
        color: basics.whiteColor,
        cursor: "pointer",
        fontFamily: fonts.montserrat,
        fontWeight: "300",
        padding: "12px",
        height: `${eventInMinutes * 1}px`,
        width: "100%",
        position: "absolute",
        top: `${timeOffset * 1}px`,
        borderRadius: "4px"
      }
    });
    eventCard.appendChild(eventTitle);
    return eventCard;
  }

  // src/views/Router.ts
  function Router(authenticated) {
    const router = Div({
      selectors: { id: "router" }
    });
    function init2() {
      handleRouteUpdated();
    }
    window.addEventListener("popstate", handleRouteUpdated);
    function handleRouteUpdated() {
      return __async(this, null, function* () {
        var _a;
        router.innerHTML = "";
        if (!authenticated) {
          return router.append(LogIn());
        }
        const path = window.location.pathname;
        const home2 = path === "/";
        const addEventPath = path.includes("add");
        const isDayPath = path.includes("day");
        const isDayGridPath = path.includes("grid");
        const eventsPaths = !home2 && !addEventPath && !isDayPath && !isDayGridPath;
        let eventObject;
        if (eventsPaths) {
          const eventPath = path.split("/");
          const eventId = (_a = eventPath[eventPath.length - 1]) == null ? void 0 : _a.toString();
          eventObject = yield getEventById(eventId);
          if (!eventObject) {
            setURL("/");
          }
        }
        let eventsDate = new Date().toDateString();
        if (isDayPath || addEventPath) {
          eventsDate = getDateStringFromUrl();
        }
        switch (path) {
          case "/":
            router.append(Header("home"));
            router.append(Day());
            break;
          case `/day/${eventsDate}`:
            router.append(Header("day"));
            router.append(Day(eventsDate));
            break;
          case `/grid`:
            router.append(Header("day"));
            router.append(DayGrid());
            break;
          case `/events/${eventObject == null ? void 0 : eventObject._id}`:
            if (eventObject) {
              const allDayDate = convertMidnightUTCToLocalDay(eventObject.start);
              const date = eventObject.allDay ? allDayDate : eventObject.start;
              const dateURL = formatSplitDate(date, "/", "yyyy-mm-dd");
              router.append(Header("event", dateURL));
              router.append(Event2(eventObject));
            }
            break;
          case `/events/edit/${eventObject == null ? void 0 : eventObject._id}`:
            if (eventObject) {
              router.append(Header("edit"));
              router.append(EventForm(eventObject));
            }
            break;
          case `/add`:
          case `/add/${eventsDate}`:
            router.append(Header("add"));
            router.append(EventForm());
            break;
          default:
            break;
        }
      });
    }
    init2();
    return router;
  }

  // src/app.ts
  function run() {
    return __async(this, null, function* () {
      const root = document.getElementById("root");
      yield Promise.all([initializePushNotificationService(), initializeUserApi()]);
      const isAuthenticated = isLoggedIn();
      if (root) {
        const router = Router(isAuthenticated);
        root.append(router);
      }
    });
  }
  run();
})();
