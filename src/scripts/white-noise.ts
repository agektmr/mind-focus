export class WhiteNoise {
  private bufferSize: number = 4096
  private osc1: ScriptProcessorNode
  private osc2: ScriptProcessorNode

  constructor(ctx: AudioContext) {
    this.osc1 = ctx.createScriptProcessor(this.bufferSize, 1, 1);
    this.osc2 = ctx.createScriptProcessor(this.bufferSize, 1, 1);
  }

  public start(): void {
    this.osc1.addEventListener('audioprocess', this.audioprocess);
    this.osc2.addEventListener('audioprocess', this.audioprocess);
  }

  public connect(
    left: AudioNode,
    right: AudioNode
  ): void {
    this.osc1.connect(left);
    this.osc2.connect(right);
  }

  public stop(): void {
    this.osc1.removeEventListener('audioprocess', this.audioprocess);
    this.osc1.disconnect();
    this.osc2.removeEventListener('audioprocess', this.audioprocess);
    this.osc2.disconnect();
  }

  public audioprocess(e: AudioProcessingEvent): void {
    let output = e.outputBuffer.getChannelData(0);
    for (let i = 0; i < this.bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
  }
}
