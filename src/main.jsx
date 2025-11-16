import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Committee from "./Committee/Committee.jsx";
import AddMember from "./components/AddMember";
import MemberDetails from "./components/MemberDetails";
import Members from "./components/Members";
import NotFound from "./components/NotFound";
import UpdatedMember from "./components/UpdatedMember";
import AdminGallery from "./Gallery/AdminGallery.jsx";
import Gallery from "./Gallery/Gallery.jsx";
import Home from "./Home/Home";
import "./index.css";
import AddNews from "./News/AddNews";
import News from "./News/News";
import NewsDetail from "./News/NewsDetail";
import Publication from "./Publication/Publication";

import AdminLogin from "./components/AdminLogin";
import { AuthProvider } from "./context/AuthContext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: "/addMember",
        element: <AddMember></AddMember>,
      },
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/members",
        element: <Members></Members>,
        loader: async () => {
          try {
            console.log("Fetching members...");

            // Add timeout to prevent hanging
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

            const response = await fetch("https://university-association-backend-1.onrender.com/member", {
              // FIXED: Removed double slash
              signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Members loaded:", data.length);

            // Ensure we always return an array
            return Array.isArray(data) ? data : [];
          } catch (error) {
            console.error("Failed to load members:", error);
            // Return empty array instead of crashing
            return [];
          }
        },
      },
      {
        path: "/members/:id",
        element: <MemberDetails></MemberDetails>,
        loader: async ({ params }) => {
          const res = await fetch(`https://university-association-backend-1.onrender.com/member/${params.id}`);
          return res.json();
        },
      },
      {
        path: "updateMember/:id",
        element: <UpdatedMember></UpdatedMember>,
        loader: async ({ params }) => {
          const res = await fetch(`https://university-association-backend-1.onrender.com/member/${params.id}`);
          return res.json();
        },
      },
      {
        path: "/news",
        element: <News></News>,
      },
      {
        path: "/news/:id",
        element: <NewsDetail></NewsDetail>,
      },
      {
        path: "/addnews",
        element: <AddNews></AddNews>,
      },
      {
        path: "/committee",
        element: <Committee></Committee>,
      },
      {
        path: "/gallery",
        element: <Gallery></Gallery>,
      },
      {
        path: "/addGallery",
        element: <AdminGallery></AdminGallery>,
      },

      {
        path: "/Resources",
        element: <Publication></Publication>,
      },
      {
        path: "/admin-login",
        element: <AdminLogin></AdminLogin>,
      },
      {
        path: "*",
        element: <NotFound></NotFound>,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
   </AuthProvider>
  </StrictMode>
);
