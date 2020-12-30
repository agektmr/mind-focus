import { StereoSineWave } from './stereo-sine-wave';
import { WhiteNoise } from './white-noise';

export class Player {
  private ctx: AudioContext
  private osc: WhiteNoise|StereoSineWave
  private pan1: PannerNode
  private pan2: PannerNode
  private gain: GainNode
  private type: string
  private frequency: number = 144
  private volume: number = 0.99
  public isPlaying: boolean = false

  constructor() {
    this.ctx = new AudioContext();
    this.gain = this.ctx.createGain();
    // Use PannerNode instead of StereoPannerNode for Safari compatibility
    this.pan1 = this.ctx.createPanner();
    this.pan1.panningModel = 'equalpower';
    this.pan1.setPosition(-1, 0, 0);
    this.pan1.connect(this.gain);
    this.pan2 = this.ctx.createPanner();
    this.pan2.panningModel = 'equalpower';
    this.pan2.setPosition(1, 0, 0);
    this.pan2.connect(this.gain);
    this.gain.connect(this.ctx.destination);
  }

  public start(
    type: string,
    vol: number = 0.99
  ): void {
    // this.ctx.suspend();
    delete this.osc;
    switch (type) {
      case 'whitenoise':
        this.osc = new WhiteNoise(this.ctx);
        break;
      case 'pinknoise':
        break;
      case 'stereosinewave':
      default:
        type = 'stereosinewave';
        this.osc = new StereoSineWave(this.ctx);
    }
    this.type = type;
    this.osc.connect(this.pan1, this.pan2);

    this.changeVol(vol);
    this.osc.start();
    this.ctx.resume();
    this.isPlaying = true;
  }

  public terminate(): void {
    this.osc.stop();
    this.isPlaying = false;
  }

  public stop(): void {
    this.changeVol(0.001);
    setTimeout(this.terminate.bind(this), 100);
  }

  public changeFreq(val: number): void {
    if (this.type === 'stereosinewave') {
      this.frequency = val;
      (<StereoSineWave>this.osc).changeFreq(this.frequency);
    }
  }

  public changeVol(val: number): void {
    this.volume = val;
    this.gain.gain.exponentialRampToValueAtTime(this.volume, this.ctx.currentTime+0.1);
  }
}
