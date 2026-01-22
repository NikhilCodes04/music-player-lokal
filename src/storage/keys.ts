export const STORAGE_KEYS = {
  QUEUE: 'queue',
  TRACK_INDEX: 'track_index',
  SHUFFLE: 'shuffle',
  REPEAT: 'repeat',
  // Note: Playback position is intentionally NOT persisted as per architecture rules.
} as const;
