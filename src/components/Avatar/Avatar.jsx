import classNames from "classnames/bind";

import styles from "./Avatar.module.scss";

const cx = classNames.bind(styles);

function Avatar({ classes, children }) {
  const img = !!children ? children : "/default-avatar.png";

  return <img className={cx("avatar", classes)} src={img} alt="" />;
}

export default Avatar;
