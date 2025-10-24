import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // your backend URL
  withCredentials: true, // IMPORTANT: allows cookies to be sent
});

// App Flow
// App mounts → useEffect dispatches fetchUser.
// If accessToken is valid → you get user.
// If accessToken expired → Axios hits /refresh, gets a new one, retries → you still get user.
// If refresh also fails (user really logged out) → thunk rejects, state resets, you show login page.

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post("v1/users/refreshToken");
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh failed:", refreshError);
        // maybe dispatch logout here if using Redux
      }
    }

    return Promise.reject(error);
  }
);

export default api;
