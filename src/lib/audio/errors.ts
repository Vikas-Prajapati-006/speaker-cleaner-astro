export class AudioInitializationError extends Error {
  constructor(message: string = 'Failed to initialize Web Audio API hardware context.') {
    super(message);
    this.name = 'AudioInitializationError';
  }
}

export class AutoplayBlockedError extends Error {
  constructor(message: string = 'User interaction required to unlock audio subsystem.') {
    super(message);
    this.name = 'AutoplayBlockedError';
  }
}

export class FrequencyOutOfRangeError extends Error {
  constructor(freq: number) {
    super(`Frequency ${freq}Hz is out of safe excursion range (20Hz - 20000Hz).`);
    this.name = 'FrequencyOutOfRangeError';
  }
}

export function handleAudioError(error: unknown): string {
  if (error instanceof AutoplayBlockedError) {
    return 'Tap the clean button again to grant browser audio permissions.';
  }
  if (error instanceof AudioInitializationError) {
    return 'Your browser does not support HTML5 Web Audio API.';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected audio hardware error occurred.';
}