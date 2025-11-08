import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AddMember from "./components/AddMember";
import Members from "./components/Members";
import MemberDetails from "./components/MemberDetails";
import UpdatedMember from "./components/UpdatedMember";
import NotFound from "./components/NotFound";
import Home from './Home/Home';

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
        loader: () => fetch("https://university-association-backend-1.onrender.com/member"),
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
