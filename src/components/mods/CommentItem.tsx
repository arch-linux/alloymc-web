"use client";

import { TrashIcon } from "@/components/icons";
import { formatRelativeTime } from "@/lib/utils/format";

interface CommentItemProps {
  id: number;
  content: string;
  createdAt: string;
  authorUsername: string;
  authorAvatar: string;
  authorDisplayName: string;
  canDelete: boolean;
  onDelete: () => void;
}

export function CommentItem({
  content,
  createdAt,
  authorUsername,
  authorAvatar,
  authorDisplayName,
  canDelete,
  onDelete,
}: CommentItemProps) {
  return (
    <div className="flex gap-3 group">
      <img
        src={authorAvatar}
        alt={authorDisplayName}
        className="w-8 h-8 rounded-full flex-shrink-0 mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-stone-200">{authorDisplayName}</span>
          <span className="text-xs text-stone-500">@{authorUsername}</span>
          <span className="text-xs text-stone-600">
            {formatRelativeTime(new Date(createdAt))}
          </span>
          {canDelete && (
            <button
              onClick={onDelete}
              className="ml-auto opacity-0 group-hover:opacity-100 p-1 text-stone-500 hover:text-red-400 transition-all"
              aria-label="Delete comment"
            >
              <TrashIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <p className="text-sm text-stone-300 mt-1 whitespace-pre-wrap break-words">{content}</p>
      </div>
    </div>
  );
}
