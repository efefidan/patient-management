export const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";

export const API_ROUTES = {
  patients: `${STRAPI_BASE_URL}/api/auth/local/register`,  // 🔥 **Tam URL olarak düzelttim**
  doctors: `${STRAPI_BASE_URL}/api/doctors`,
  appointments: `${STRAPI_BASE_URL}/api/appointments`,
  storage: `${STRAPI_BASE_URL}/api/upload`,
};
