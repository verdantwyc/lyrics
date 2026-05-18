import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { songHref } from '../config/site';
import { isOriginalVocal, songRoles } from '../utils/songMeta';

const rawFiles = import.meta.glob<string>('../content/songs/**/*.{md,mdx}', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function bodyFromRaw(raw = '') {
  return raw.replace(/^---[\s\S]*?---/, '').replace(/[#*_`|>-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function rawForId(id: string) {
  const key = Object.keys(rawFiles).find((file) => file.endsWith(`/songs/${id}.md`) || file.endsWith(`/songs/${id}.mdx`));
  return key ? rawFiles[key] : '';
}

export async function GET(_context: APIContext) {
  const songs = (await getCollection('songs')).filter((song) => !song.data.draft);
  const items = songs.map((song) => ({
    id: song.id,
    title: song.data.title,
    album: song.data.album,
    vocalist: song.data.vocalist,
    lyricist: song.data.lyricist,
    composer: song.data.composer,
    arranger: song.data.arranger,
    producer: song.data.producer,
    recording: song.data.recording,
    mixer: song.data.mixer,
    mastering: song.data.mastering,
    roles: songRoles(song.data),
    isOriginalVocal: isOriginalVocal(song.data),
    href: songHref(song.id),
    body: bodyFromRaw(rawForId(song.id)),
  }));

  return new Response(JSON.stringify(items), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  });
}
