import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const api = axios.create({ baseURL: BASE_URL })

// Endpoints that must never carry an (possibly stale/expired/blacklisted)
// Authorization header. If a leftover access_token from a previous session
// is attached here, DRF's global JWTAuthentication rejects the request with
// 401 before the view (e.g. LoginView) ever runs — even though
// permission_classes = [AllowAny] is set, since AllowAny only skips the
// permission check, not authentication.
const PUBLIC_AUTH_PATHS = [
  '/auth/login/',
  '/auth/admin-login/',
  '/auth/register/',
  '/auth/verify-email/',
  '/auth/forgot-password/',
  '/auth/reset-password/',
  '/auth/token/refresh/',
]

const isPublicAuthPath = (url = '') => PUBLIC_AUTH_PATHS.some((p) => url.includes(p))

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token && !isPublicAuthPath(config.url)) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }
  return config
})

let isRefreshing = false
let queue = []

const processQueue = (error, token = null) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve(token)))
  queue = []
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }
      originalRequest._retry = true
      isRefreshing = true
      const refresh = localStorage.getItem('refresh_token')
      if (!refresh) {
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(error)
      }
      try {
        // ROTATE_REFRESH_TOKENS + BLACKLIST_AFTER_ROTATION are both on in
        // SIMPLE_JWT settings, so every refresh call blacklists the old
        // refresh token and issues a new one. The old code only persisted
        // the new access token, never the rotated refresh token — so after
        // the very first silent refresh, the stored refresh_token was
        // already blacklisted, and the *next* refresh would fail and
        // force-log-out a user who should still have days left on their
        // session. Must persist both.
        const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh })
        localStorage.setItem('access_token', data.access)
        if (data.refresh) {
          localStorage.setItem('refresh_token', data.refresh)
        }
        processQueue(null, data.access)
        originalRequest.headers.Authorization = `Bearer ${data.access}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  },
)

export default api
