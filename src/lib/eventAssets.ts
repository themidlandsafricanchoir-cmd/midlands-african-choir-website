/**
 * Build-time helpers for event pages.
 *
 * Reads from /public at build time so pages work before images are uploaded
 * (nothing renders for a missing file) and pick them up automatically once added.
 */
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;

/** Names reserved for the poster / flier, excluded from photo galleries. */
const RESERVED = /^(poster|flier|flyer)\.(jpe?g|png|webp|avif)$/i;

/** True if a file under /public exists, e.g. fileExists('/images/events/x/poster.jpg'). */
export function fileExists(publicPath: string): boolean {
  return existsSync(path.join(PUBLIC_DIR, publicPath));
}

/**
 * Finds an image in /public/images/events/<slug>/ by base name, with any image extension.
 * Tries each name in order, e.g. findEventImage('x', ['poster', 'flier']).
 * Returns the public URL, or undefined if none exists.
 */
export function findEventImage(slug: string, baseNames: string[]): string | undefined {
  const dir = path.join(PUBLIC_DIR, 'images', 'events', slug);
  if (!existsSync(dir)) return undefined;
  const files = readdirSync(dir).filter((f) => IMAGE_EXT.test(f));
  for (const name of baseNames) {
    const hit = files.find((f) => f.replace(/\.[^.]+$/, '').toLowerCase() === name.toLowerCase());
    if (hit) return `/images/events/${slug}/${encodeURIComponent(hit)}`;
  }
  return undefined;
}

/** Public URLs of all gallery photos in /public/images/events/<slug>/, naturally sorted. */
export function listEventPhotos(slug: string): string[] {
  const dir = path.join(PUBLIC_DIR, 'images', 'events', slug);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => IMAGE_EXT.test(f) && !RESERVED.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
    .map((f) => `/images/events/${slug}/${encodeURIComponent(f)}`);
}

export interface Logo {
  name: string;
  /** Public URL, or undefined if the logo file hasn't been uploaded yet. */
  src?: string;
}

/**
 * Finds the two funder logos in /public/images/logos/ by filename keywords,
 * so exact file names don't matter (e.g. national-lottery.png, wtc-logo.svg).
 */
export function getFunderLogos(): { lottery: Logo; council: Logo } {
  const dir = path.join(PUBLIC_DIR, 'images', 'logos');
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => /\.(png|jpe?g|svg|webp)$/i.test(f)) : [];
  const find = (re: RegExp) => files.find((f) => re.test(f));

  const lotteryFile = find(/lottery|community[-_ ]?fund|tncf|nlcf/i);
  const councilFile = find(/wellingborough|town|council|wtc/i);

  return {
    lottery: {
      name: 'The National Lottery Community Fund',
      src: lotteryFile ? `/images/logos/${encodeURIComponent(lotteryFile)}` : undefined,
    },
    council: {
      name: 'Wellingborough Town Council',
      src: councilFile ? `/images/logos/${encodeURIComponent(councilFile)}` : undefined,
    },
  };
}

export const FUNDING_STATEMENT =
  'This event is funded by The National Lottery Community Fund and Wellingborough Town Council.';
