import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@forestlee0513/iinfo-dx-design-system";

export default function SignUpPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">회원가입</CardTitle>
        <CardDescription>준비 중입니다.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-foreground underline underline-offset-4">
          로그인
        </Link>
      </CardContent>
    </Card>
  );
}
