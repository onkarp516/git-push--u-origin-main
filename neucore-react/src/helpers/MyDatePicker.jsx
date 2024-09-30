import React, { useState } from "react";

// import DatePicker, { getYear, getMonth, range } from 'react-datepicker';
import DatePicker from "react-datepicker";
// import getYear from 'date-fns/getYear';
// import getMonth from 'date-fns/getMonth';
import "react-datepicker/dist/react-datepicker.css";
import MaskedTextInput from "react-text-mask";

function MyDatePicker(props) {
  // const [startDate, setStartDate] = useState(new Date());
  // const years = range(1990, getYear(new Date()) + 1, 1);
  // const months = [
  //   'January',
  //   'February',
  //   'March',
  //   'April',
  //   'May',
  //   'June',
  //   'July',
  //   'August',
  //   'September',
  //   'October',
  //   'November',
  //   'December',
  // ];
  return (
    <div>
      <DatePicker
        customInput={
          <MaskedTextInput
            mask={[/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]}
          />
        }
        {...props}
        //  / showMonthDropdown
        // showYearDropdown
      />

      {/* <DatePicker
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div
            style={{
              margin: 10,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
              {'<'}
            </button>
            <select
              value={getYear(date)}
              onChange={({ target: { value } }) => changeYear(value)}
            >
              {years.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              value={months[getMonth(date)]}
              onChange={({ target: { value } }) =>
                changeMonth(months.indexOf(value))
              }
            >
              {months.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
              {'>'}
            </button>
          </div>
        )}
        selected={startDate}
        onChange={(date) => setStartDate(date)}
      /> */}
    </div>
  );
}

export { MyDatePicker };
