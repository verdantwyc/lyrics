import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

const rawFiles = import.meta.glob<string>('../../content/songs/**/*.{md,mdx}', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export async function getStaticPaths() {
  const songs = await getCollection('songs');
  return songs.map((song) => ({ params: { slug: `${song.id}.md` } }));
}

export function GET({ params }: APIContext) {
  const slug = params.slug?.replace(/\.mdx?$/, '') ?? '';
  const key = Object.keys(rawFiles).find((path) => path.endsWith(`/songs/${slug}.md`) || path.endsWith(`/songs/${slug}.mdx`));
  const body = key ? rawFiles[key] : '';

  return new Response(body, {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
    },
  });
}
