import React from 'react';
import useCalendar from '../../src';
import { addDays } from 'date-fns';

import frLocale from 'date-fns/locale/fr';
import ruLocale from 'date-fns/locale/ru';
import enLocale from 'date-fns/locale/en-US';
import arLocale from 'date-fns/locale/ar-SA';
import { addEvent, removeEvent } from '../../src/date';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    
    setInterval(() => {
      this.setState({ render: true });
    }, 5000);

  }
  render() {
    return (
      <div>
        <Simple date={this.state.date} />
      </div>
    );
  }
}

function Simple({ date }) {

  // const { days, weeks, addEvent, removeEvent, setToday, getNextMonth, getPrevMonth } = useCalendar(null, {
  //   events: [
  //     { startDate: new Date(2019, 1, 27), endDate: new Date(2019, 1, 27),  note: "note #1" },
  //     { startDate: new Date(2019, 1, 22), endDate: new Date(2019, 1, 25),  note: "note #2" },
  //   ]
  // });
/*
      <button onClick={() => actions.getPrevMonth()}>
        get prev month
      </button>
      <button onClick={() => actions.getNextMonth()}>
        get next month
      </button>
      <button onClick={() => actions.setToday(new Date())}>
        set date to Date()
      </button>
      <button onClick={() => actions.addEvent({ startDate: new Date(2019, 1, 21), endDate: new Date(2019, 1, 21),  note: "add test" })}>
        add single date event
      </button>
      <button onClick={() => actions.removeEvent(1)}>
        remove event #1
      </button>
      <br /><br />
*/

  const [state, actions] = useCalendar(null, {
    events: [
      { startDate: new Date(2019, 1, 27), endDate: new Date(2019, 1, 27),  note: "note #1" },
      { startDate: new Date(2019, 1, 22), endDate: new Date(2019, 1, 25),  note: "note #2" },
    ]
  });

  console.log(state.weeks);

  return (
    <table>
      <thead>
        <tr>
          <td colSpan={5} style={{ textAlign: 'center' }}>
            <strong>{state.month} - {state.year}</strong>
          </td>
          <td colSpan={2} style={{ textAlign: 'right' }}>
            <button onClick={() => actions.getPrevMonth()}>
              &lt;
            </button>              
            <button onClick={() => actions.getNextMonth()}>
              &gt;
            </button>              
          </td>
        </tr>
        <tr>
          {state.days.map(day => <th key={day}>{day}</th>)}
        </tr>
      </thead>
      <tbody>
        {state.weeks.map((week, index) => 
          <tr key={index}>
            {week.map(day =>
              <td key={day.dayOfMonth} style={{ textAlign: 'center', backgroundColor: day.isToday ? '#ff0' : '#fff' }}>
                {day.dayOfMonth}
              </td>
            )}
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default App;
