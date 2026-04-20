import {Outlet, useLocation} from "react-router-dom";
import {useEffect} from "react";
import Background from "../Background";
import Navbar from "../Navbar";
import Footer from "../Footer";

export const Layout = () => {
    const {pathname} = useLocation();
    const isHome = pathname === "/";

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <>
            <Background/>
            <Navbar/>
            <main style={{position: "relative", zIndex: 2}}>
                <Outlet/>
            </main>
            {!isHome && <Footer/>}
        </>
    );
};
