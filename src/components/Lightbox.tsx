import { useState, useEffect, useCallback } from "react";

interface Photo {
  src: string;
  fullSrc: string;
  alt: string;
}

interface Props {
  photos: Photo[];
  galleryId: string;
}

export default function Lightbox({ photos, galleryId }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const { id, index } = (e as CustomEvent<{ id: string; index: number }>).detail;
      if (id === galleryId) setActiveIndex(index);
    };
    window.addEventListener("gallery:open", handler);
    return () => window.removeEventListener("gallery:open", handler);
  }, [galleryId]);

  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(() =>
    setActiveIndex(i => i === null ? null : (i - 1 + photos.length) % photos.length),
    [photos.length]
  );
  const next = useCallback(() =>
    setActiveIndex(i => i === null ? null : (i + 1) % photos.length),
    [photos.length]
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, close, prev, next]);

  if (activeIndex === null) return null;

  const photo = photos[activeIndex];

  return (
    <div className="lb-backdrop" onClick={close} role="dialog" aria-modal="true">
      <button className="lb-close" onClick={close} aria-label="Close">✕</button>

      <button
        className="lb-arrow lb-prev"
        onClick={e => { e.stopPropagation(); prev(); }}
        aria-label="Previous"
      >‹</button>

      <div className="lb-content" onClick={e => e.stopPropagation()}>
        <img src={photo.fullSrc} alt={photo.alt} className="lb-img" />
        <p className="lb-counter">{activeIndex + 1} / {photos.length}</p>
      </div>

      <button
        className="lb-arrow lb-next"
        onClick={e => { e.stopPropagation(); next(); }}
        aria-label="Next"
      >›</button>

      <style>{`
        .lb-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.93);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .lb-content {
          max-width: min(88vw, 1000px);
          cursor: default;
          text-align: center;

          & .lb-img {
            max-height: 82vh;
            max-width: 100%;
            width: auto;
            border-radius: 6px;
            display: block;
            margin: 0 auto;
          }

          & .lb-counter {
            color: #aaa;
            font-size: 0.85rem;
            margin-top: 0.75rem;
            font-family: Inter, system-ui, sans-serif;
          }
        }

        .lb-close {
          position: fixed;
          top: 1rem;
          right: 1.5rem;
          color: #fff;
          font-size: 1.75rem;
          opacity: 0.7;
          line-height: 1;
          padding: 0.25rem 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          font-family: system-ui;

          &:hover { opacity: 1; }
        }

        .lb-arrow {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          color: #fff;
          font-size: 3.5rem;
          line-height: 1;
          opacity: 0.55;
          padding: 0 0.75rem;
          background: none;
          border: none;
          cursor: pointer;
          font-family: system-ui;
          user-select: none;

          &:hover { opacity: 1; }
          &.lb-prev { left: 0.25rem; }
          &.lb-next { right: 0.25rem; }
        }
      `}</style>
    </div>
  );
}
