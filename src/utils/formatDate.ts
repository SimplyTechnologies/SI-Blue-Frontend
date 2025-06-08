const formatDate = (dateStr: string) => {
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
}

export default formatDate;