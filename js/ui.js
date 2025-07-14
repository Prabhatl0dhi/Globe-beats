export function updateNowPlaying(name) {
  const el = document.getElementById('nowPlaying');
  el.textContent = `🎶 Now Playing: ${name}`;
}
