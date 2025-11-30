import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Committee from "./components/Committee/Committee.jsx";
import AddMember from "./components/Members/AddMember.jsx";
import AdminLogin from "./components/Login/AdminLogin.jsx";
import MemberDetails from "./components/Members/MemberDetails.jsx";
import NotFound from "./components/NotFound";
import UpdatedMember from "./components/Members/UpdatedMember.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

import AdminGallery from "./components/Gallery/AdminGallery.jsx";
import Gallery from "./components/Gallery/Gallery.jsx";
import Home from "./components/Home/Home.jsx";
import "./index.css";
import AddNews from "./components/News/AddNews.jsx";
import News from "./components/News/News.jsx";
import NewsDetail from "./components/News/NewsDetail.jsx";
import Publication from "./components/Publication/Publication.jsx";

// Import Form Components
import AdminFormsDashboard from './components/form/AdminFormsDashboard.jsx';
import FormBuilder from "./components/form/FormBuilder.jsx";
import Members from "./components/Members/Members.jsx";
import PublicForm from "./components/form/PublicForm.jsx";
import PublicFormsList from "./components/form/PublicFormsList.jsx";
import ResponseViewer from "./components/form/ResponseViewer.jsx";
import EditNews from "./components/News/EditNews.jsx";
import AdminSignup from "./components/Login/AdminSignup.jsx";


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
          const res = await fetch(`http://localhost:4000/member/${params.id}`);
          return res.json();
        },
      },
      {
        path: "updateMember/:id",
        element: <UpdatedMember></UpdatedMember>,
        loader: async ({ params }) => {
          const res = await fetch(`http://localhost:4000/member/${params.id}`);
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
        path: "admin-signup",
        element: <AdminSignup></AdminSignup>

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