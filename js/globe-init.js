import { getStations } from './stations.js';
import { setupPlayer } from './player.js';
import { loadCountryBorders } from './borders.js';
import { updateNowPlaying } from './ui.js';

console.log("✅ globe-init.js is running...");

const world = Globe()(document.getElementById('globeViz'))
  .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-night.jpg')
  .backgroundColor('#000')
  .pointOfView({ lat: 20, lng: 0, altitude: 2 });

loadCountryBorders(world);

getStations().then(stations => {
  if (stations.length === 0) {
    console.warn("❌ No stations fetched.");
    return;
  }

  world
    .pointsData(stations)
    .pointLat('lat')
    .pointLng('lng')
    .pointColor(d => d.country?.toLowerCase() === 'india' ? 'orange' : 'lime')
    .pointAltitude(0.01)
    .pointRadius(0.3)
    .onPointClick(station => {
      setupPlayer(station.url, station.name, stations); // ✅ send full list here!
      updateNowPlaying(station.name, station.country);
    });
});
