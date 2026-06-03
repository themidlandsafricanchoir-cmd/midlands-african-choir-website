import { defineCollection, z } from 'astro:content';

const teamCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name:  z.string(),
    role:  z.string(),
    bio:   z.string().max(150 * 7), // ~150 words × avg 7 chars/word ≈ 1050 chars
    image: z.string().optional(),   // https:// S3 URL or local asset path
    order: z.number(),
  }),
});

const performancesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title:        z.string(),
    date:         z.coerce.date(),
    description:  z.string().max(300),
    type:         z.enum(['video', 'audio']),
    youtubeId:    z.string().regex(/^[\w\-]{11}$/).optional(),
    audioUrl:     z.string().url().startsWith('https://').optional(),
    thumbnailUrl: z.string().url().startsWith('https://').optional(),
  }),
});

export const collections = {
  team:         teamCollection,
  performances: performancesCollection,
};
