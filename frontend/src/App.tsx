import { Route, Routes } from "react-router-dom";
import "./App.css";
import AuthCallBackPage from "./pages/auth-callback/AuthCallBackPage.tsx";
import HomePage from "./pages/Home/HomePage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout.tsx";
import ChatPage from "./pages/chat/ChatPage.tsx";
import AlbumPage from "./pages/album/AlbumPage.tsx";
import ShowAll from "./pages/Home/components/ShowAll.tsx";
import AdminPage from "./pages/admin/AdminPage.tsx";
import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404/NotFoundPage.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/sso-callback"
          element={
            <AuthenticateWithRedirectCallback
              signUpForceRedirectUrl={"/auth-callback"}
            />
          }
        />
        <Route path="/auth-callback" element={<AuthCallBackPage />} />
        <Route path="/admin" element={<AdminPage />}/>

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/showall" element={<ShowAll />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/albums/:albumId" element={<AlbumPage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster/>
    </>
  );
}

export default App;
