export const isObjectEmpty = (obj: Record<string, unknown>) => {
  return !Object.keys(obj).length;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return;

  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
  const yyyy = date.getFullYear();

  return `${dd}.${mm}.${yyyy}`;
};
