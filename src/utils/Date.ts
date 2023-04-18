export const formatDateDDStrMonthYYYY = (date: string): string => {
  const dateObj = new Date(date);
  const month = dateObj.toLocaleString('default', { month: 'short' });
  return `${dateObj.getDate()} ${month} ${dateObj.getFullYear()}`;
};
