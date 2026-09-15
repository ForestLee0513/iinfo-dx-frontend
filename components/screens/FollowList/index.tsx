"use client";

import { useState } from "react";
import Link from "next/link";
import { IconChevronLeft, IconChevronRight, IconUsers } from "@tabler/icons-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useFollowersQuery, useFollowingQuery } from "@/api/profile/queries";
import { useAuthReady } from "@/providers/AuthReadyContext";
import type { FollowListProps } from "./types";

const PER_PAGE = 20;

export function FollowList({ identifier, type }: FollowListProps) {
  const [page, setPage] = useState(1);
  const ready = useAuthReady();
  const params = { page, per_page: PER_PAGE };
  const followers = useFollowersQuery(ready && type === "followers" ? identifier : undefined, params);
  const following = useFollowingQuery(ready && type === "following" ? identifier : undefined, params);
  const list = type === "followers" ? followers : following;
  const title = type === "followers" ? "팔로워" : "팔로잉";

  if (list.isPending) {
    return <FollowListSkeleton />;
  }

  if (list.isError) {
    return (
      <main className="mx-auto w-full max-w-2xl px-3 py-4 sm:px-6 sm:py-10">
        <Alert variant="destructive">
          <AlertTitle>{title} 목록을 볼 수 없습니다</AlertTitle>
          <AlertDescription>
            존재하지 않는 프로필이거나, 비공개 프로필의 목록에 접근할 권한이 없습니다.
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  const { users, total, per_page: perPage } = list.data;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <main className="mx-auto w-full max-w-2xl px-3 py-4 sm:px-6 sm:py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">총 {total}명</p>
        </div>
        <Button variant="outline" nativeButton={false} render={<Link href={`/profile/${identifier}`} />}>
          프로필로
        </Button>
      </div>

      {users.length === 0 ? (
        <Empty className="mt-8 border">
          <EmptyHeader>
            <EmptyMedia variant="icon"><IconUsers /></EmptyMedia>
            <EmptyTitle>{title}가 없습니다</EmptyTitle>
            <EmptyDescription>아직 표시할 사용자가 없습니다.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="mt-8 divide-y rounded-2xl border">
          {users.map((user) => {
            const name = user.nickname ?? (user.handle ? `@${user.handle}` : "닉네임 미설정");
            const initial = (user.handle ?? user.nickname ?? "?").replace(/^@/, "").charAt(0).toUpperCase();

            return (
              <li key={user.id}>
                <Link href={`/profile/${user.handle ?? user.id}`} className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/50">
                  <Avatar className="size-11 shrink-0">
                    {user.profile_image_url && <AvatarImage src={user.profile_image_url} alt={`${name} 프로필 이미지`} />}
                    <AvatarFallback>{initial}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{name}</p>
                    {user.handle && <p className="truncate text-sm text-muted-foreground">@{user.handle}</p>}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-center gap-2" aria-label={`${title} 목록 페이지 이동`}>
          <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage((value) => value - 1)} aria-label="이전 페이지">
            <IconChevronLeft className="size-4" />
          </Button>
          <span className="min-w-20 text-center text-sm text-muted-foreground">{page} / {totalPages}</span>
          <Button variant="outline" size="icon" disabled={page === totalPages} onClick={() => setPage((value) => value + 1)} aria-label="다음 페이지">
            <IconChevronRight className="size-4" />
          </Button>
        </nav>
      )}
    </main>
  );
}

function FollowListSkeleton() {
  return (
    <main className="mx-auto w-full max-w-2xl px-3 py-4 sm:px-6 sm:py-10">
      <Skeleton className="h-10 w-32" />
      <div className="mt-8 space-y-3 rounded-2xl border p-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </main>
  );
}
