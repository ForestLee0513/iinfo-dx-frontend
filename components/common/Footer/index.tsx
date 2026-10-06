import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground md:flex-row md:px-6 xl:px-12">
        <p>&copy; {new Date().getFullYear()} IInfo DX</p>
        <Link
          href="/attribution"
          className="underline underline-offset-2 hover:text-foreground"
        >
          오픈소스 및 출처
        </Link>
      </div>
    </footer>
  );
}
