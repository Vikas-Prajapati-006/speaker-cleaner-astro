class SoundEngineContext {
  private static instance: SoundEngineContext;
  private ctx: AudioContext | null = null;

  private constructor() {}

  public static getInstance(): SoundEngineContext {
    if (!SoundEngineContext.instance) {
      SoundEngineContext.instance = new SoundEngineContext();
    }
    return SoundEngineContext.instance;
  }

  public async getContext(): Promise<AudioContext> {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    return this.ctx;
  }

  public async close(): Promise<void> {
    if (this.ctx && this.ctx.state !== 'closed') {
      await this.ctx.close();
      this.ctx = null;
    }
  }
}

export const soundContext = SoundEngineContext.getInstance();