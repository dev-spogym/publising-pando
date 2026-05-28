import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 p-10">
      <div className="mx-auto max-w-xl rounded-xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-blue-700">V1 Publishing</p>
        <h1 className="mt-2 text-2xl font-bold">등록되지 않은 화면입니다</h1>
        <p className="mt-3 text-sm text-slate-600">docs4/V1 D01~D03 범위에 포함된 SCR 라우트만 정적 생성됩니다.</p>
        <Button asChild className="mt-6"><Link href="/members">회원 목록으로 이동</Link></Button>
      </div>
    </main>
  );
}
