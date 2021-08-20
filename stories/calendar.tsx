import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { useCallback, useState } from "react";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";

export const StaticDatePicker = (): JSX.Element => {
  let [selectedDate, setSelectedDate] = useState<Date | null>(new Date("2014-08-18T21:11:54"));

  let handleDateChange = useCallback((date: Date | null) => {
    setSelectedDate(date);
  }, []);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        autoOk
        orientation="landscape"
        variant="static"
        openTo="date"
        margin="normal"
        id="date-picker"
        label="Date picker"
        format="MM/dd/yyyy"
        value={selectedDate}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          "aria-label": "change date",
        }}
      />
    </MuiPickersUtilsProvider>
  );
};
