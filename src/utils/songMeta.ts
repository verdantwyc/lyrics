import { albumConfig, coverColorConfig, roles, type Album, type Role } from '../config/site';

type SongData = {
  vocalist?: string;
  lyricist?: string;
  composer?: string;
  arranger?: string;
  album?: string;
  pubDate: Date;
};

const artistName = '王允宸';

function hasArtist(value = '') {
  return value.includes(artistName);
}

export function songRoles(data: SongData): Role[] {
  return roles.filter((role) => {
    if (role === '作词') return hasArtist(data.lyricist);
    if (role === '作曲') return hasArtist(data.composer);
    return hasArtist(data.arranger);
  });
}

export function isOriginalVocal(data: SongData) {
  return hasArtist(data.vocalist);
}

export function songYear(data: SongData) {
  return data.pubDate.getFullYear();
}

export function coverColorKind(data: SongData) {
  const computedRoles = songRoles(data);
  if (computedRoles.includes('编曲')) return 'arrangement';
  if (computedRoles.includes('作曲')) return 'songwriting';
  if (computedRoles.includes('作词')) return 'lyricistOnly';
  return 'vocalOnly';
}

export function coverColor(data: SongData) {
  const kind = coverColorKind(data);
  if (kind === 'vocalOnly' && !isOriginalVocal(data) && data.album && data.album in albumConfig) {
    return albumConfig[data.album as Album].color;
  }
  return coverColorConfig[kind].color;
}

export function roleCounts<T extends { data: SongData }>(songs: T[]) {
  return Object.fromEntries(roles.map((role) => [role, songs.filter((song) => songRoles(song.data).includes(role)).length])) as Record<Role, number>;
}

export function originalCount<T extends { data: SongData }>(songs: T[]) {
  return songs.filter((song) => songRoles(song.data).length > 0).length;
}

export function vocalCount<T extends { data: SongData }>(songs: T[]) {
  return songs.filter((song) => isOriginalVocal(song.data)).length;
}
