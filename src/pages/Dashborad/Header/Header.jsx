import classNames from "classnames/bind";
import { FiSearch } from "react-icons/fi";
import { IoAddCircle } from "react-icons/io5";

import Button from "../../../components/Button";
import { configRoutes } from "../../../utils/configRoutes";
import styles from "./Header.module.scss";

const cx = classNames.bind(styles);

function Header({
  placeholder = "",
  addUserText = "",
  searchValue,
  setSearchValue,
  to = "/",
}) {
  return (
    <div className={cx("header")}>
      <div className={cx("search")}>
        <input
          placeholder={placeholder}
          spellCheck={false}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div className={cx("search-icon")}>
          <FiSearch />
        </div>
      </div>
      <Button medium secondary outline leftIcon={<IoAddCircle />} to={to}>
        {addUserText}
      </Button>
    </div>
  );
}

export default Header;
