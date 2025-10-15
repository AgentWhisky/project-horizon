export function formatET(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/New_York',
    hour12: true,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  };

  const formatted = new Intl.DateTimeFormat('en-US', options).format(date);

  return formatted;
}

export function formatETFromNow(msFromNow: number): string {
  return formatET(new Date(Date.now() + msFromNow));
}

export function getFilenameTimestamp(date: Date = new Date()) {
  const year = date.getFullYear();
  const month = leftPad(date.getMonth() + 1);
  const day = leftPad(date.getDate());
  const hours = leftPad(date.getHours());
  const minutes = leftPad(date.getMinutes());
  const seconds = leftPad(date.getSeconds());

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

function leftPad(n: number) {
  return n.toString().padStart(2, '0');
}
