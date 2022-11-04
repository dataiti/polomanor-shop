import classnames from "classnames/bind";
import { Outlet } from "react-router-dom";

import Header from "../Header";
import Sidebar from "../Sidebar";
import styles from "./MainLayout.module.scss";

const cx = classnames.bind(styles);

function MainLayout() {
  return (
    <div className={cx("wrapper")}>
      <Sidebar />
      <div className={cx("container")}>
        <Header />
        <div className={cx("content")}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
