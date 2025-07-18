import { Routes, Route, Navigate } from "react-router-dom";
import ForumPage from "../pages/Forum/ForumPage";
import Home from "../pages/Home";
import MainLayout from "../layout/MainLayout";
import PostPage from "../pages/Forum/PostPage";
import socket from "../socket";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAuthSuccess,
  setAccessToken,
  setLogout,
} from "../redux/slices/authSlice";
import { setUser } from "../redux/slices/userSlice";
import { refreshToken } from "../api/auth";
import LoadingScreen from "../components/LoadingScreen";
import NewsPage from "../pages/News/NewsPage";
import CreateArticlePage from "../pages/News/Article/CreateArticlePage";
import ArticlePage from "../pages/News/Article/ArticlePage";
import ExpertViewPage from "../pages/ExpertView/ExpertViewPage";
import ProductPage from "../pages/ExpertView/ProductPage";
import ModLayout from "../layout/ModLayout";
import ModDashboard from "../pages/Dashboard/ModDasboard";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import RequireRole from "./RequireRole";
import PaymentSuccess from "../pages/ExpertView/PaymentSuccess";
import ExpertDashboard from "../pages/Dashboard/ExpertDashboard";
import UserDashboard from "../pages/Dashboard/UserDashboard";

const AppRoutes = () => {
  const user = useSelector((state) => state.userInfo?.user);

  useEffect(() => {
    if (!user?.id) return;
    const handleEmitRoom = () => {
      socket.emit("join_room", `user_${user.id}`);
      console.log(`✅ Join room: user_${user.id}`);
    };
    socket.on("connect", handleEmitRoom);
    return () => {
      socket.off("connect", handleEmitRoom);
      socket.emit("leave_room", `user_${user.id}`);
    };
  }, [user?.id]);

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="forum">
          <Route index element={<ForumPage />} />
          <Route path="posts/:postId" element={<PostPage />} />
        </Route>
        <Route path="news">
          <Route index element={<NewsPage />} />
          <Route path="create-article" element={<CreateArticlePage />} />
          <Route path="article/:articleId" element={<ArticlePage />} />
        </Route>
        <Route path="expert">
          <Route index element={<ExpertViewPage />} />
          <Route path="products/:productId" element={<ProductPage />} />
          <Route path="expert-dashboard" element={<ExpertDashboard />} />
        </Route>
        <Route path="/my-account" element={<UserDashboard />} />
      </Route>
      <Route path="payment-success" element={<PaymentSuccess />} />
      <Route element={<RequireRole roles={["mod"]} />}>
        <Route path="/mod-dashboard" element={<ModLayout />}>
          <Route index element={<ModDashboard />} />
        </Route>
      </Route>
      <Route element={<RequireRole roles={["admin"]} />}>
        <Route path="/admin-dashboard" element={<ModLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
