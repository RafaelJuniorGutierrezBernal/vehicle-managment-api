import keycloak from '../keycloak';

export const API_BASE_URL = 'http://localhost:8081/api';

export const getHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  ...(keycloak.token ? { Authorization: `Bearer ${keycloak.token}` } : {}),
});
