import { renderHook, cleanup, act } from 'react-hooks-testing-library'
import useCalendar from '../src';
import { setDate } from 'date-fns';

afterEach(cleanup);

describe('useCalendar initialization', () => {
  test('initializing with no date or config', () => {
    const { result } = renderHook(() => useCalendar(null));
    const [state] = result.current;
    expect(state.weeks.length).toBe(6);
  });

  test('initializing with date and no config', () => {
    const { result } = renderHook(() => useCalendar(new Date()));
    const [state] = result.current;
    expect(state.weeks.length).toBe(6);
  });

  test('initializing with date and config { rtl: true }', () => {
    const { result } = renderHook(() => useCalendar(new Date(2019, 1, 15), { rtl: true }));
    const [state] = result.current;
    expect(state.weeks[0][0]['dayOfMonth']).toBe(2);
  });

  test('initializing with date and config { rtl: false }', () => {
    const { result } = renderHook(() => useCalendar(new Date(2019, 1, 15), { rtl: false }));
    const [state] = result.current;
    expect(state.weeks[0][0]['dayOfMonth']).toBe(27);
  });

  test('initializing with date and config { numOfWeeks: 5, numOfDays: 5 }', () => {
    const { result } = renderHook(() => useCalendar(new Date(2019, 1, 15), { numOfWeeks: 5, numOfDays: 5 }));
    const [state] = result.current;
    expect(state.weeks.length).toBe(5);
    expect(state.weeks[0][0]['dayOfMonth']).toBe(27);
    expect(state.weeks[4][0]['dayOfMonth']).toBe(16);
  });

});

describe('useCalendar actions', () => {

  test('calling setDate action', () => {
    const { result } = renderHook(() => useCalendar(null));
    let [_, actions] = result.current;

    act(() => actions.setDate(new Date(2019, 3, 15)));

    let [state] = result.current; 
    const { weeks } = state;
    expect(weeks[0][0]['dayOfWeek']).toBe('Sunday');
    expect(weeks[0][0]['dayOfMonth']).toBe(31);
  });

  test('calling getPrevMonth action', () => {
    const { result } = renderHook(() => useCalendar(new Date(2019, 3, 15, 0, 0, 0, 0)));
    let [state, actions] = result.current;
    let weeks = state.weeks;

    expect(weeks[0][0]['dayOfWeek']).toBe('Sunday');
    expect(weeks[0][0]['dayOfYear']).toBe(90);
    
    act(() => actions.getPrevMonth());
    let [newState] = result.current; 
    weeks = newState.weeks;

    expect(weeks[0][0]['dayOfWeek']).toBe('Sunday');
    expect(weeks[0][0]['dayOfYear']).toBe(55);

  });

  test('calling getNextMonth action', () => {
    const { result } = renderHook(() => useCalendar(new Date(2019, 3, 15, 0, 0, 0, 0)));
    let [state, actions] = result.current;
    let weeks = state.weeks;

    expect(weeks[0][0]['dayOfWeek']).toBe('Sunday');
    expect(weeks[0][0]['dayOfYear']).toBe(90);
    
    act(() => actions.getNextMonth());
    let [newState] = result.current; 
    weeks = newState.weeks;

    expect(weeks[0][0]['dayOfWeek']).toBe('Sunday');
    expect(weeks[0][0]['dayOfYear']).toBe(118);

  });

  test('calling addEvent action', () => {
    const { result } = renderHook(() => useCalendar(new Date(2019, 3, 15, 0, 0, 0, 0)));
    let [state, actions] = result.current;
    let weeks = state.weeks;

    expect(weeks[0][0]['dayOfWeek']).toBe('Sunday');
    expect(weeks[0][0]['dayOfYear']).toBe(90);
    
    const event = { startDate: new Date(2019, 3, 12), endDate: new Date(2019, 3, 12), note: "test" };
    act(() => actions.addEvent(event));
    let [newState] = result.current; 
    weeks = newState.weeks;

    expect(weeks[1][5].events).toEqual([ { ...event, id: 0, isMultiDayEvent: false }]);

  });

  test('calling addEvent action', () => {

    const eventOne = { startDate: new Date(2019, 3, 12), endDate: new Date(2019, 3, 12), note: "test #1" };
    const eventTwo = { startDate: new Date(2019, 3, 22), endDate: new Date(2019, 3, 25),  note: "test #2" };

    const { result } = renderHook(() => useCalendar(new Date(2019, 3, 15, 0, 0, 0, 0), {
      events: [eventOne, eventTwo]
    }));
    let [state, actions] = result.current;
    let weeks = state.weeks;

    expect(weeks[0][0]['dayOfWeek']).toBe('Sunday');
    expect(weeks[0][0]['dayOfYear']).toBe(90);
    expect(weeks[1][5].events).toEqual([ { ...eventOne, id: 0, isMultiDayEvent: false }]);

    // now remove event
    const eventId = weeks[3][2].events[0].id;
    act(() => actions.removeEvent(eventId));
    let [newState] = result.current; 
    weeks = newState.weeks;

    expect(weeks[3][2].events.length).toBe(0);

  });

});
