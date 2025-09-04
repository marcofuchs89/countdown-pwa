// Holt Feiertage für ein Jahr und ein Bundesland mit Cache in LocalStorage
export async function fetchHolidays(year, bundesland) {
  const cacheKey = `holidays_${year}_${bundesland}`;

  // 1. Prüfen ob Cache existiert
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      console.warn("Fehler beim Lesen aus Cache, lade API neu...");
    }
  }

  // 2. API-Abfrage
  const url = `https://feiertage-api.de/api/?jahr=${year}&nur_land=${bundesland}`;
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      console.warn("Feiertage API nicht erreichbar, nutze Cache wenn vorhanden.");
      return cached ? JSON.parse(cached) : [];
    }

    const data = await resp.json();
    const holidays = Object.values(data).map(entry => entry.datum); // Liste mit "YYYY-MM-DD"

    // 3. Im Cache speichern
    localStorage.setItem(cacheKey, JSON.stringify(holidays));

    return holidays;
  } catch (err) {
    console.error("Fehler beim Laden der Feiertage:", err);
    return cached ? JSON.parse(cached) : [];
  }
}
