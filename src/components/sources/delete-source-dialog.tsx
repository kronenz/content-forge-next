"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

interface DeleteSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: { id: string; name: string };
}

export function DeleteSourceDialog({
  open,
  onOpenChange,
  source,
}: DeleteSourceDialogProps) {
  const utils = trpc.useUtils();

  const deleteMutation = trpc.source.delete.useMutation({
    onSuccess: () => {
      utils.source.list.invalidate();
      onOpenChange(false);
    },
    onError: (err) => {
      console.error("소스 삭제 실패:", err.message);
    },
  });

  function handleDelete() {
    deleteMutation.mutate({ id: source.id });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>소스 삭제</DialogTitle>
          <DialogDescription>
            정말 &apos;{source.name}&apos; 소스를 삭제하시겠습니까?
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          이 작업은 되돌릴 수 없으며, 수집된 콘텐츠도 함께 삭제됩니다.
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "삭제 중..." : "삭제"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
