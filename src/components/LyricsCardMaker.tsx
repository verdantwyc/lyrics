import { Download, Image, Share2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

function prepareLyricLines(text: string, maxLines: number) {
  const sourceLines = text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .filter(Boolean);

  if (!sourceLines.length) return ['请先在歌词或正文中选取一段文字。'];
  if (sourceLines.length <= maxLines) return sourceLines;

  const clipped = sourceLines.slice(0, maxLines);
  clipped[clipped.length - 1] = `${clipped[clipped.length - 1]}...`;
  return clipped;
}

function fitFontSize(lines: string[]) {
  const longest = Math.max(...lines.map((line) => line.length), 1);
  const byLength = longest > 42 ? 21 : longest > 34 ? 24 : longest > 28 ? 28 : longest > 20 ? 34 : 44;
  const byCount = lines.length > 6 ? 30 : lines.length > 4 ? 36 : 44;
  return Math.min(byLength, byCount);
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function oneLine(value: string, limit = 24) {
  const cleaned = value.replace(/\s+/g, ' ').trim();
  return cleaned.length > limit ? `${cleaned.slice(0, limit - 1)}...` : cleaned;
}

function buildCardSvg(title: string, album: string, quote: string) {
  const lines = prepareLyricLines(quote, 7);
  const fontSize = fitFontSize(lines);
  const lineHeight = Math.round(fontSize * 1.46);
  const lyricWidth = 500;
  const lyricTspans = lines
    .map((line, index) => {
      const estimatedWidth = line.length * fontSize;
      const fitAttr = estimatedWidth > lyricWidth ? ` textLength="${lyricWidth}" lengthAdjust="spacingAndGlyphs"` : '';
      return `<tspan x="272" dy="${index === 0 ? 0 : lineHeight}"${fitAttr}>${escapeXml(line)}</tspan>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#251b22"/><stop offset=".52" stop-color="#140f17"/><stop offset="1" stop-color="#06070d"/></linearGradient>
    <radialGradient id="ambient" cx="24%" cy="12%" r="70%"><stop stop-color="#cc5311" stop-opacity=".28"/><stop offset=".45" stop-color="#930531" stop-opacity=".24"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <linearGradient id="body" x1="136" y1="48" x2="918" y2="1304"><stop stop-color="#202438"/><stop offset=".48" stop-color="#060813"/><stop offset="1" stop-color="#020309"/></linearGradient>
    <linearGradient id="screen" x1="180" y1="128" x2="900" y2="1064"><stop stop-color="#364153"/><stop offset=".28" stop-color="#57445a"/><stop offset=".6" stop-color="#20283c"/><stop offset="1" stop-color="#111624"/></linearGradient>
    <radialGradient id="screenGlow" cx="16%" cy="6%" r="58%"><stop stop-color="#ffe1a7" stop-opacity=".18"/><stop offset=".25" stop-color="#cc5311" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <linearGradient id="sheen" x1="180" y1="128" x2="900" y2="1064"><stop stop-color="#fff" stop-opacity=".22"/><stop offset=".2" stop-color="#fff" stop-opacity=".04"/><stop offset=".52" stop-color="#fff" stop-opacity=".11"/><stop offset=".72" stop-color="#fff" stop-opacity=".02"/><stop offset="1" stop-color="#fff" stop-opacity=".14"/></linearGradient>
    <linearGradient id="panel" x1="220" y1="192" x2="860" y2="932"><stop stop-color="#a67883" stop-opacity=".92"/><stop offset=".45" stop-color="#756780" stop-opacity=".88"/><stop offset="1" stop-color="#343a54" stop-opacity=".92"/></linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="28" stdDeviation="28" flood-color="#000" flood-opacity=".55"/></filter>
    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#020308" flood-opacity=".42"/></filter>
    <filter id="textShadow"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#080a12" flood-opacity=".36"/></filter>
    <clipPath id="screenClip"><rect x="180" y="128" width="720" height="936" rx="30"/></clipPath>
    <clipPath id="lyricClip"><rect x="272" y="430" width="510" height="300" rx="10"/></clipPath>
  </defs>
  <rect width="1080" height="1350" fill="url(#bg)"/>
  <rect width="1080" height="1350" fill="url(#ambient)"/>
  <rect x="120" y="42" width="840" height="1266" rx="86" fill="url(#body)" filter="url(#softShadow)"/>
  <rect x="142" y="64" width="796" height="1222" rx="70" fill="none" stroke="#fffaf2" stroke-opacity=".15" stroke-width="4"/>
  <rect x="150" y="96" width="780" height="990" rx="42" fill="#060813"/>
  <rect x="180" y="128" width="720" height="936" rx="30" fill="url(#screen)"/>
  <rect x="180" y="128" width="720" height="936" rx="30" fill="url(#screenGlow)"/>
  <rect x="180" y="128" width="720" height="936" rx="30" fill="url(#sheen)"/>
  <rect x="196" y="144" width="688" height="904" rx="24" fill="none" stroke="#fffaf2" stroke-opacity=".12" stroke-width="2"/>
  <rect x="846" y="158" width="36" height="11" rx="6" fill="#fffaf2" opacity=".78"/>
  <g clip-path="url(#screenClip)">
    <rect x="220" y="192" width="640" height="740" rx="30" fill="url(#panel)" filter="url(#cardShadow)"/>
    <rect x="220" y="192" width="640" height="740" rx="30" fill="url(#sheen)" opacity=".7"/>
    <rect x="244" y="216" width="592" height="692" rx="22" fill="none" stroke="#fffaf2" stroke-opacity=".18" stroke-width="2"/>
    <rect x="272" y="282" width="6" height="86" rx="3" fill="#f2c16d" opacity=".9"/>
    <text x="306" y="314" fill="#fffaf2" font-family="Inter, Noto Sans SC, Microsoft YaHei, sans-serif" font-size="35" font-weight="900">${escapeXml(oneLine(title, 26))}</text>
    <text x="306" y="354" fill="#fffaf2" opacity=".68" font-family="Inter, Noto Sans SC, Microsoft YaHei, sans-serif" font-size="25" font-weight="800">${escapeXml(oneLine(album, 30))}</text>
    <line x1="272" y1="398" x2="782" y2="398" stroke="#fffaf2" stroke-opacity=".16"/>
    <text x="272" y="476" clip-path="url(#lyricClip)" fill="#fffaf2" font-family="Inter, Noto Sans SC, Microsoft YaHei, sans-serif" font-size="${fontSize}" font-weight="900" filter="url(#textShadow)">${lyricTspans}</text>
    <rect x="272" y="776" width="380" height="8" rx="5" fill="#fffaf2" opacity=".22"/>
    <rect x="272" y="776" width="178" height="8" rx="5" fill="#f2c16d"/>
    <g transform="translate(272 840)">
      <rect x="0" y="-28" width="286" height="58" rx="20" fill="#111624" opacity=".24"/>
      <g transform="translate(18 -19) scale(1.9)" fill="none" stroke="#f2c16d" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M7 20h10"/>
        <path d="M10 20c5.5-2.5.8-6.4 3-10"/>
        <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/>
        <path d="M14.1 6a7 7 0 0 1 5.8-3.5c.3 2.9-.5 4.9-1.9 6.1-1.4 1.3-3.3 1.7-5.7 1.4.1-1.7.7-3 1.8-4z"/>
      </g>
      <text x="76" y="9" fill="#f2c16d" font-family="Inter, Noto Sans SC, Microsoft YaHei, sans-serif" font-size="22" font-weight="900">王允宸作品手札</text>
    </g>
  </g>
  <circle cx="540" cy="1180" r="72" fill="#050712"/>
  <circle cx="540" cy="1180" r="72" fill="none" stroke="#fffaf2" stroke-opacity=".15" stroke-width="6"/>
  <circle cx="540" cy="1180" r="38" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="4"/>
</svg>`;
}

function svgToDataUrl(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export default function LyricsCardMaker({ title, album }: { title: string; album: string }) {
  const [selected, setSelected] = useState('');
  const [pendingQuote, setPendingQuote] = useState('');
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [latestUrl, setLatestUrl] = useState('');
  const selectedRef = useRef('');
  const latestUrlRef = useRef('');
  const quote = pendingQuote || selected || '请先在歌词或正文中选取一段文字。';
  const cardSvg = useMemo(() => buildCardSvg(title, album, quote), [album, quote, title]);
  const cardDataUrl = useMemo(() => svgToDataUrl(cardSvg), [cardSvg]);

  const captureSelection = () => {
    const text = window.getSelection()?.toString().trim() || '';
    if (text.length >= 2) {
      const clipped = text.slice(0, 180);
      selectedRef.current = clipped;
      setSelected(clipped);
      setPendingQuote(clipped);
      return clipped;
    }
    if (selectedRef.current) {
      setSelected(selectedRef.current);
      setPendingQuote(selectedRef.current);
      return selectedRef.current;
    }
    return '';
  };

  useEffect(() => {
    const update = () => {
      const text = window.getSelection()?.toString().trim() || '';
      if (text.length >= 2) {
        const clipped = text.slice(0, 180);
        selectedRef.current = clipped;
        setSelected(clipped);
        setPendingQuote(clipped);
      }
    };
    document.addEventListener('selectionchange', update);
    document.addEventListener('mouseup', update);
    document.addEventListener('keyup', update);
    document.addEventListener('touchend', update);
    return () => {
      document.removeEventListener('selectionchange', update);
      document.removeEventListener('mouseup', update);
      document.removeEventListener('keyup', update);
      document.removeEventListener('touchend', update);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => () => {
    if (latestUrlRef.current) URL.revokeObjectURL(latestUrlRef.current);
  }, []);

  function rememberDownloadUrl(blob: Blob) {
    if (latestUrlRef.current) URL.revokeObjectURL(latestUrlRef.current);
    const url = URL.createObjectURL(blob);
    latestUrlRef.current = url;
    setLatestUrl(url);
    return url;
  }

  async function getCardBlob() {
    const svgBlob = new Blob([cardSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    try {
      const img = document.createElement('img');
      img.decoding = 'sync';
      img.src = url;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.drawImage(img, 0, 0);
      return await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function download() {
    setBusy(true);
    setStatus('正在生成 PNG...');
    try {
      const blob = await getCardBlob();
      if (!blob) {
        setStatus('生成失败：浏览器没有取得图像画布。');
        return;
      }
      const url = rememberDownloadUrl(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}-歌词图卡.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setStatus('PNG 已生成并触发下载；如果浏览器没有弹出下载提示，可点下方备用链接。');
    } catch (error) {
      setStatus(`下载失败：${error instanceof Error ? error.message : '浏览器阻止了下载。'}`);
    } finally {
      setBusy(false);
    }
  }

  async function share() {
    setBusy(true);
    setStatus('正在准备分享图片...');
    try {
      const blob = await getCardBlob();
      if (!blob) {
        setStatus('分享失败：浏览器没有取得图像画布。');
        return;
      }
      const file = new File([blob], `${title}-歌词图卡.png`, { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title, text: `${title} 歌词图卡`, files: [file] });
        setStatus('已呼叫系统分享面板。');
      } else {
        const url = rememberDownloadUrl(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}-歌词图卡.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setStatus('此浏览器不支持直接分享图片，已改为下载 PNG。');
      }
    } catch (error) {
      setStatus(`分享未完成：${error instanceof Error ? error.message : '系统分享被取消或阻止。'} 已保留备用下载链接。`);
    } finally {
      setBusy(false);
    }
  }

  function openCard() {
    captureSelection();
    setOpen(true);
  }

  const modal = open ? (
    <div className="card-modal" role="dialog" aria-modal="true" aria-label="歌词图卡预览">
      <div className="card-modal__panel">
        <img className="card-modal__preview" src={cardDataUrl} alt="歌词图卡预览" />
        <label className="card-modal__field">
          <span>图卡文字</span>
          <textarea
            value={pendingQuote}
            onChange={(event) => {
              const value = event.currentTarget.value.slice(0, 180);
              selectedRef.current = value;
              setSelected(value);
              setPendingQuote(value);
            }}
            placeholder="请先选取歌词，或直接在这里输入要生成的文字。"
            rows={4}
          />
        </label>
        <div className="card-modal__actions">
          <button className="icon-button" type="button" disabled={busy} onClick={() => void download()}><Download size={18} />下载</button>
          <button className="icon-button" type="button" disabled={busy} onClick={() => void share()}><Share2 size={18} />分享</button>
          <button className="icon-button" type="button" onClick={() => setOpen(false)}>关闭</button>
        </div>
        {status && <p className="card-modal__status">{status}</p>}
        {latestUrl && (
          <div className="card-modal__fallback">
            <a href={latestUrl} download={`${title}-歌词图卡.png`}>备用下载</a>
            <a href={latestUrl} target="_blank" rel="noreferrer">打开图片</a>
          </div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <div className="lyrics-card-tool">
      <button
        className="icon-button"
        type="button"
        onPointerDown={() => captureSelection()}
        onMouseDown={() => captureSelection()}
        onClick={openCard}
      >
        <Image size={18} />
        <span>选中文字生成歌词图卡</span>
      </button>
      {selected && <small>已选：{selected.slice(0, 28)}{selected.length > 28 ? '...' : ''}</small>}
      {modal ? createPortal(modal, document.body) : null}
    </div>
  );
}
