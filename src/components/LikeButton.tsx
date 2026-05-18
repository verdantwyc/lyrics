import { Heart } from 'lucide-react';

export default function LikeButton({ noteId: _noteId }: { noteId: string }) {
  return (
    <button className="icon-button is-active is-decorative" type="button" aria-disabled="true" tabIndex={-1}>
      <Heart size={18} fill="currentColor" />
      <span>已收藏</span>
    </button>
  );
}
