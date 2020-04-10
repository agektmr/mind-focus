import StereoPannerNode from 'stereo-panner-node';
import { Player } from './player';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

let player: Player;

// @ts-ignore
window.AudioContext = window.AudioContext||window.webkitAudioContext;
StereoPannerNode.polyfill();

const toggle = () => {
  if (!player) player = new Player();
  player.isPlaying ? stop() : start();
}
const toggleBtn: any = document.querySelector('#toggle');
toggleBtn.addEventListener('click', toggle);

const select: any = document.querySelector('#select');
select.addEventListener('change', e => {
  if (player?.isPlaying) restart();
  freqSlider.style.display = select.value === 'stereosignwave' ? 'block' : 'none';
})

const freqSlider: any = document.querySelector('#frequency');
freqSlider.addEventListener('change', e => {
  if (player?.isPlaying)
    player.changeFreq(freqSlider.value);
});

const volSlider: any = document.querySelector('#volume');
volSlider.addEventListener('change', e => {
  if (player?.isPlaying)
    player.changeVol(volSlider.value / 100);
});

document.addEventListener('keydown', e => {
  switch (e.key) {
    case ' ':
      toggle();
      break;
  }
});

const start = () => {
  toggleBtn.innerText = 'Stop';
  player.start(select.value, volSlider.value / 100);
  player.changeFreq(freqSlider.value);
}
const restart = () => {
  player.terminate();
  player.start(select.value, volSlider.value / 100);
  player.changeFreq(freqSlider.value);
}
const pause = () => {
  toggleBtn.innerText = 'Start';
  player.stop();
}
const stop = () => {
  toggleBtn.innerText = 'Start';
  player.stop();
}

// navigator.mediaSession.metadata = new MediaMetadata({
//   title: 'title',
//   artist: 'artist'
// });

// navigator.mediaSession.setActionHandler('play', start);
// navigator.mediaSession.setActionHandler('pause', pause);
// navigator.mediaSession.setActionHandler('stop', stop);
// navigator.mediaSession.setActionHandler('previoustrack', e => {
//   player.frequency--;
//   if (player.frequency < 144) player.frequency = 144;
//   player.changeFreq(player.frequency);
// });
// navigator.mediaSession.setActionHandler('nexttrack', e => {
//   player.frequency++;
//   if (player.frequency > 148) player.frequency = 148;
//   player.changeFreq(frequency);
// });
