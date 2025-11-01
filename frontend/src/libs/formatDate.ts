import { DateRange } from "react-day-picker";

export const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
};

export const formatDateRange = (dateRange: DateRange) => {
  return `${formatDate(dateRange.from?.toISOString() || "")} - ${formatDate(
    dateRange.to?.toISOString() || ""
  )}`;
};
