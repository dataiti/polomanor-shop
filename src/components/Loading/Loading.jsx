import classNames from "classnames/bind";
import { CgSpinnerTwo } from "react-icons/cg";

import styles from "./Loading.module.scss";

const cx = classNames.bind(styles);

function Loading({ className }) {
  return (
    <div className={cx("wrapper")}>
      <CgSpinnerTwo className={cx("icon", { classNames })} />
    </div>
  );
}

export default Loading;
