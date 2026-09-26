const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

/**
 * Client HTTP standard pour appeler les APIs du backend depuis le frontend
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${BACKEND_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      // Pas de mise en cache agressive pour les données temps réel du COD
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (!res.ok) {
      if (isJson) {
        try {
          const errorData = await res.json();
          return {
            success: false,
            error: errorData.error || `Erreur serveur (${res.status})`,
            details: errorData.details,
          };
        } catch {
          return {
            success: false,
            error: `Erreur serveur (${res.status})`,
          };
        }
      }

      // Si le backend a renvoyé du HTML (ex: 500 Next.js error page, 404, etc.)
      const rawText = await res.text().catch(() => "");
      const match = rawText.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i) || rawText.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const extractedMessage = match ? match[1].replace(/<[^>]+>/g, "").trim() : "";

      return {
        success: false,
        error: extractedMessage
          ? `Erreur serveur (${res.status}): ${extractedMessage.slice(0, 150)}`
          : `Erreur serveur (${res.status}). Vérifiez les logs du backend.`,
      };
    }

    if (isJson) {
      return await res.json();
    }

    const textData = await res.text();
    return {
      success: true,
      data: textData as unknown as T,
    };
  } catch (error: unknown) {
    const isNetworkError =
      error instanceof TypeError && error.message.includes("fetch");

    return {
      success: false,
      error: isNetworkError
        ? `Impossible de joindre le backend (${BACKEND_URL}). Assurez-vous que le backend tourne sur le port 3001.`
        : error instanceof Error
        ? error.message
        : "Erreur de communication avec le backend.",
    };
  }
}
