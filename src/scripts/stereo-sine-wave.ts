export class StereoSineWave {
  private osc1: OscillatorNode
  private osc2: OscillatorNode

  constructor(ctx: AudioContext) {
    this.osc1 = ctx.createOscillator();
    this.osc1.frequency.value = 144.0;
    this.osc2 = ctx.createOscillator();
    this.osc2.frequency.value = 151.0;
  }

  public start(): void {
    this.osc1.start();
    this.osc2.start();
  }

  public connect(
    left: AudioNode,
    right: AudioNode
  ): void {
    this.osc1.connect(left);
    this.osc2.connect(right);
  }

  public stop(): void {
    this.osc1.stop();
    this.osc1.disconnect();
    this.osc2.stop();
    this.osc2.disconnect();
  }

  public changeFreq(val: number): void {
    this.osc1.frequency.value = val;
  }
}
