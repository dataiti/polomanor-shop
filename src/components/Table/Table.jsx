import classNames from "classnames/bind";

import styles from "./Table.module.scss";

const cx = classNames.bind(styles);

function Table({ children }) {
  return (
    <div className={cx("wrapper")}>
      <table>{children}</table>
    </div>
  );
}

export default Table;
