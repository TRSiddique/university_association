import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Committee from "./Committee/Committee.jsx";
import AddMember from "./components/AddMember";
import AdminLogin from "./components/AdminLogin";
import MemberDetails from "./components/MemberDetails";
import NotFound from "./components/NotFound";
import UpdatedMember from "./components/UpdatedMember";
import { AuthProvider } from "./context/AuthContext.jsx";

import AdminGallery from "./Gallery/AdminGallery.jsx";
import Gallery from "./Gallery/Gallery.jsx";
import Home from "./Home/Home";
import "./index.css";
import AddNews from "./News/AddNews";
import News from "./News/News";
import NewsDetail from "./News/NewsDetail";
import Publication from "./Publication/Publication";

// Import Form Components
import AdminFormsDashboard from './components/AdminFormsDashboard';
import FormBuilder from "./components/FormBuilder";
import Members from "./components/Members.jsx";
import PublicForm from "./components/PublicForm";
import PublicFormsList from "./components/PublicFormsList.jsx";
import ResponseViewer from "./components/ResponseViewer";
import EditNews from "./News/EditNews.jsx";

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
        // ========== REMOVED: Loader - Let component handle fetching ==========
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
        path: "/admin/forms",
        element: <AdminFormsDashboard></AdminFormsDashboard>,
      },
      {
        path: "/admin/forms/create",
        element: <FormBuilder></FormBuilder>,
      },
      {
        path: "/admin/forms/:id/responses",
        element: <ResponseViewer></ResponseViewer>,
      },
      {
        path: "/forms/:id",
        element: <PublicForm></PublicForm>,
      },
      {
        path: "/forms",
        element: <PublicFormsList></PublicFormsList>
      },
      {
        path:"/edit-news/:id" ,
        element:<EditNews></EditNews>
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