/**
 * Calls `onTick` every `intervalMs`, but only while `host` is on screen — the design's showcase loops
 * would otherwise keep running (and re-rendering) far below the fold. Returns the cleanup function.
 */
export function visibleTicker(host: Element, intervalMs: number, onTick: () => void): () => void {
  let intervalId: ReturnType<typeof setInterval> | undefined;
  const stopTicking = () => {
    clearInterval(intervalId);
    intervalId = undefined;
  };
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) intervalId ??= setInterval(onTick, intervalMs);
      else stopTicking();
    },
    { threshold: 0.1 },
  );
  observer.observe(host);
  return () => {
    observer.disconnect();
    stopTicking();
  };
}
