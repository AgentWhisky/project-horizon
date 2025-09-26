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
