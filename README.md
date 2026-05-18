# 音樂創作集

這是一個以 Markdown 筆記為資料來源的 Astro 靜態網站。每一篇作品都放在 `src/content/songs/`，網站會依照 frontmatter 自動生成首頁、全部作品、作品類別、創作角色與專輯頁。

## 為什麼選 Astro

你的需求比較適合 Astro，而不是 MkDocs 或 Zensical：

- Astro 是內容型靜態網站框架，Markdown/MDX 是一等公民。
- Content Collections 可以驗證每篇 MD 的欄位，避免歌名、專輯、角色拼錯後悄悄壞掉。
- 頁面預先生成，適合部署到 GitHub Pages，再讓帽子雲或其他鏡像服務抓靜態檔。
- 互動功能可以用 React island 局部載入，不會把整個網站變成重型 SPA。
- `astro.config.mjs` 只使用 `BASE_PATH` 設定資源路徑，不綁定固定站點網域，方便 GitHub Pages 與鏡像站共用同一份靜態輸出。

## 目錄

```text
src/
  content.config.ts        # Markdown 欄位 schema
  config/site.ts           # 分類、專輯、路徑設定
  content/songs/           # 每首歌一篇 .md 或 .mdx
  components/              # 卡片、收藏、匯出與搜尋元件
  layouts/BaseLayout.astro # 全站版型
  pages/                   # Astro 路由
```

## 新增一首歌

在 `src/content/songs/` 新增一個 Markdown 檔，例如 `src/content/songs/新歌名.md`：

```md
---
title: "新歌名"
description: "一句短介紹，會出現在卡片上"
pubDate: 2026-04-27
coverColor: "#930531"
vocalist: "演唱者"
lyricist: "你的名字"
composer: "你的名字"
arranger: ""
credits:
  - role: "製作人"
    name: "某某"
roles:
  - 作詞
  - 作曲
isOriginalVocal: false
album: 光的迴響
tags:
  - 抒情
featured: false
externalLinks:
  - label: "試聽"
    url: "https://example.com"
---

## 歌詞

這裡放歌詞。

## Lyrics Translation

這裡放英文翻譯，沒有就刪掉整段。

## 創作理念

這裡放中文創作理念。

## Statement

這裡放英文創作理念，沒有就刪掉整段。
```

## 欄位說明

| 欄位 | 用途 |
| --- | --- |
| `title` | 歌名，必填 |
| `description` | 卡片與 meta 描述 |
| `pubDate` | 最早發布/公開日期；若後續收錄進 EP/專輯，仍保留最早日期 |
| `coverColor` | 卡片主色，建議使用 `#930531`、`#990531`、`#CC5311` 或專輯延伸色 |
| `vocalist` | 演唱 |
| `lyricist` / `composer` / `arranger` | 作詞、作曲、編曲人名，可空白 |
| `credits` | 製作人、混音、錄音工程等彈性資訊 |
| `roles` | 你在這首歌中的創作角色，可同時填 `作詞`、`作曲`、`編曲` |
| `isOriginalVocal` | 是否為原唱作品 |
| `album` | 只能填 `src/config/site.ts` 內列出的專輯 |
| `featured` | 是否出現在首頁精選 |
| `draft` | 設為 `true` 就不會出現在正式網站 |

## 本機開發

```sh
pnpm install
pnpm dev
```

瀏覽 `http://localhost:4321`。

正式打包檢查：

```sh
pnpm build
pnpm preview
```

## 從 0 部署到 GitHub Pages

1. 到 GitHub 用不常用的帳號建立新 repo，例如 `lyrics-site`。
2. 在本機專案設定遠端：

```sh
git remote add origin https://github.com/<你的帳號>/lyrics-site.git
git branch -M main
git add .
git commit -m "Initialize Astro lyrics site"
git push -u origin main
```

3. 到 GitHub repo 的 `Settings -> Pages`，Source 選 `GitHub Actions`。
4. 到 `Settings -> Actions -> General`，確認 Actions 有啟用。
5. 等 `.github/workflows/deploy.yml` 執行完成，網站會出現在 `https://<你的帳號>.github.io/lyrics-site/`。

這個 repo 的 workflow 會自動設定：

- `BASE_PATH`: 預設為 `/<repo-name>`，讓 GitHub Pages 專案頁與鏡像路徑都能找到資源。

如果你的 repo 名稱是 `<帳號>.github.io`，代表網站在根路徑，請在 GitHub Variables 設定：

```text
BASE_PATH=/
```

## 匯出 Markdown

每篇作品頁都有「匯出」按鈕，會從 `/raw/<檔名>.md` 下載原始 Markdown。這適合匯入 Obsidian、Logseq、思源筆記或其他本機筆記軟體。

## 調整分類與專輯

修改 `src/config/site.ts`：

- 新增專輯：加到 `albums` 與 `albumConfig`
- 新增創作角色：加到 `roles` 與 `roleConfig`

修改後執行：

```sh
pnpm build
```

如果某篇 MD 填了不存在的專輯或角色，build 會報錯，這是刻意設計的資料保護。
