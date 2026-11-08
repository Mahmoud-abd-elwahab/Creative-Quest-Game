/** PRIVATE SPIKE ONLY. Not the HQ-approved versioned game/UI contract. */
export type SpikeEvents = {
  'interaction:request': undefined;
  'challenge:open': { id: 'guardian-observation-01' };
  'challenge:submit': { answerId: string };
  'challenge:feedback': { correct: boolean; message: string; completed: boolean };
  'challenge:close': undefined;
  'map:state': { near: boolean; stage: 'map' | 'challenge' | 'feedback' };
  'progress:changed': { xp: number; completed: boolean; source: string; saved: boolean };
  'input:move': { x: number; y: number };
  toast: { message: string };
};
export class SpikeBus {
  private readonly target = new EventTarget();
  on<K extends keyof SpikeEvents>(name: K, handler: (payload: SpikeEvents[K]) => void, signal: AbortSignal): void {
    this.target.addEventListener(name, (event: Event) => {
      handler((event as CustomEvent<SpikeEvents[K]>).detail);
    }, { signal });
  }
  emit<K extends keyof SpikeEvents>(name: K, payload: SpikeEvents[K]): void {
    this.target.dispatchEvent(new CustomEvent(name, { detail: payload }));
  }
}
