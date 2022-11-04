import classNames from "classnames/bind";

import styles from "./Label.module.scss";

const cx = classNames.bind(styles);

function Label({ htmlFor = "", children = "", className = "" }) {
  return (
    <label className={cx("label", { className })} htmlFor={htmlFor}>
      {children}
    </label>
  );
}

export default Label;
