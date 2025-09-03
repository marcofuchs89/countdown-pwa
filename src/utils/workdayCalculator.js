// Hilfsfunktion: Anzahl Arbeitstage zwischen zwei Daten (ohne Feiertage)
function isHoliday(date, holidaysSet) {
  return holidaysSet.has(date.toISOString().split("T")[0]);
}

// Arbeitstage zwischen zwei Daten (mit Feiertagen)
export function workdaysBetween(startDate, endDate, holidaysSet = new Set()) {
  let count = 0;
  let current = new Date(startDate);

  while (current <= endDate) {
    const day = current.getDay(); // 0 = Sonntag, 6 = Samstag
    if (day !== 0 && day !== 6 && !isHoliday(current, holidaysSet)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}


// Hilfsfunktion: Arbeitstage in einem vollen Jahr
export function workdaysInYear(year) {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  return workdaysBetween(start, end);
}

// Hilfsfunktion: Anteil eines Jahres (z. B. Jan–Jun = 0.5)
function fractionOfYear(startDate, endDate) {
  const yearDays = (endDate.getFullYear() % 4 === 0 ? 366 : 365);
  const dayOfYear = Math.ceil(
    (endDate - new Date(endDate.getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24)
  );
  return dayOfYear / yearDays;
}

// Hauptfunktion: verbleibende Arbeitstage unter Berücksichtigung Urlaub
export function calculateRemainingWorkdays(settings, today, endDate) {
  let total = 0;

  // 1. Aktuelles Jahr
  const endOfThisYear = new Date(today.getFullYear(), 11, 31);
  if (today.getFullYear() === endDate.getFullYear()) {
    // Ziel ist im selben Jahr
    total = workdaysBetween(today, endDate) - (settings.urlaubstage - settings.genommen) * fractionOfYear(today, endDate);
    return Math.max(total, 0);
  } else {
    // Rest dieses Jahres
    const workdaysThisYear = workdaysBetween(today, endOfThisYear);
    const remainingVacation = settings.urlaubstage - settings.genommen;
    total += workdaysThisYear - remainingVacation;
  }

  // 2. Ganze Jahre dazwischen
  for (let year = today.getFullYear() + 1; year < endDate.getFullYear(); year++) {
    total += workdaysInYear(year) - settings.urlaubstage;
  }

  // 3. Letztes Jahr (bis Ziel)
  const startOfLastYear = new Date(endDate.getFullYear(), 0, 1);
  const workdaysLastYear = workdaysBetween(startOfLastYear, endDate);
  const vacationFraction = settings.urlaubstage * fractionOfYear(startOfLastYear, endDate);
  total += workdaysLastYear - vacationFraction;

  return Math.max(Math.floor(total), 0);
}

import { fetchHolidays } from "./holidaysApi";

export async function calculateRemainingWorkdaysWithHolidays(settings, today, endDate) {
  let total = 0;
  let holidays = {};

  // Feiertage für alle betroffenen Jahre laden
  for (let year = today.getFullYear(); year <= endDate.getFullYear(); year++) {
    const holidayList = await fetchHolidays(year, settings.bundesland);
    holidays[year] = new Set(holidayList);
  }

  // 1. Aktuelles Jahr
  if (today.getFullYear() === endDate.getFullYear()) {
    const days = workdaysBetween(today, endDate, holidays[endDate.getFullYear()]);
    const urlaub = (settings.urlaubstage - settings.genommen) * fractionOfYear(today, endDate);
    return Math.max(Math.floor(days - urlaub), 0);
  } else {
    const endOfThisYear = new Date(today.getFullYear(), 11, 31);
    const workdaysThisYear = workdaysBetween(today, endOfThisYear, holidays[today.getFullYear()]);
    const remainingVacation = settings.urlaubstage - settings.genommen;
    total += workdaysThisYear - remainingVacation;
  }

  // 2. Ganze Jahre dazwischen
  for (let year = today.getFullYear() + 1; year < endDate.getFullYear(); year++) {
    const workdaysFullYear = workdaysBetween(new Date(year, 0, 1), new Date(year, 11, 31), holidays[year]);
    total += workdaysFullYear - settings.urlaubstage;
  }

  // 3. Letztes Jahr
  const startOfLastYear = new Date(endDate.getFullYear(), 0, 1);
  const workdaysLastYear = workdaysBetween(startOfLastYear, endDate, holidays[endDate.getFullYear()]);
  const vacationFraction = settings.urlaubstage * fractionOfYear(startOfLastYear, endDate);
  total += workdaysLastYear - vacationFraction;

  return Math.max(Math.floor(total), 0);
}

