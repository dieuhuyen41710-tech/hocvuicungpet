export const isPetSleeping = (sleepStart?: string, sleepEnd?: string): boolean => {
  if (!sleepStart || !sleepEnd || typeof sleepStart !== 'string' || typeof sleepEnd !== 'string') {
    return false;
  }
  
  try {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const startParts = sleepStart.split(':');
    const endParts = sleepEnd.split(':');
    if (startParts.length < 2 || endParts.length < 2) return false;

    const startHour = Number(startParts[0]);
    const startMinute = Number(startParts[1]);
    const endHour = Number(endParts[0]);
    const endMinute = Number(endParts[1]);
    
    if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) {
      return false;
    }

    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    if (startTime < endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Crosses midnight
      return currentTime >= startTime || currentTime <= endTime;
    }
  } catch {
    return false;
  }
};
