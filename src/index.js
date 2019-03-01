import { useEffect, useReducer } from 'react';
import { addDays, format } from 'date-fns';
import { getDays, createEvents, addEvent, removeEvent } from './date';
import * as actionTypes from './types';

const initialState = {
  startDate: null,
  month: null,
  days: [],
  weeks: [],
  events: [],
  eventsIndex: {},
  options: {
    numOfWeeks: 6,
    numOfDays: 7,
    rtl: false,
    locale: undefined,
  },
};

function dateDep(date) {
  return date ? format(date, 'yyyy-MM-dd') : null;
}

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_OPTIONS:
      return { ...state, ...createEvents(action.options, state), options: { ...state.options, ...action.options } };
    case actionTypes.SET_DATE:
      return { ...state, ...getDays(action.date, state) };
    case actionTypes.GET_NEXT_MONTH:
      return { ...state, ...getDays(addDays(state.startDate, 30), state) };
    case actionTypes.GET_PREV_MONTH:
      return { ...state, ...getDays(addDays(state.startDate, -30), state) };
    case actionTypes.ADD_EVENT:
      return { ...state, ...addEvent(action.event, state) };
    case actionTypes.REMOVE_EVENT:
      return { ...state, ...removeEvent(action.id, state) };
    default:
      return state;
  }
}

function initialize(date, options) {
  const events = {
    ...initialState,
    ...createEvents(options, initialState),
    options: { ...initialState.options, ...options },
  };
  return {
    ...events,
    ...getDays(date, events),
  };
}

function useCalendar(date, options = {}) {
  const [state, dispatch] = useReducer(reducer, initialState, () => initialize(date || new Date(), options));
  const { days, weeks, month, year } = state;

  useEffect(() => {
    return () => dispatch({ type: actionTypes.SET_DATE, date });
  }, [dateDep(date)]);

  return [
    { days, weeks, month, year },
    {
      setDate: date => dispatch({ date, type: actionTypes.SET_DATE }),
      getNextMonth: () => dispatch({ type: actionTypes.GET_NEXT_MONTH }),
      getPrevMonth: () => dispatch({ type: actionTypes.GET_PREV_MONTH }),
      addEvent: event => dispatch({ event, type: actionTypes.ADD_EVENT }),
      removeEvent: id => dispatch({ id, type: actionTypes.REMOVE_EVENT }),
    },
  ];
}

export default useCalendar;
