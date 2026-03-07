"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Minimize2,
  Maximize2,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function AIChat() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "안녕하세요! Content Forge AI 어시스턴트입니다. 콘텐츠 관련 질문이나 작업 요청을 해주세요.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (real implementation would call the AI API)
    setTimeout(() => {
      const responses: Record<string, string> = {
        default:
          "이 기능은 AI 모델 연동 후 정식으로 동작합니다. 현재는 데모 모드입니다.",
      };

      const lowerInput = userMessage.content.toLowerCase();
      let response = responses.default ?? "도움이 필요하시면 말씀해주세요.";

      if (lowerInput.includes("성과") || lowerInput.includes("분석")) {
        response =
          "분석 대시보드에서 플랫폼별 성과, 품질 추이, 승인률을 확인할 수 있습니다. /analytics 페이지로 이동하시겠습니까?";
      } else if (lowerInput.includes("소스") || lowerInput.includes("추가")) {
        response =
          "새 소스를 추가하시려면 소스 관리 페이지에서 '+ 소스 추가' 버튼을 클릭하세요. RSS, API, Web 스크래핑, Research Agent 타입을 지원합니다.";
      } else if (
        lowerInput.includes("파이프라인") ||
        lowerInput.includes("실행")
      ) {
        response =
          "파이프라인 페이지에서 수집된 콘텐츠를 선택하고 '파이프라인 실행' 버튼으로 AI Agent 체인을 시작할 수 있습니다.";
      } else if (lowerInput.includes("발행") || lowerInput.includes("배포")) {
        response =
          "발행 페이지에서 가공 완료된 콘텐츠를 Blog, LinkedIn, X, Instagram에 발행할 수 있습니다. 크로스 포스팅과 예약 발행도 지원됩니다.";
      } else if (lowerInput.includes("검토") || lowerInput.includes("승인")) {
        response =
          "검토 페이지에서 AI가 가공한 콘텐츠의 품질을 5대 지표로 평가하고, 승인/수정/반려를 결정할 수 있습니다. 자동 승인 설정은 분석 > 자동 승인 탭에서 관리합니다.";
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  }

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg"
        size="sm"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col rounded-xl border bg-card shadow-2xl transition-all ${
        minimized ? "h-12 w-72" : "h-[500px] w-96"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-xl border-b bg-primary px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
            AI
          </div>
          <span className="text-sm font-medium text-primary-foreground">
            AI 어시스턴트
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-primary-foreground hover:bg-white/20"
            onClick={() => setMinimized(!minimized)}
          >
            {minimized ? (
              <Maximize2 className="h-3.5 w-3.5" />
            ) : (
              <Minimize2 className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-primary-foreground hover:bg-white/20"
            onClick={() => setOpen(false)}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <Avatar size="sm">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      AI
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2">
                <Avatar size="sm">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg bg-muted px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="flex-1 text-sm"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!input.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
