import classNames from "classnames/bind";
import { IoBookmarkSharp } from "react-icons/io5";
import { FaHotjar } from "react-icons/fa";

import styles from "./Flag.module.scss";

const cx = classNames.bind(styles);

function Flag({ isNew = false, isSelling = false }) {
  return (
    <>
      {isNew && (
        <div className={cx("flag-new")}>
          <IoBookmarkSharp className={cx("icon")} />
          <span>Mới</span>
        </div>
      )}
      {isSelling && (
        <div className={cx("flag-hot")}>
          <IoBookmarkSharp className={cx("icon")} />
          <span>
            <FaHotjar />
          </span>
        </div>
      )}
    </>
  );
}

export default Flag;
