
import { Outlet } from "react-router-dom";
import AppNav from "./AppNav";
import Logo from "./Logo";
import style from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <div className={style.sidebar}>

        <Logo />
        <AppNav />

        <Outlet />

        <footer className={style.footer} >
            <p className={style.copyright}>
                &copy; Copyright {new Date().getFullYear()} by WorldWise Inc.
            </p>
        </footer>
    </div>
  )
}
