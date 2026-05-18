import { Download, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';

export default function ExportButton({ title, rawUrl }: { title: string; rawUrl: string }) {
  const [open, setOpen] = useState(false);

  async function downloadMd() {
    const response = await fetch(rawUrl);
    if (!response.ok) {
      alert('目前無法取得 Markdown 原始檔。');
      return;
    }
    const text = await response.text();
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${title}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setOpen(false);
  }

  return (
    <div className="export-menu">
      <button className="icon-button" type="button" onClick={() => setOpen(!open)}>
        <Download size={18} />
        <span>匯出</span>
      </button>
      {open && (
        <div className="export-menu__panel">
          <button type="button" onClick={downloadMd}>
            <Download size={16} />
            下載 .md
          </button>
          <button type="button" onClick={copyLink}>
            <LinkIcon size={16} />
            複製連結
          </button>
        </div>
      )}
    </div>
  );
}
