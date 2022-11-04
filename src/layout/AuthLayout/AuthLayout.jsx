import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { configRoutes } from "../../utils/configRoutes";
import styles from "./AuthLayout.module.scss";

const cx = classNames.bind(styles);

function AuthLayout({ children, title = "" }) {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("inner")}>
        <div className={cx("banner")}>
          <img className={cx("img")} src="banner.jpg" alt="" />
          <div className={cx("go-home")}>
            <span>hoặc</span>
            <Link to={configRoutes.home} className={cx("text")}>
              Về trang chủ
            </Link>
          </div>
        </div>
        <div className={cx("content")}>
          <img className={cx("logo")} src="/logo.jpg" alt="" />
          <h3 className={cx("title")}>{title}</h3>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
