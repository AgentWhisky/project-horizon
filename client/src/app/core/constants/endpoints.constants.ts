const TOKEN_EXCLUDED_ENDPOINTS_LIST = ['/api/login', '/api/refresh'] as const;

export const TOKEN_EXCLUDED_ENDPOINTS: Set<string> = new Set(TOKEN_EXCLUDED_ENDPOINTS_LIST);
