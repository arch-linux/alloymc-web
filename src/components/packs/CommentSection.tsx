"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { CommentItem } from "@/components/mods/CommentItem";

interface CommentData {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
  authorUsername: string;
  authorAvatar: string;
  authorDisplayName: string;
}

interface CommentSectionProps {
  slug: string;
  packOwnerId: number;
}

export function CommentSection({ slug, packOwnerId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/packs/${slug}/comments`);
      if (res.ok) {
        const data = (await res.json()) as { comments: CommentData[] };
        setComments(data.comments);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/packs/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });
      if (res.ok) {
        setNewComment("");
        fetchComments();
      }
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(commentId: number) {
    const res = await fetch(`/api/packs/${slug}/comments/${commentId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setComments(comments.filter((c) => c.id !== commentId));
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse flex gap-3">
            <div className="w-8 h-8 rounded-full bg-obsidian-700" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 bg-obsidian-700 rounded" />
              <div className="h-4 w-3/4 bg-obsidian-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* New comment form */}
      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <img
            src={user.avatarUrl}
            alt={user.displayName}
            className="w-8 h-8 rounded-full flex-shrink-0 mt-1"
          />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Leave a comment..."
              rows={3}
              maxLength={2000}
              className="w-full px-3 py-2 rounded-lg border border-obsidian-700 bg-obsidian-900 text-stone-200 text-sm placeholder:text-stone-500 focus:outline-none focus:border-ember/50 resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={!newComment.trim() || submitting}
                className="px-4 py-2 rounded-lg bg-ember text-obsidian-950 text-sm font-medium hover:bg-ember-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "Posting..." : "Comment"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center py-4 border border-obsidian-700 rounded-lg bg-obsidian-900/50">
          <p className="text-sm text-stone-400">
            <a href="/api/auth/github" className="text-ember hover:text-ember-light">
              Sign in
            </a>{" "}
            to leave a comment.
          </p>
        </div>
      )}

      {/* Comments list */}
      {comments.length === 0 ? (
        <p className="text-center text-sm text-stone-500 py-8">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              {...comment}
              canDelete={
                user?.userId === comment.userId || user?.userId === packOwnerId
              }
              onDelete={() => handleDelete(comment.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
