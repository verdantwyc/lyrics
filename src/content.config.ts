import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { albums } from './config/site';

const songs = defineCollection({
  loader: glob({ base: './src/content/songs', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    coverColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    coverImage: z.string().optional(),
    vocalist: z.string(),
    lyricist: z.string().optional().default(''),
    composer: z.string().optional().default(''),
    arranger: z.string().optional().default(''),
    producer: z.string().optional().default(''),
    recording: z.string().optional().default(''),
    mixer: z.string().optional().default(''),
    mastering: z.string().optional().default(''),
    album: z.enum(albums),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    externalLinks: z.array(z.object({
      label: z.string(),
      url: z.string().url(),
    })).default([]),
  }),
});

export const collections = { songs };
