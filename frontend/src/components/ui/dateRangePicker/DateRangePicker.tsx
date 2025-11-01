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
  const handleSelect = (range: DateRange | undefined) => {
    onDateRangeChange(range);
  };

  return (
    <DayPicker
      mode="range"
      selected={defaultDateRange}
      locale={ptBR}
      onSelect={handleSelect}
    />
  );
}
