import { useEffect, useRef, useState, type ImgHTMLAttributes } from 'react';
import clsx from 'clsx';
import { assetUrl } from '../lib/directus';

type Fit = 'cover' | 'contain' | 'inside';

// `id` is taken out of the img attributes: here it is the Directus file id, not the HTML id.
type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'id' | 'src' | 'width' | 'height'> & {
  /** Directus file id. */
  id: string | null | undefined;
  /** Transform requested from Directus for the real image. */
  width?: number;
  height?: number;
  fit?: Fit;
  quality?: number;
  /**
   * The file's own pixel size (directus_files.width/height). Rendered as the
   * img's width/height attributes so the browser reserves the right box before
   * anything loads — required when the image has no fixed height.
   */
  dims?: { width: number | null; height: number | null } | null;
  /** false for logos and transparent art: a blurred placeholder reads as a smudge; they only fade in. */
  blur?: boolean;
  /** Classes on the frame (position, size, rounding). The img fills it. */
  frameClassName?: string;
};

/**
 * Every Directus image on the site: a tiny blurred preview (a 32px transform,
 * a few hundred bytes, same crop as the real image) shows at once, and the
 * full image fades in over it once decoded. No empty box while photos load.
 */
export function BlurImage({ id, width, height, fit, quality, dims, blur = true, frameClassName, className, alt = '', loading = 'lazy', ...rest }: Props) {
  const img = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const src = assetUrl(id, { width, height, fit, quality });

  // A cached image can finish before React attaches onLoad.
  useEffect(() => {
    setLoaded(Boolean(img.current?.complete && img.current.naturalWidth));
  }, [src]);

  if (!src) return null;

  const tinyHeight = width && height ? Math.max(1, Math.round((32 * height) / width)) : undefined;
  const placeholder = blur ? assetUrl(id, { width: 32, height: tinyHeight, fit, quality: 40 }) : undefined;

  // Callers may position or lay out the frame themselves; never stack a
  // conflicting default under them (utility order in the CSS decides otherwise).
  const frame = frameClassName ?? '';
  const positioned = /(^|\s)(absolute|fixed|sticky)(\s|$)/.test(frame);
  const displayed = /(^|\s)(inline-block|inline-flex|flex|grid|hidden)(\s|$)/.test(frame);

  return (
    <span className={clsx('overflow-hidden', !positioned && 'relative', !displayed && 'block', blur && !loaded && 'bg-fx-violet-soft', frame)}>
      {placeholder && !loaded && (
        <img src={placeholder} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl" />
      )}
      <img
        ref={img}
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        width={dims?.width ?? undefined}
        height={dims?.height ?? undefined}
        onLoad={() => setLoaded(true)}
        className={clsx('relative transition-opacity duration-500', loaded ? 'opacity-100' : 'opacity-0', className)}
        {...rest}
      />
    </span>
  );
}
