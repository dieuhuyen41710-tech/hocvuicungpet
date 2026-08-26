export const isPetSleeping = (sleepStart: string, sleepEnd: string): boolean => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  const [startHour, startMinute] = sleepStart.split(':').map(Number);
  const [endHour, endMinute] = sleepEnd.split(':').map(Number);
  
  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;

  if (startTime < endTime) {
    return currentTime >= startTime && currentTime <= endTime;
  } else {
    // Crosses midnight
    return currentTime >= startTime || currentTime <= endTime;
  }
};
