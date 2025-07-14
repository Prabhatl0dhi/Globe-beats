// borders.js

export function loadCountryBorders(world) {
  fetch('https://unpkg.com/world-atlas@2/countries-110m.json')
    .then(res => res.json())
    .then(worldData => {
      const countries = topojson.feature(worldData, worldData.objects.countries).features;

      world
        .polygonsData(countries)
        .polygonCapColor(feat => {
          const indiaCode = 356; // ISO numeric code for India
          return feat.id === indiaCode
            ? 'rgba(0, 200, 0, 0.5)' // Highlight India in green
            : 'rgba(255, 255, 255, 0.05)'; // Others very transparent
        })
        .polygonSideColor(() => 'rgba(0, 100, 255, 0.1)')
        .polygonStrokeColor(feat => feat.id === 356 ? '#0f0' : '#444')
        .polygonAltitude(feat => feat.id === 356 ? 0.015 : 0.005);
    });
}
