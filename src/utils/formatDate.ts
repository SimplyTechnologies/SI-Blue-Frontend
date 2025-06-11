export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);

  const timePart = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const datePart = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return `${timePart}, ${datePart}`;
};

export const formatDateShort = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return;

  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
  const yyyy = date.getFullYear();

  return `${dd}.${mm}.${yyyy}`;
};

