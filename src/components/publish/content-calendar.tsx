"use client";

import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

const PLATFORM_COLORS: Record<string, string> = {
  blog: "bg-blue-500",
  linkedin: "bg-sky-500",
  twitter: "bg-slate-500",
  instagram: "bg-pink-500",
};

const PLATFORM_LABELS: Record<string, string> = {
  blog: "Blog",
  linkedin: "LinkedIn",
  twitter: "X",
  instagram: "Instagram",
};

export function ContentCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState(new Date());

  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59);

  const { data: publications } = trpc.publish.getByDateRange.useQuery(
    { start, end },
    { enabled: true },
  );

  const pubsByDate = useMemo(() => {
    if (!publications) return new Map<string, typeof publications>();
    const map = new Map<string, typeof publications>();
    for (const pub of publications) {
      const dateKey = pub.scheduledAt
        ? new Date(pub.scheduledAt).toISOString().slice(0, 10)
        : new Date(pub.createdAt).toISOString().slice(0, 10);
      const existing = map.get(dateKey) ?? [];
      existing.push(pub);
      map.set(dateKey, existing);
    }
    return map;
  }, [publications]);

  const selectedDateKey = selectedDate?.toISOString().slice(0, 10);
  const selectedPubs = selectedDateKey ? (pubsByDate.get(selectedDateKey) ?? []) : [];

  const datesWithPubs = useMemo(() => {
    return Array.from(pubsByDate.keys()).map((d) => new Date(d + "T00:00:00"));
  }, [pubsByDate]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">콘텐츠 캘린더</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={month}
            onMonthChange={setMonth}
            modifiers={{ hasPubs: datesWithPubs }}
            modifiersClassNames={{ hasPubs: "bg-primary/10 font-bold" }}
            className="rounded-md border"
          />
          <div className="flex gap-3 mt-4 text-xs">
            {Object.entries(PLATFORM_COLORS).map(([key, color]) => (
              <div key={key} className="flex items-center gap-1">
                <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
                <span>{PLATFORM_LABELS[key]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {selectedDate
              ? selectedDate.toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "날짜를 선택하세요"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedPubs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              {selectedDate
                ? "이 날짜에 예약된 발행이 없습니다"
                : "캘린더에서 날짜를 클릭하면 해당 일자의 발행 목록을 볼 수 있습니다"}
            </p>
          ) : (
            <div className="space-y-3">
              {selectedPubs.map((pub) => (
                <div
                  key={pub.id}
                  className="flex items-center gap-3 rounded-md border p-3"
                >
                  <div
                    className={`h-3 w-3 rounded-full shrink-0 ${
                      PLATFORM_COLORS[pub.platform] ?? "bg-gray-500"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {pub.processedContent?.title ?? "제목 없음"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {PLATFORM_LABELS[pub.platform] ?? pub.platform}
                      {pub.scheduledAt &&
                        ` · ${new Date(pub.scheduledAt).toLocaleTimeString("ko-KR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`}
                    </p>
                  </div>
                  <Badge
                    variant={
                      pub.status === "published"
                        ? "default"
                        : pub.status === "failed"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {pub.status === "scheduled"
                      ? "예약"
                      : pub.status === "publishing"
                        ? "발행 중"
                        : pub.status === "published"
                          ? "발행됨"
                          : "실패"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
