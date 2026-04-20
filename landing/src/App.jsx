import {createBrowserRouter, RouterProvider, Navigate} from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Installation from "./pages/Installation";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        errorElement: <Navigate to="/"/>,
        children: [
            {path: "/", element: <Home/>},
            {path: "/funktionen", element: <Features/>},
            {path: "/installation", element: <Installation/>},
        ]
    }
]);

const App = () => {
    return <RouterProvider router={router}/>;
};

export default App;
