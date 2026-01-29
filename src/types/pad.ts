export interface Pad {
  id: string;
  label?: string;
  audioUrl?: string;
  /**
   * Key used to look up the audio Blob in IndexedDB.
   * This is persisted as part of state.
   */
  localAudioId?: string;
  /**
   * Actual audio data loaded from IndexedDB.
   * This is NOT persisted (Blob is not JSON-serializable).
   */
  audioFile?: Blob;
  width: number;
  height: number;
}
