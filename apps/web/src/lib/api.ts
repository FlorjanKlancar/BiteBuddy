const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
	const res = await fetch(`${API_URL}${path}`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...options?.headers,
		},
		...options,
	});

	if (!res.ok) {
		const body = await res.text().catch(() => res.statusText);
		console.error(`API ${res.status} ${path}:`, body);
		let message = "Request failed";
		try {
			const parsed = JSON.parse(body);
			message = parsed.error ?? parsed.message ?? message;
		} catch {
			message = body || message;
		}
		throw new Error(message);
	}

	return res.json();
}
