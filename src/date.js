import {
  addDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  getDate,
  getDayOfYear,
  getMonth,
  getYear,
  isSameDay,
  isSameMonth,
  isWeekend,
  startOfWeek,
} from 'date-fns';

function omitKey(data, key) {
  const { [key]: omit, ...other } = data; // eslint-disable-line no-unused-vars
  return other;
}

function transformDate(startDate, date, locale) {
  return {
    date,
    dayOfWeek: format(date, 'EEEE', { locale }),
    dayOfYear: getDayOfYear(date),
    dayOfMonth: getDate(date),
    isToday: isSameDay(new Date(), date),
    isSameMonth: isSameMonth(date, startDate),
    isWeekend: isWeekend(date),
  };
}

function getDateKey(date) {
  return format(date, 'M-dd-yy');
}

function getEventsForDate(date, events, eventsIndex) {
  const dateKey = getDateKey(date);
  const dateEvents = eventsIndex[dateKey];

  return dateEvents
    ? dateEvents.map(id => ({ id, ...omitKey(events[id], 'dates'), isMultiDayEvent: events[id].dates.length > 1 }))
    : [];
}

function addEvent(newEvent, prevEvents) {
  const addedEvent = createEvents({ events: [newEvent] }, prevEvents);
  return { ...addedEvent, ...getDays(prevEvents.startDate, { ...prevEvents, ...addedEvent }) };
}

function removeEvent(id, { startDate, events, options }) {
  const cleanEvents = [...events];
  cleanEvents.splice(id, 1);

  const newEvents = createEvents({ events: cleanEvents }, { events: [], eventsIndex: {} });
  const days = getDays(startDate, { options, ...newEvents });

  return {
    ...newEvents,
    ...days,
  };
}

function createEvents({ events }, prevEvents) {
  if (!events) return;

  let newEvents = [...prevEvents.events];
  let newEventsIndex = { ...prevEvents.eventsIndex };

  events.forEach(event => {
    let dates = [];

    eachDayOfInterval({ start: event.startDate, end: event.endDate }).forEach(day => {
      const dateKey = getDateKey(day);
      const index = newEvents.length;
      if (!events[dateKey]) newEventsIndex[dateKey] = [];
      newEventsIndex[dateKey].push(index);
      dates.push(dateKey);
    });

    newEvents.push({ ...event, dates });
  });

  return { events: newEvents, eventsIndex: newEventsIndex };
}

function getDays(date, { options, events, eventsIndex }) {
  let currentDate = startOfWeek(new Date(getYear(date), getMonth(date)));
  const weeks = Array.from({ length: options.numOfWeeks }).map((_, weekIndex) => {
    const days = Array.from({ length: options.numOfDays }).map((_, dayIndex) => {
      const day = transformDate(date, currentDate, options.locale);
      const dayEvents = getEventsForDate(currentDate, events, eventsIndex);
      currentDate = addDays(currentDate, 1);
      return { dayIndex, weekIndex, events: dayEvents, ...day };
    });
    return options.rtl ? days.reverse() : days;
  });

  const days = eachDayOfInterval({ start: startOfWeek(currentDate), end: endOfWeek(currentDate) }).map(day =>
    format(day, 'EEE', { locale: options.locale }),
  );

  return {
    startDate: date,
    month: format(date, 'LLLL'),
    year: getYear(date),
    weeks,
    days,
  };
}

export { getDays, addEvent, removeEvent, createEvents };
