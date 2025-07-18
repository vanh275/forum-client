import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/index.jsx";
import { store, persistor } from "./redux/store.js";
import LoadingScreen from "./components/LoadingScreen.jsx";
import { refreshToken } from "./api/auth";
import {
  setAuthSuccess,
  setAccessToken,
  setLogout,
} from "./redux/slices/authSlice";
import { setUser } from "./redux/slices/userSlice";
import "./index.css";

const handleBeforeLift = async () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    console.log("✅ Không có token, bỏ qua refresh");
    return;
  }
  try {
    store.dispatch(setAccessToken(token));
    const res = await refreshToken();
    const { access_token, user } = res.DT;
    store.dispatch(setAuthSuccess({ access_token }));
    store.dispatch(setUser(user));
    localStorage.setItem("access_token", access_token);
    console.log("Đã refresh token và cập nhật redux");
  } catch (err) {
    console.error("Refresh token lỗi:", err?.response?.data || err.message);
    if (err.response?.status === 401 || err.response?.status === 403) {
      store.dispatch(setLogout());
      store.dispatch(setUser(null));
      localStorage.removeItem("access_token");
    }
  }
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={<LoadingScreen />}
        persistor={persistor}
        onBeforeLift={handleBeforeLift}
      >
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);
