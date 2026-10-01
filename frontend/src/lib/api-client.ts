const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:3001";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

export interface ApiFetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * Client HTTP standard pour appeler les APIs du backend depuis le frontend
 */
export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<ApiResponse<T>> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${BACKEND_URL}${cleanEndpoint}`;

  // Timeout généreux de 30 secondes pour tolérer la compilation Next.js dev et les appels IA
  const timeoutMs = options.timeout ?? 30000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const fetchOptions: RequestInit = {
    ...options,
    signal: options.signal || controller.signal,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
  };

  try {
    let res: Response;
    try {
      res = await fetch(url, fetchOptions);
    } catch (primaryErr: unknown) {
      // Fallback si 127.0.0.1 a échoué : tenter http://localhost:3001
      const isConnectionErr =
        primaryErr instanceof TypeError &&
        (primaryErr.message.includes("fetch") || primaryErr.message.includes("ECONNREFUSED"));

      if (isConnectionErr && BACKEND_URL.includes("127.0.0.1")) {
        const fallbackUrl = `http://localhost:3001${cleanEndpoint}`;
        try {
          res = await fetch(fallbackUrl, fetchOptions);
        } catch {
          throw primaryErr;
        }
      } else {
        throw primaryErr;
      }
    } finally {
      clearTimeout(timeoutId);
    }

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
    clearTimeout(timeoutId);

    const isAbort =
      error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError");
    const isNetworkError =
      error instanceof TypeError && error.message.includes("fetch");

    return {
      success: false,
      error: isAbort
        ? `Délai d'attente dépassé (${Math.round(timeoutMs / 1000)}s) pour joindre le backend (${url}). Assurez-vous que le serveur backend et MySQL sont bien actifs.`
        : isNetworkError
        ? `Impossible de joindre le backend (${BACKEND_URL}). Assurez-vous que le backend tourne sur le port 3001.`
        : error instanceof Error
        ? error.message
        : "Erreur de communication avec le backend.",
    };
  }
}
