export const formatDuration = (milliseconds) => {
  const MS_IN_SECOND = 1000;
  const SECONDS_IN_MINUTE = 60;
  const MINUTES_IN_HOUR = 60;
  const HOURS_IN_DAY = 24;
  const msInMinute = MS_IN_SECOND * SECONDS_IN_MINUTE;
  const msInHour = msInMinute * MINUTES_IN_HOUR;
  const msInDay = msInHour * HOURS_IN_DAY;

  const fullDays = Math.trunc(milliseconds / msInDay);
  const fullHours = Math.trunc((milliseconds - msInDay * fullDays) / msInHour);
  const fullMinutes = Math.trunc((milliseconds - msInDay * fullDays - msInHour * fullHours) / msInMinute);

  if (fullDays === 0 && fullHours === 0) {
    return `${fullMinutes}M`;
  }

  if (fullDays === 0) {
    return `${fullHours}H ${fullMinutes}M`;
  }

  return `${fullDays}D ${fullHours}H ${fullMinutes}M`;
};

