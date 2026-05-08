export function jsonResponse(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  if (!headers.has("content-type")) {
    headers.set("content-type", "application/json; charset=utf-8");
  }

  return new Response(JSON.stringify(data, null, 2), {
    ...init,
    headers
  });
}

export function notFound(message = "Not found"): Response {
  return jsonResponse({ error: message }, { status: 404 });
}

export function forbidden(message = "Forbidden"): Response {
  return jsonResponse({ error: message }, { status: 403 });
}
