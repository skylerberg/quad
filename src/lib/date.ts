export const currentDayIndex = (): number => {
  const start = new Date(2025, 4, 27); // May 27th, 2025
  const now = new Date();
  const millisecondsBetween = Number(now) - Number(start);
  const millisecondsInADay = (1000 * 60 * 60 * 24);
  return Math.floor(millisecondsBetween / millisecondsInADay);
}
