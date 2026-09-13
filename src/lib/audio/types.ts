export type OscillatorWaveType = 'sine' | 'square' | 'triangle' | 'sawtooth';

export type EngineStatus = 'idle' | 'running' | 'paused' | 'error';

export interface ToneConfig {
  frequency: number;
  type?: OscillatorWaveType;
  volume?: number;
  pulseRateHz?: number;
}

export interface DeviceAcousticProfile {
  targetFrequency: number;
  waveform: OscillatorWaveType;
  durationSeconds: number;
  pulseModulation: boolean;
}

export interface AudioEngineState {
  isPlaying: boolean;
  frequency: number;
  volume: number;
  status: EngineStatus;
}