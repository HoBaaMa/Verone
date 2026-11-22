import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DependencyList,
  type MouseEvent,
  type PointerEvent,
} from "react";

export interface CarouselProgress {
  /** Thumb offset and size as percentages of the track. */
  offset: number;
  size: number;
  atStart: boolean;
  atEnd: boolean;
}

/**
 * Horizontal scroll-snap carousel behaviour: progress measurement, arrow
 * stepping by whole cards (`[data-card]` children), and mouse drag scrolling.
 * Touch and trackpads use native scrolling.
 */
export function useScrollCarousel(deps: DependencyList = []) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; scrollLeft: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const [progress, setProgress] = useState<CarouselProgress>({
    offset: 0,
    size: 33,
    atStart: true,
    atEnd: false,
  });
  const [dragging, setDragging] = useState(false);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el || el.scrollWidth === 0) return;
    const max = el.scrollWidth - el.clientWidth;
    // RTL tracks report scrollLeft from 0 down to -max; measure distance from the start.
    const pos = Math.abs(el.scrollLeft);
    setProgress({
      offset: (pos / el.scrollWidth) * 100,
      size: (el.clientWidth / el.scrollWidth) * 100,
      atStart: pos <= 1,
      atEnd: pos >= max - 1,
    });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measure, ...deps]);

  const scrollByCards = useCallback((direction: 1 | -1, cards: number) => {
    const el = trackRef.current;
    const card = el?.querySelector<HTMLElement>("[data-card]");
    if (!el || !card) return;
    const style = getComputedStyle(el);
    const gap = parseFloat(style.columnGap) || 0;
    // "Next" moves toward the inline end, which is leftward in RTL.
    const sign = style.direction === "rtl" ? -1 : 1;
    el.scrollBy({ left: sign * direction * (card.offsetWidth + gap) * cards, behavior: "smooth" });
  }, []);

  const trackProps = {
    ref: trackRef,
    onScroll: measure,
    onPointerDown: (e: PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== "mouse" || e.button !== 0 || !trackRef.current) return;
      drag.current = { x: e.clientX, scrollLeft: trackRef.current.scrollLeft, moved: false };
    },
    onPointerMove: (e: PointerEvent<HTMLDivElement>) => {
      const state = drag.current;
      const el = trackRef.current;
      if (!state || !el) return;
      const dx = e.clientX - state.x;
      if (!state.moved && Math.abs(dx) > 4) {
        state.moved = true;
        setDragging(true);
        el.setPointerCapture(e.pointerId);
      }
      if (state.moved) el.scrollLeft = state.scrollLeft - dx;
    },
    onPointerUp: (e: PointerEvent<HTMLDivElement>) => endDrag(e),
    onPointerCancel: (e: PointerEvent<HTMLDivElement>) => endDrag(e),
    // A drag must not activate the link or button it started on.
    onClickCapture: (e: MouseEvent<HTMLDivElement>) => {
      if (!suppressClick.current) return;
      suppressClick.current = false;
      e.preventDefault();
      e.stopPropagation();
    },
    onDragStart: (e: MouseEvent<HTMLDivElement>) => e.preventDefault(),
  };

  function endDrag(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    if (drag.current.moved) {
      // The click (if any) fires synchronously after pointerup; clear the flag right after.
      suppressClick.current = true;
      setTimeout(() => (suppressClick.current = false), 0);
    }
    if (trackRef.current?.hasPointerCapture(e.pointerId))
      trackRef.current.releasePointerCapture(e.pointerId);
    drag.current = null;
    setDragging(false);
  }

  return { trackProps, progress, dragging, scrollByCards };
}
