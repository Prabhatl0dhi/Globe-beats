let audio = new Audio();
let currentIndex = -1;
let stationList = [];

audio.autoplay = true;
audio.controls = false;
audio.style.display = 'none';
document.body.appendChild(audio);

export function setupPlayer(streamUrl, stationName, list = null) {
  const nowPlaying = document.getElementById('nowPlaying');
  nowPlaying.textContent = `⏳ Loading ${stationName}...`;

  audio.pause();
  audio.src = streamUrl;

  audio.onerror = () => {
    nowPlaying.textContent = `⚠️ Failed to play: ${stationName}`;
    console.error("❌ Playback error for:", streamUrl);
  };

  audio.oncanplay = () => {
    nowPlaying.textContent = `🎶 Now Playing: ${stationName}`;
  };

  audio.play().catch(err => {
    nowPlaying.textContent = `⚠️ Audio play failed`;
    console.error("🎧 Audio play error:", err);
  });

  if (list) {
    stationList = list;
    const foundIndex = list.findIndex(s => s.url === streamUrl);
    currentIndex = foundIndex !== -1 ? foundIndex : 0;
  }
}

function playStation(index) {
  if (!stationList.length) return;
  const station = stationList[index];
  if (station) {
    setupPlayer(station.url, station.name, stationList);
  }
}

function setupControls() {
  const prevBtn = document.getElementById('prevBtn');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const nextBtn = document.getElementById('nextBtn');
  const randomBtn = document.getElementById('randomBtn');

  if (!prevBtn || !playPauseBtn || !nextBtn || !randomBtn) return;

  prevBtn.onclick = () => {
    if (stationList.length) {
      currentIndex = (currentIndex - 1 + stationList.length) % stationList.length;
      playStation(currentIndex);
    }
  };

  nextBtn.onclick = () => {
    if (stationList.length) {
      currentIndex = (currentIndex + 1) % stationList.length;
      playStation(currentIndex);
    }
  };

  randomBtn.onclick = () => {
    if (stationList.length) {
      currentIndex = Math.floor(Math.random() * stationList.length);
      playStation(currentIndex);
    }
  };

  playPauseBtn.onclick = () => {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };
}

window.addEventListener('DOMContentLoaded', setupControls);
