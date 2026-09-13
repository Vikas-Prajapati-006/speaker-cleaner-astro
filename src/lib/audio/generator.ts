import { soundContext } from './context';

export interface SoundGeneratorOptions {
  frequency?: number;
  type?: OscillatorType;
  volume?: number;
  pan?: number; // -1 (Top/Left), 0 (Both), 1 (Bottom/Right)
}

export class SpeakerCleanerEngine {
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private pulseGainNode: GainNode | null = null;
  private lfoOscillator: OscillatorNode | null = null;
  private pannerNode: StereoPannerNode | null = null;
  private isRunning: boolean = false;

  public async start(options: SoundGeneratorOptions = {}): Promise<void> {
    if (this.isRunning) return;

    const {
      frequency = 165,
      type = 'sine',
      volume = 0.8,
      pan = 0
    } = options;

    const ctx = await soundContext.getContext();
    const now = ctx.currentTime;

    // Master output gain
    this.gainNode = ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.001, now);
    this.gainNode.gain.exponentialRampToValueAtTime(Math.min(volume, 1.0), now + 0.15);

    // Dynamic kinetic pulse modulator (2 Hz rhythm to knock liquid droplets free)
    this.pulseGainNode = ctx.createGain();
    this.pulseGainNode.gain.setValueAtTime(0.5, now);

    this.lfoOscillator = ctx.createOscillator();
    this.lfoOscillator.type = 'square';
    this.lfoOscillator.frequency.setValueAtTime(2, now); // 2 pulses per second
    this.lfoOscillator.connect(this.pulseGainNode.gain);

    // Hardware Stereo Panner Node
    if (typeof ctx.createStereoPanner === 'function') {
      this.pannerNode = ctx.createStereoPanner();
      this.pannerNode.pan.setValueAtTime(pan, now);
    }

    // Primary acoustic displacement transducer
    this.oscillator = ctx.createOscillator();
    this.oscillator.type = type;
    this.oscillator.frequency.setValueAtTime(frequency, now);

    // Audio node pipeline connection
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.pulseGainNode);

    if (this.pannerNode) {
      this.pulseGainNode.connect(this.pannerNode);
      this.pannerNode.connect(ctx.destination);
    } else {
      this.pulseGainNode.connect(ctx.destination);
    }

    this.oscillator.start(now);
    this.lfoOscillator.start(now);
    this.isRunning = true;
  }

  public async stop(): Promise<void> {
    if (!this.isRunning || !this.gainNode) return;

    const ctx = await soundContext.getContext();
    const now = ctx.currentTime;

    // Smooth ramp down to prevent speaker driver pop/clipping
    this.gainNode.gain.cancelScheduledValues(now);
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
    this.gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

    setTimeout(() => {
      try {
        this.oscillator?.stop();
        this.lfoOscillator?.stop();
        this.oscillator?.disconnect();
        this.lfoOscillator?.disconnect();
        this.gainNode?.disconnect();
        this.pulseGainNode?.disconnect();
        this.pannerNode?.disconnect();
      } catch {
        // Suppress already-stopped cleanup exceptions
      } finally {
        this.oscillator = null;
        this.lfoOscillator = null;
        this.gainNode = null;
        this.pulseGainNode = null;
        this.pannerNode = null;
        this.isRunning = false;
      }
    }, 120);
  }

  public setFrequency(hz: number): void {
    if (this.oscillator && this.isRunning) {
      this.oscillator.frequency.setTargetAtTime(hz, 0, 0.05);
    }
  }

  public setPan(panValue: number): void {
    if (this.pannerNode && this.isRunning) {
      this.pannerNode.pan.setTargetAtTime(panValue, 0, 0.05);
    }
  }

  public getStatus(): boolean {
    return this.isRunning;
  }
}

export const cleanerEngine = new SpeakerCleanerEngine();