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
import Publication from './Publication/Publication';

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
        loader: () => fetch("https://university-association-backend-1.onrender.com/member")
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
    path: "/publications",
    element: <Publication></Publication>,
}
      ,
      {
        path: "*",
        element: <NotFound></NotFound>,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
