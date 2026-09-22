import Image from 'next/image';

/**
 * The profile photo with a purple arch/blob behind it, per the Figma hero
 * and About mockups. `size` scales both the arch and the photo together.
 */
export function ProfilePortrait({
  size = 340,
  priority = false,
}: {
  size?: number;
  priority?: boolean;
}) {
  return (
    <div className="relative mx-auto" style={{ width: size, height: size * 1.2 }}>
      <div
        className="absolute right-0 bottom-0 left-6 top-10 rounded-t-full rounded-b-3xl bg-accent"
        aria-hidden="true"
      />
      <div className="absolute inset-0 left-0 overflow-hidden rounded-t-full rounded-b-3xl">
        <Image
          src="/profile.png"
          alt="Donna Sembrano"
          fill
          sizes={`${size}px`}
          className="object-cover object-top"
          priority={priority}
        />
      </div>
    </div>
  );
}
