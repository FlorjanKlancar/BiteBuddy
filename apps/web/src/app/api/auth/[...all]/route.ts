import type { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";

async function handler(req: NextRequest) {
	const url = new URL(req.url);
	const targetUrl = `${API_URL}${url.pathname}${url.search}`;

	const headers = new Headers(req.headers);
	headers.delete("host");

	const response = await fetch(targetUrl, {
		method: req.method,
		headers,
		body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
		redirect: "manual",
		// @ts-expect-error -- duplex is required for streaming request bodies
		duplex: "half",
	});

	// Build response headers, preserving individual Set-Cookie entries
	const responseHeaders = new Headers();

	response.headers.forEach((value, key) => {
		const lower = key.toLowerCase();
		if (lower === "transfer-encoding" || lower === "set-cookie") return;
		responseHeaders.set(key, value);
	});

	for (const cookie of response.headers.getSetCookie()) {
		responseHeaders.append("set-cookie", cookie);
	}

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: responseHeaders,
	});
}

export const GET = handler;
export const POST = handler;
