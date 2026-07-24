/**
 * Client-side JSONP fetch for the Apps Script API (avoids CORS issues that a
 * plain fetch() would hit against a Google Apps Script exec URL from the browser).
 * Server components should use lib/api.ts's direct fetch() instead.
 */
export function fetchFromSheet<T = unknown>(
  baseUrl: string,
  action?: string,
  params: Record<string, string> = {}
): Promise<T> {
  return new Promise((resolve, reject) => {
    const cb = `__cb_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const qs = new URLSearchParams({ cb, t: String(Date.now()), ...params });
    if (action) qs.set("action", action);

    const script = document.createElement("script");
    let settled = false;

    const cleanup = () => {
      delete (window as unknown as Record<string, unknown>)[cb];
      if (script.parentNode) script.parentNode.removeChild(script);
    };

    (window as unknown as Record<string, (data: T) => void>)[cb] = (data: T) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(data);
    };

    script.onerror = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error("JSONP request failed"));
    };

    script.src = `${baseUrl}?${qs.toString()}`;
    document.body.appendChild(script);

    setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error("timeout"));
    }, 10000);
  });
}
