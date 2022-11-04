import classNames from "classnames/bind";

import Button from "../../components/Button";
import { configRoutes } from "../../utils/configRoutes";
import styles from "./FindNotFound.module.scss";

const cx = classNames.bind(styles);

function FindNotFound() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("left")}>
          <h2>404</h2>
          <p>Không Tìm Thấy Trang</p>
        </div>
        <div className={cx("right")}>
          <h2>Oops!</h2>
          <span>Không tìm thấy trang trên máy chủ</span>
          <p>
            Liên kết bạn theo dõi đã lỗi thời, không chính xác hoặc máy chủ đã
            được hướng dẫn không cho phép bạn có liên kết đó.
          </p>
          <Button secondary outline medium to={configRoutes.home}>
            VỀ TRANG CHỦ
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FindNotFound;
