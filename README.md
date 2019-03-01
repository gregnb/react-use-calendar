
# <img src="https://user-images.githubusercontent.com/19170080/53611182-98bcf200-3b9b-11e9-84c2-32f6432df340.png" height="20" /> react-use-calendar

Custom React Hook for implementing a calendar with events

[![Build Status](https://travis-ci.org/gregnb/react-use-calendar.svg?branch=master)](https://travis-ci.org/gregnb/react-use-calendar)
[![Coverage Status](https://coveralls.io/repos/github/gregnb/react-use-calendar/badge.svg?branch=master)](https://coveralls.io/github/gregnb/react-use-calendar?branch=master)
[![dependencies Status](https://david-dm.org/gregnb/react-use-calendar/status.svg)](https://david-dm.org/gregnb/react-use-calendar)
[![npm version](https://badge.fury.io/js/react-use-calendar.svg)](https://badge.fury.io/js/react-use-calendar)

<div align="center">
	<img src="https://user-images.githubusercontent.com/19170080/53612148-382fb400-3b9f-11e9-9643-34c58abce182.gif" height="240" />
</div>

## Installation

```
npm install react-use-calendar --save
```

## Demo

[![Edit react-use-calendar](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/y0jonx2xvz)


## Usage

```javascript
import React from 'react';
import useCalendar from 'react-use-calendar';

function App() {

  const [state, actions] = useCalendar(null, {
    events: [
      { 
        startDate: new Date(2019, 1, 27), 
        endDate: new Date(2019, 1, 27),  
        note: 'Meeting with clients' 
      },
      { 
        startDate: new Date(2019, 1, 22), 
        endDate: new Date(2019, 1, 25),
        note: 'Vacation'
      }
    ]
  });

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

```

## API

### useCalendar

```js
const [state, actions] = useCalendar(date, config);
```

### Parameters 

| Field     |    Type    | Description                                                                              |
| ------- | :--------: | ---------------------------------------------------------------------------------------- |
| date | `date`  | Initialize calendar with starting date                                                |
| config | `object`  | Configuration |

#### config

| Key     |    Type    | Description                                                                              |
| ------- | :--------: | ---------------------------------------------------------------------------------------- |
| events | `array`  | Calendar events as an array of objects. `[{ startDate: date, endDate: date, note: string }]`  |
| numOfWeeks | `number`  | Number of calendar weeks. `default: 6` |
| numOfDays | `number`  | Number of days per week. `default: 7` |
| rtl | `boolean`  | Enable right-to-left |
| locale | `object`  | [date-fns](https://date-fns.org/) locale |

### Returns 

#### state

| Key     |    Type    | Description                                                                              |
| ------- | :--------: | ---------------------------------------------------------------------------------------- |
| days | `array`  | Short names for days of week `['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']`                                                |
| weeks | `array`  | Weeks of calendar `[{ day: object }]`                                               |
| month | `string`  | Current month in full month format                                              |
| year | `number`  | Current year                                               |

```
{
  date: date,
  dayIndex: number,
  dayOfMonth: number,
  dayOfWeek: string,
  dayOfYear: number,
  events: array,
  isToday: boolean,
  isSameMonth: boolean,
  isWeekend: boolean,
  weekIndex: number
}
```

#### actions

| Key     |    Type    | Description                                                                              |
| ------- | :--------: | ---------------------------------------------------------------------------------------- |
| setDate     | `function` | Set current day for Calendar `function(today: date)` |
| getNextMonth     | `function` | Set calendar to next month |
| getPrevMonth     | `function` | Set calendar to previous month |
| addEvent     | `function` | Add an event to calendar. `function(event: { startDate: date, endDate: date, note: string })` |
| removeEvent     | `function` | Remove event from calendar `function(id: number)` |
 
## Localization

```javascript
import React from 'react';
import useCalendar from 'react-use-calendar';

import ruLocale from 'date-fns/locale/ru';

function App() {

  const [state, actions] = useCalendar(null, { locale: ruLocale });

  return (
    <div>
      ...
    </div>
  );
}

```

## License
The files included in this repository are licensed under the MIT license.
