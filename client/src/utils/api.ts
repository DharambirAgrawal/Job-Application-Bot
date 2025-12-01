const normalizeBaseUrl = (baseUrl?: string | null) => {
  if (!baseUrl) {
    return "";
  }
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
};

const resolveBaseUrl = () => {
  const explicit = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);
  if (explicit) {
    return explicit;
  }

  const dev = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL_DEV);
  const prod = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL_PROD);

  if (process.env.NODE_ENV === "production" && prod) {
    return prod;
  }

  if (process.env.NODE_ENV !== "production" && dev) {
    return dev;
  }

  return "";
};

const API_BASE_URL = resolveBaseUrl();

export const buildApiUrl = (path: string) => {
  if (!API_BASE_URL) {
    return path;
  }

  if (path.startsWith("http")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
