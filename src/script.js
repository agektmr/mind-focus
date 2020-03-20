import { MDCSelect } from '@material/select';
import { MDCSlider } from '@material/slider';
import { MDCRipple } from '@material/ripple';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

const buttonRipple = new MDCRipple(document.querySelector('.mdc-button'));
// const iconButtonRipple = new MDCRipple(document.querySelector('.mdc-icon-button'));
// iconButtonRipple.unbounded = true;

class StereoSignWave {
  #osc1
  #osc2
  constructor(ctx) {
    this.osc1 = new OscillatorNode(ctx);
    this.osc1.frequency.value = 144.0;
    this.osc2 = new OscillatorNode(ctx);
    this.osc2.frequency.value = 151.0;
  }

  start() {
    this.osc1.start();
    this.osc2.start();
  }

  connect(left, right) {
    this.osc1.connect(left);
    this.osc2.connect(right);
  }

  stop() {
    this.osc1.stop();
    this.osc1.disconnect();
    this.osc2.stop();
    this.osc2.disconnect();
  }

  changeFreq(val) {
    this.osc1.frequency.value = val;
  }
}

class WhiteNoise {
  #bufferSize = 4096
  #osc1
  #osc2
  constructor(ctx) {
    this.osc1 = ctx.createScriptProcessor(this.bufferSize, 1, 1);
    this.osc2 = ctx.createScriptProcessor(this.bufferSize, 1, 1);
  }

  start() {
    this.osc1.addEventListener('audioprocess', this.audioprocess);
    this.osc2.addEventListener('audioprocess', this.audioprocess);
  }

  connect(left, right) {
    this.osc1.connect(left);
    this.osc2.connect(right);
  }

  stop() {
    this.osc1.removeEventListener('audioprocess', this.audioprocess);
    this.osc1.disconnect();
    this.osc2.removeEventListener('audioprocess', this.audioprocess);
    this.osc2.disconnect();
  }

  audioprocess(e) {
    let output = e.outputBuffer.getChannelData(0);
    for (let i = 0; i < this.bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
  }
}

class Player {
  #ctx
  #osc
  #pan1
  #pan2
  #gain
  frequency = 144
  volume = 0.99
  isPlyaing = false

  constructor() {
    window.AudioContext = window.AudioContext||window.webkitAudioContext;

    this.ctx = new AudioContext();
    this.gain = new GainNode(this.ctx);
    this.pan1 = new StereoPannerNode(this.ctx);
    this.pan1.pan.value = -1;
    this.pan1.connect(this.gain);
    this.pan2 = new StereoPannerNode(this.ctx);
    this.pan2.pan.value = 1;
    this.pan2.connect(this.gain);
    this.gain.connect(this.ctx.destination);
  }

  start (type, vol = 0.99) {
    this.ctx.suspend();
    delete this.osc;
    switch (type) {
      case 'whitenoise':
        this.osc = new WhiteNoise(this.ctx);
        break;
      case 'pinknoise':
        break;
      case 'stereosignwave':
      default:
        type = 'stereosignwave';
        this.osc = new StereoSignWave(this.ctx);
    }
    this.type = type;
    this.osc.connect(this.pan1, this.pan2);

    this.changeVol(vol);
    this.osc.start();
    this.ctx.resume();
    this.isPlaying = true;
  }

  terminate() {
    this.osc.stop();
    this.isPlaying = false;
  }

  stop() {
    this.changeVol(0.001);
    setTimeout(this.terminate.bind(this), 100);
  }

  changeFreq(val) {
    if (this.type === 'stereosignwave') {
      this.frequency = val;
      this.osc.changeFreq(val);
    }
  }

  changeVol(val) {
    this.volume = val;
    this.gain.gain.exponentialRampToValueAtTime(this.volume, this.ctx.currentTime+0.1);
  }
}

const toggle = () => {
  if (player.isPlaying) {
    stop();
  } else {
    start();
  }
}

const start = () => {
  toggleBtn.innerText = 'Stop';
  player.start(select.value, parseFloat(volSlider.value) / 100);
  player.changeFreq(parseFloat(freqSlider.value));
}
const restart = () => {
  player.terminate();
  player.start(select.value, parseFloat(volSlider.value) / 100);
  player.changeFreq(parseFloat(freqSlider.value));
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

let player = new Player();

const toggleBtn = document.querySelector('#toggle');
toggleBtn.addEventListener('click', toggle);

const select = new MDCSelect(document.querySelector('#select'));
select.listen('MDCSelect:change', e => {
  if (player.isPlaying) {
    restart();
  }
  if (select.value === 'stereosignwave') {
    freq.style.display = 'block';
  } else {
    freq.style.display = 'none';
  }
})

const freq = document.querySelector('#freq');
const freqSlider = new MDCSlider(freq);
freqSlider.listen('MDCSlider:input', e => {
  player.changeFreq(parseFloat(freqSlider.value));
});

const volSlider = new MDCSlider(document.querySelector('#volume'));
volSlider.listen('MDCSlider:input', e => {
  player.changeVol(parseFloat(volSlider.value) / 100);
});

document.addEventListener('keydown', e => {
  switch (e.key) {
    case ' ':
      toggle();
      break;
  }
});

