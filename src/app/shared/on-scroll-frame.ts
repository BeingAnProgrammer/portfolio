/**
 * Calls `update` once immediately and then at most once per animation frame while `target` scrolls.
 * Returns the cleanup function. Keeps layout reads/writes out of the raw scroll event.
 */
export function onScrollFrame(update: () => void, target: EventTarget = window): () => void {
  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      update();
    });
  };
  target.addEventListener('scroll', onScroll, { passive: true });
  update();
  return () => target.removeEventListener('scroll', onScroll);
}
