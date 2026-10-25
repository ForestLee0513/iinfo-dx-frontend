import { randomBytes } from "node:crypto";

const MAX_BODY_BYTES = 4 * 1024 * 1024;
const IMPORT_PATH = "/iidx/score-updates/import";

function htmlResponse(body: string, status: number, nonce?: string) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": nonce
        ? `default-src 'none'; script-src 'nonce-${nonce}'; base-uri 'none'; form-action 'none'`
        : "default-src 'none'; base-uri 'none'; form-action 'none'",
    },
  });
}

export async function POST(request: Request) {
  if (request.headers.get("origin") !== "https://p.eagate.573.jp") {
    return htmlResponse("허용되지 않은 요청 출처입니다.", 403);
  }
  if (!request.headers.get("content-type")?.startsWith("multipart/form-data;")) {
    return htmlResponse("올바른 전송 형식이 아닙니다.", 415);
  }
  const declaredLength = Number(request.headers.get("content-length"));
  if (declaredLength > MAX_BODY_BYTES) {
    return htmlResponse("전송할 데이터가 너무 큽니다.", 413);
  }

  let payload: unknown;
  try {
    const form = await request.formData();
    const raw = form.get("payload");
    if (typeof raw !== "string" || Buffer.byteLength(raw) > MAX_BODY_BYTES) {
      return htmlResponse("전송할 데이터가 없거나 너무 큽니다.", 413);
    }
    payload = JSON.parse(raw);
    if (
      !payload ||
      typeof payload !== "object" ||
      !("csv" in payload) ||
      !payload.csv ||
      typeof payload.csv !== "object" ||
      !(
        ("SP" in payload.csv && typeof payload.csv.SP === "string") ||
        ("DP" in payload.csv && typeof payload.csv.DP === "string")
      )
    ) {
      return htmlResponse("성적 데이터 형식이 올바르지 않습니다.", 400);
    }
  } catch {
    return htmlResponse("성적 데이터를 읽을 수 없습니다.", 400);
  }

  const nonce = randomBytes(16).toString("base64");
  const safePayload = JSON.stringify(payload)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
  const body = `<!doctype html>
<html lang="ko">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body>
<p id="status">성적 데이터를 저장하고 IInfoDX로 이동하는 중입니다…</p>
<script nonce="${nonce}">
const payload = ${safePayload};
const status = document.getElementById("status");
const request = indexedDB.open("iinfo-dx-score-import", 1);
request.onupgradeneeded = () => request.result.createObjectStore("uploads");
request.onerror = () => { status.textContent = "브라우저 저장소에 접근할 수 없습니다. 설정을 확인한 뒤 다시 시도해 주세요."; };
request.onsuccess = () => {
  const db = request.result;
  const tx = db.transaction("uploads", "readwrite");
  tx.objectStore("uploads").put(payload, "pending");
  tx.oncomplete = () => location.replace("${IMPORT_PATH}");
  tx.onerror = () => { status.textContent = "성적 데이터를 저장하지 못했습니다. 다시 시도해 주세요."; };
};
</script>
</body></html>`;
  return htmlResponse(body, 200, nonce);
}
