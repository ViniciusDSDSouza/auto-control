import { useState, useEffect } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import "./style.css";
import { ptBR } from "date-fns/locale";

interface DateRangePickerProps {
  defaultDateRange?: DateRange;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
}

export function DateRangePicker({
  defaultDateRange,
  onDateRangeChange,
}: DateRangePickerProps) {
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>(
    defaultDateRange
  );

  useEffect(() => {
    if (onDateRangeChange) {
      onDateRangeChange(selectedDate);
    }
  }, [selectedDate, onDateRangeChange]);

  return (
    <DayPicker
      mode="range"
      selected={selectedDate}
      locale={ptBR}
      onSelect={setSelectedDate}
    />
  );
}
