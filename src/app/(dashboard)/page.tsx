import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Inbox, Loader2, ClipboardCheck, Send } from "lucide-react";

const statCards = [
  { label: "수집됨", icon: Inbox, value: "—" },
  { label: "가공중", icon: Loader2, value: "—" },
  { label: "검토대기", icon: ClipboardCheck, value: "—" },
  { label: "발행됨", icon: Send, value: "—" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">대시보드</h1>
        <p className="text-sm text-muted-foreground mt-1">
          콘텐츠 수집, 가공, 발행 현황을 한눈에 확인합니다.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <Skeleton className="mt-2 h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline status + Recent publications */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">파이프라인 현황</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">최근 발행 성과</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-4/5" />
          </CardContent>
        </Card>
      </div>

      {/* Realtime pipeline feed */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">실시간 파이프라인 피드</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <Loader2 className="mb-3 h-8 w-8 opacity-30" />
            <p className="text-sm">아직 파이프라인이 없습니다.</p>
            <p className="text-xs mt-1 opacity-70">
              소스를 추가하면 파이프라인이 자동으로 시작됩니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
