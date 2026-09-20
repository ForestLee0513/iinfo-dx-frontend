import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type LegalDocumentProps = {
  content: string;
};

export function LegalDocument({ content }: LegalDocumentProps) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-6 md:py-12">
      <article className="rounded-3xl bg-card p-6 text-sm leading-7 text-card-foreground shadow-sm ring-1 ring-foreground/5 sm:p-10">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="mt-10 text-xl font-semibold tracking-tight first:mt-0">
                {children}
              </h2>
            ),
            p: ({ children }) => (
              <p className="mt-4 text-muted-foreground first:mt-0">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="mt-4 list-disc space-y-1 pl-5 text-muted-foreground">
                {children}
              </ul>
            ),
            table: ({ children }) => (
              <div className="mt-4 overflow-x-auto rounded-lg border">
                <table className="w-full min-w-175 border-collapse text-left text-xs leading-6">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
            th: ({ children }) => (
              <th className="border-b px-3 py-2 font-semibold">{children}</th>
            ),
            td: ({ children }) => (
              <td className="border-b px-3 py-2 align-top text-muted-foreground last:border-b-0">
                {children}
              </td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </main>
  );
}
