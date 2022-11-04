import classNames from "classnames/bind";

import styles from "./Heading.module.scss";

const cx = classNames.bind(styles);

function Heading({ children }) {
  return (
    <div className={cx("wrapper")}>
      <h3 className={cx("title")}>{children}</h3>
    </div>
  );
}

export default Heading;
