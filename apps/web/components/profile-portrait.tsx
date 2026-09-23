import Image from 'next/image';

const PROFILE_SVG = '/profile_2.svg';
// Each SVG's own intrinsic width/height (from its viewBox), so the wrapper's
// aspect-ratio always matches the artwork exactly.
const PROFILE_RATIO = 313.5 / 438;

const HERO_PROFILE_SVG = '/profile_2_cropped.svg';
const HERO_PROFILE_RATIO = 310.872905027933 / 372.29998639999997;

/**
 * The profile artwork, shown exactly as the SVG itself looks — no background
 * shape, no cropping. `size` caps how large it can grow. The Landing/Home
 * hero uses a wider-cropped variant of the same artwork; other usages (e.g.
 * About) use the uncropped default.
 */
export function ProfilePortrait({
  size = 480,
  priority = false,
  variant = 'default',
}: {
  size?: number;
  priority?: boolean;
  variant?: 'default' | 'hero';
}) {
  const src = variant === 'hero' ? HERO_PROFILE_SVG : PROFILE_SVG;
  const ratio = variant === 'hero' ? HERO_PROFILE_RATIO : PROFILE_RATIO;

  return (
    <div className="relative mx-auto w-full" style={{ maxWidth: size, aspectRatio: ratio }}>
      <Image
        src={src}
        alt="Donna Sembrano"
        fill
        sizes={`${size}px`}
        className="object-contain"
        priority={priority}
      />
    </div>
  );
}
