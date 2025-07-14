export async function getStations() {
  const api = 'https://de1.api.radio-browser.info/json/stations?hidebroken=true';

  try {
    const res = await fetch(api);
    const data = await res.json();

    console.log("📡 Fetched stations:", data.length);

    const validStations = data
      .map(s => {
        const lat = parseFloat(s.geo_lat);
        const lng = parseFloat(s.geo_long);
        const url = s.url_resolved || s.url;

        if (!url || isNaN(lat) || isNaN(lng)) return null;

        // ❌ Skip unsupported formats
        if (
          url.includes('.m3u8') ||
          url.startsWith('rtmp') ||
          url.includes('.asf') ||
          url.includes('.wma') ||
          url.includes('.ram') ||
          url.includes('.pls')
        ) {
          return null;
        }

        return {
          name: s.name,
          url,
          lat,
          lng,
          country: s.country?.trim()
        };
      })
      .filter(Boolean);

    console.log("✅ Valid stations after filter:", validStations.length);

    // 🇮🇳 Boost Indian stations
    const indianStations = shuffle(validStations.filter(s => s.country?.toLowerCase() === 'india')).slice(0, 20);
    const globalStations = shuffle(validStations.filter(s => s.country?.toLowerCase() !== 'india')).slice(0, 480);

    const combinedStations = [...indianStations, ...globalStations];

    console.log("🇮🇳 Indian stations selected:", indianStations.length);
    console.log("🌍 Global stations selected:", globalStations.length);
    console.log("🎯 Total used for globe:", combinedStations.length);

    return combinedStations;
  } catch (err) {
    console.error("❌ Failed to load stations:", err);
    return [];
  }
}

// 🔀 Simple array shuffle
function shuffle(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}
