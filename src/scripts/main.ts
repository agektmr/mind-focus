import { MDCSelect } from '@material/select';
import { MDCSlider } from '@material/slider';
import { MDCRipple } from '@material/ripple';
import StereoPannerNode from 'stereo-panner-node';
import { Player } from './player';

const toggleBtn: HTMLElement = document.querySelector('#toggle');
new MDCRipple(toggleBtn);
const toggleIcon: HTMLElement = document.querySelector('#toggle_icon');
const select = new MDCSelect(document.querySelector('#select'));
const freq: HTMLElement = document.querySelector('#freq');
const freqSlider = new MDCSlider(freq);
const volSlider = new MDCSlider(document.querySelector('#volume'));

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
toggleBtn.addEventListener('click', toggle);

select.listen('MDCSelect:change', e => {
  if (player?.isPlaying) restart();
  freq.style.display = select.value === 'stereosignwave' ? 'block' : 'none';
})

freqSlider.listen('MDCSlider:input', e => {
  player?.changeFreq(freqSlider.value);
});

volSlider.listen('MDCSlider:input', e => {
  player?.changeVol(volSlider.value / 100);
});

document.addEventListener('keydown', e => {
  switch (e.key) {
    case ' ':
      toggle();
      break;
  }
});

const start = () => {
  toggleIcon.innerText = 'pause';
  player.start(select.value, volSlider.value / 100);
  player.changeFreq(freqSlider.value);
}
const restart = () => {
  player.terminate();
  player.start(select.value, volSlider.value / 100);
  player.changeFreq(freqSlider.value);
}
const pause = () => {
  toggleIcon.innerText = 'play_arrow';
  player.stop();
}
const stop = () => {
  toggleIcon.innerText = 'play_arrow';
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
