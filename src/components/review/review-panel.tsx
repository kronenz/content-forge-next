"use client";

import { useState } from "react";
import { CheckCircle2, RotateCcw, XCircle, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { trpc } from "@/lib/trpc";
import { QualityScorecard } from "./quality-scorecard";
import { InlineFeedback } from "./inline-feedback";

const ROLE_LABELS: Record<string, string> = {
  analyst: "분석관",
  writer: "기자",
  editor: "편집자",
  platform_formatter: "포맷터",
  designer: "디자이너",
  seo_optimizer: "SEO",
  fact_checker: "팩트체커",
  compliance: "컴플라이언스",
  localizer: "현지화",
};

interface ReviewPanelProps {
  review: {
    id: string;
    status: "pending" | "approved" | "revision" | "rejected";
    qualityScore: number | null;
    accuracyScore: number | null;
    humanLikeScore: number | null;
    platformFitScore: number | null;
    cultureFitScore: number | null;
    feedback: string | null;
    inlineComments: Array<{
      id: string;
      selectedText: string;
      comment: string;
      position: { start: number; end: number };
      createdAt: string;
    }> | null;
    processedContent: {
      id: string;
      platform: string;
      title: string | null;
      body: string;
    } | null;
    pipelineRun: {
      id: string;
      rawContent: { title: string | null; body: string } | null;
      steps: Array<{
        id: string;
        agentRole: string;
        status: string;
        output: Record<string, unknown> | null;
      }>;
    } | null;
  };
  onUpdate?: () => void;
}

export function ReviewPanel({ review, onUpdate }: ReviewPanelProps) {
  const [scores, setScores] = useState({
    quality: review.qualityScore,
    accuracy: review.accuracyScore,
    humanLike: review.humanLikeScore,
    platformFit: review.platformFitScore,
    cultureFit: review.cultureFitScore,
  });
  const [feedback, setFeedback] = useState(review.feedback ?? "");
  const [inlineComments, setInlineComments] = useState(
    review.inlineComments ?? [],
  );

  const decisionMutation = trpc.review.updateDecision.useMutation({
    onSuccess: () => {
      onUpdate?.();
      toast.success("검토 결과가 저장되었습니다");
    },
    onError: (err) => toast.error(err.message),
  });

  const addCommentMutation = trpc.review.addInlineComment.useMutation({
    onSuccess: () => onUpdate?.(),
  });

  const isDecided = review.status !== "pending";
  const contentBody = review.processedContent?.body ?? "";

  const handleDecision = (
    status: "approved" | "revision" | "rejected",
  ) => {
    decisionMutation.mutate({
      id: review.id,
      status,
      feedback: feedback || undefined,
    });
  };

  const handleAddComment = (
    comment: (typeof inlineComments)[number],
  ) => {
    setInlineComments([...inlineComments, comment]);
    addCommentMutation.mutate({ id: review.id, comment });
  };

  const handleRemoveComment = (commentId: string) => {
    setInlineComments(inlineComments.filter((c) => c.id !== commentId));
  };

  return (
    <div className="space-y-6">
      {/* Main two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Preview area */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">콘텐츠 프리뷰</CardTitle>
            </CardHeader>
            <CardContent>
              {review.processedContent ? (
                <InlineFeedback
                  content={contentBody}
                  comments={inlineComments}
                  onAddComment={!isDecided ? handleAddComment : undefined}
                  onRemoveComment={
                    !isDecided ? handleRemoveComment : undefined
                  }
                  readonly={isDecided}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  연결된 콘텐츠가 없습니다
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Scoring + Feedback */}
        <div className="space-y-4">
          <QualityScorecard
            scores={scores}
            onScoreChange={
              !isDecided
                ? (key, value) =>
                    setScores((prev) => ({ ...prev, [key]: value }))
                : undefined
            }
            readonly={isDecided}
          />

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">피드백</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="피드백을 입력하세요..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                disabled={isDecided}
                className="min-h-24"
              />

              {!isDecided && (
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleDecision("approved")}
                    disabled={decisionMutation.isPending}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    승인
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleDecision("revision")}
                    disabled={decisionMutation.isPending}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    수정요청
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleDecision("rejected")}
                    disabled={decisionMutation.isPending}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    반려
                  </Button>
                </div>
              )}

              {isDecided && (
                <Badge
                  variant={
                    review.status === "approved"
                      ? "default"
                      : review.status === "rejected"
                        ? "destructive"
                        : "outline"
                  }
                >
                  {review.status === "approved"
                    ? "승인됨"
                    : review.status === "rejected"
                      ? "반려됨"
                      : "수정요청됨"}
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom: Pipeline steps collapsible */}
      {review.pipelineRun?.steps && review.pipelineRun.steps.length > 0 && (
        <Collapsible>
          <Card>
            <CardHeader className="pb-0">
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <CardTitle className="text-sm">
                  파이프라인 단계별 데이터
                </CardTitle>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="pt-4 space-y-3">
                {review.pipelineRun.steps.map((step) => (
                  <div
                    key={step.id}
                    className="rounded-md border p-3 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {ROLE_LABELS[step.agentRole] ?? step.agentRole}
                      </Badge>
                      <Badge
                        variant={
                          step.status === "completed"
                            ? "default"
                            : step.status === "failed"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {step.status}
                      </Badge>
                    </div>
                    {step.output && (
                      <pre className="text-xs bg-muted rounded p-2 overflow-x-auto max-h-40">
                        {JSON.stringify(step.output, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}
    </div>
  );
}
