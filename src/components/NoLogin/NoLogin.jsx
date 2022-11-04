import classNames from "classnames/bind";
import { configRoutes } from "../../utils/configRoutes";
import Button from "../Button";
import Heading from "../Heading";

import styles from "./NoLogin.module.scss";

const cx = classNames.bind(styles);

function NoLogin() {
  return (
    <div className={cx("not-user")}>
      <Heading>Giỏ hàng</Heading>
      <div className={cx("container")}>
        <div className={cx("text")}>
          Bạn chưa đăng nhập! Vui lòng đăng nhập để mua sản phẩm
        </div>
        <div className={cx("action")}>
          <Button medium outline to={configRoutes.signUp}>
            Đăng ký
          </Button>
          <Button medium primary to={configRoutes.signIn}>
            Đăng nhập
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NoLogin;
