export const siteName = '王允宸作品手札';
export const siteDescription = '按演唱、作词、作曲、编曲与专辑整理的音乐作品笔记。';

export const roles = ['作词', '作曲', '编曲'] as const;

export const albums = [
  '光的回响',
  '镜渊',
  '野草',
  '克莱因瓶的假设',
  '娘子军',
  '隐',
  '其他EP',
  '未上架',
] as const;

export const roleConfig = {
  作词: { slug: 'lyricist', label: '作词', description: '以文字塑形旋律的情绪与叙事。' },
  作曲: { slug: 'composer', label: '作曲', description: '旋律、和声与作品骨架的创作。' },
  编曲: { slug: 'arranger', label: '编曲', description: '声响配置、段落推进与制作想象。' },
} as const;

export const workTypeConfig = {
  original: {
    label: '原创作品',
    description: '天草参与歌词、乐曲创作的作品',
  },
  vocal: {
    label: '原唱',
    description: '天草作为原唱的作品',
  },
} as const;

export const coverColorConfig = {
  vocalOnly: { color: '#2f6868', label: '僅原唱' },
  lyricistOnly: { color: '#930531', label: '原創之僅作詞' },
  songwriting: { color: '#CC5311', label: '原創之詞曲創作' },
  arrangement: { color: '#7a6b3f', label: '編曲創作' },
} as const;

export const albumConfig = {
  光的回响: { color: '#d9b856', description: '天草首张原创EP' },
  镜渊: { color: '#576fa7', description: '在光与镜的深渊中沉沦，七重自我在镜中撕裂挣扎' },
  野草: { color: '#718c48', description: '自由生长，燎原之势，世界以荒芜相赠，我以生命写诗成歌。' },
  克莱因瓶的假设: { color: '#8c61a8', description: '内外翻转，循环而无边界。' },
  娘子军: { color: '#b64a63', description: '群像、女性力量与叙事锋面。' },
  隐: { color: '#68616e', description: '藏起来的声音与未说出口的部分。' },
  其他EP: { color: '#CC5311', description: '单曲、EP 与暂未归入大专辑的作品。' },
  未上架: { color: '#2f6868', description: '尚未正式发行的作品。' },
} as const;

export type Role = (typeof roles)[number];
export type Album = (typeof albums)[number];

export function withBase(path = '/') {
  if (/^https?:\/\//.test(path)) return path;
  const base = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL.replace(/\/$/, '');
  const input = path.startsWith('/') ? path : `/${path}`;
  const hasFileExtension = /\/[^/]+\.[^/]+$/.test(input);
  const normalized = input === '/' || hasFileExtension || input.endsWith('/') ? input : `${input}/`;
  return `${base}${normalized}` || '/';
}

export function songHref(id: string) {
  return withBase(`/songs/${id.split('/').map(encodeURIComponent).join('/')}`);
}

export function albumHref(album: string) {
  return withBase(`/album/${encodeURIComponent(album)}`);
}

export function roleHref(role: Role) {
  return withBase(`/category/${roleConfig[role].slug}`);
}
