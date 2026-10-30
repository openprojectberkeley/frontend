/*
 * The stops on the home page's pinned timeline that the header's home menu
 * jumps to, in order. `id` is the URL hash (/#clients), `playhead` the point in
 * ImmersiveHero's timeline to land on, in screens of scrolling - see
 * useScrollPlayhead. Move a scene and its playhead here moves with it.
 */
export const HOME_SECTIONS = [
  { id: 'intro', label: 'intro', playhead: 1.2 },
  { id: 'clients', label: 'clients', playhead: 2.65 },
  { id: 'where-we-work', label: 'where we work', playhead: 3.1 },
  { id: 'community', label: 'community', playhead: 4.1 },
  { id: 'join-us', label: 'join us', playhead: 6.75 },
];
