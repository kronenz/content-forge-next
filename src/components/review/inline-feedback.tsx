"use client";

import { useState, useCallback } from "react";
import { MessageSquarePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface InlineComment {
  id: string;
  selectedText: string;
  comment: string;
  position: { start: number; end: number };
  createdAt: string;
}

interface InlineFeedbackProps {
  content: string;
  comments: InlineComment[];
  onAddComment?: (comment: InlineComment) => void;
  onRemoveComment?: (id: string) => void;
  readonly?: boolean;
}

export function InlineFeedback({
  content,
  comments,
  onAddComment,
  onRemoveComment,
  readonly = false,
}: InlineFeedbackProps) {
  const [selectedText, setSelectedText] = useState("");
  const [selectionRange, setSelectionRange] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [newComment, setNewComment] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleTextSelect = useCallback(() => {
    if (readonly) return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const text = selection.toString().trim();
    if (!text) return;

    const range = selection.getRangeAt(0);
    const container = range.startContainer.parentElement?.closest(
      "[data-content-area]",
    );
    if (!container) return;

    const start = content.indexOf(text);
    if (start === -1) return;

    setSelectedText(text);
    setSelectionRange({ start, end: start + text.length });
    setShowInput(true);
  }, [content, readonly]);

  const handleAddComment = () => {
    if (!selectionRange || !newComment.trim() || !onAddComment) return;

    onAddComment({
      id: crypto.randomUUID(),
      selectedText,
      comment: newComment.trim(),
      position: selectionRange,
      createdAt: new Date().toISOString(),
    });

    setNewComment("");
    setShowInput(false);
    setSelectedText("");
    setSelectionRange(null);
  };

  const renderHighlightedContent = () => {
    if (comments.length === 0) return content;

    const sorted = [...comments].sort(
      (a, b) => a.position.start - b.position.start,
    );
    const parts: Array<{ text: string; highlighted: boolean; commentId?: string }> = [];
    let cursor = 0;

    for (const c of sorted) {
      if (c.position.start > cursor) {
        parts.push({
          text: content.slice(cursor, c.position.start),
          highlighted: false,
        });
      }
      parts.push({
        text: content.slice(c.position.start, c.position.end),
        highlighted: true,
        commentId: c.id,
      });
      cursor = c.position.end;
    }
    if (cursor < content.length) {
      parts.push({ text: content.slice(cursor), highlighted: false });
    }

    return parts.map((part, i) =>
      part.highlighted ? (
        <mark
          key={i}
          className="bg-yellow-200 dark:bg-yellow-800 cursor-pointer rounded-sm px-0.5"
          title={
            comments.find((c) => c.id === part.commentId)?.comment ?? ""
          }
        >
          {part.text}
        </mark>
      ) : (
        <span key={i}>{part.text}</span>
      ),
    );
  };

  return (
    <div className="space-y-4">
      <div
        data-content-area
        className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap rounded-lg border p-4 cursor-text"
        onMouseUp={handleTextSelect}
      >
        {renderHighlightedContent()}
      </div>

      {showInput && !readonly && (
        <Card size="sm">
          <CardContent className="pt-3 space-y-2">
            <div className="text-xs text-muted-foreground">
              선택한 텍스트:{" "}
              <span className="font-medium text-foreground">
                &quot;{selectedText.slice(0, 80)}
                {selectedText.length > 80 ? "..." : ""}&quot;
              </span>
            </div>
            <Textarea
              placeholder="코멘트 입력..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-12"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowInput(false);
                  setNewComment("");
                }}
              >
                취소
              </Button>
              <Button
                size="sm"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                <MessageSquarePlus className="h-3 w-3 mr-1" />
                추가
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {comments.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              인라인 코멘트 ({comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {comments.map((c) => (
              <div
                key={c.id}
                className="flex items-start gap-2 rounded-md border p-2 text-sm"
              >
                <div className="flex-1 space-y-1">
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    &quot;{c.selectedText}&quot;
                  </p>
                  <p>{c.comment}</p>
                </div>
                {!readonly && onRemoveComment && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 shrink-0"
                    onClick={() => onRemoveComment(c.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
