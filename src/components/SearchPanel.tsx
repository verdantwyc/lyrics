import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

type SearchItem = {
  id: string;
  title: string;
  album: string;
  vocalist: string;
  lyricist: string;
  composer: string;
  arranger: string;
  producer: string;
  recording: string;
  mixer: string;
  mastering: string;
  roles: string[];
  isOriginalVocal: boolean;
  href: string;
  body: string;
};

function scoreItem(item: SearchItem, q: string) {
  const query = q.toLowerCase();
  const fields = [
    [item.title, 12],
    [item.vocalist, 8],
    [item.lyricist, 7],
    [item.composer, 7],
    [item.arranger, 6],
    [item.producer, 5],
    [item.recording, 5],
    [item.mixer, 5],
    [item.mastering, 5],
    [item.album, 5],
    [item.roles.join(' '), 4],
    [item.body, 2],
  ] as const;

  return fields.reduce((sum, [value, weight]) => {
    const text = String(value || '').toLowerCase();
    if (!text.includes(query)) return sum;
    return sum + weight + Math.max(0, 4 - text.indexOf(query) / 12);
  }, 0);
}

function snippet(item: SearchItem, q: string) {
  const text = item.body || `${item.vocalist} ${item.lyricist} ${item.composer} ${item.arranger} ${item.producer} ${item.recording} ${item.mixer} ${item.mastering}`;
  const index = text.toLowerCase().indexOf(q.toLowerCase());
  if (index < 0) return text.slice(0, 78);
  return text.slice(Math.max(0, index - 26), index + q.length + 52);
}

export default function SearchPanel({ indexUrl }: { indexUrl: string }) {
  const [items, setItems] = useState<SearchItem[]>([]);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(indexUrl).then((res) => res.json()).then(setItems).catch(() => setItems([]));
  }, [indexUrl]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return items
      .map((item) => ({ item, score: scoreItem(item, q) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [items, query]);

  return (
    <div ref={panelRef} className={`search-panel ${open ? 'is-open' : ''}`}>
      <button className="search-trigger" type="button" onClick={() => setOpen(true)}>
        <Search size={18} />
        <span>搜索</span>
      </button>
      {open && (
        <div className="search-popover">
          <div className="search-box">
            <Search size={18} />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="输入歌名、歌词、人名、专辑..."
            />
            <button type="button" aria-label="关闭搜索" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>
          <div className="search-results">
            {!query.trim() && <p>可以搜歌名，也可以搜歌词正文、作词、作曲、编曲或专辑。</p>}
            {query.trim() && results.length === 0 && <p>没有找到匹配的歌曲。</p>}
            {results.map(({ item }) => (
              <a key={item.id} href={item.href} className="search-result" onClick={() => setOpen(false)}>
                <strong>{item.title}</strong>
                <span>{item.album} / {[...item.roles, item.isOriginalVocal ? '原唱' : ''].filter(Boolean).join(' · ')}</span>
                <small>{snippet(item, query)}</small>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
