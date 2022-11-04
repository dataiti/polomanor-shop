import classNames from "classnames/bind";
import { Link, NavLink } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { RiShirtFill } from "react-icons/ri";
import { GiShoppingCart } from "react-icons/gi";
import { FaUserFriends } from "react-icons/fa";
import { RiProductHuntLine } from "react-icons/ri";
import { BsCheckCircleFill } from "react-icons/bs";
import { AiOutlineLogout } from "react-icons/ai";
import { FaTruck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import { userRole } from "../../utils/constant";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";

import { configRoutes } from "../../utils/configRoutes";
import styles from "./Sidebar.module.scss";
import Button from "../../components/Button/Button";
import Avatar from "../../components/Avatar/Avatar";
import { removeAllItem, SelectCart } from "../../redux/features/cartSlice";

const cx = classNames.bind(styles);

const SIDE_NAV = [
  {
    title: "Apps",
    child: [
      {
        path: configRoutes.home,
        icon: <GoHome />,
        display: "Dạo",
      },
      {
        path: configRoutes.product,
        icon: <RiShirtFill />,
        display: "Sản Phẩm",
      },
      {
        path: configRoutes.cart,
        icon: <GiShoppingCart />,
        display: "Giỏ Hàng",
        notification: true,
      },
    ],
  },
  {
    admin: true,
    title: "Dashboard",
    child: [
      {
        path: configRoutes.manageProduct,
        icon: <RiProductHuntLine />,
        display: "Quản lý Sản phẩm",
      },
      {
        path: configRoutes.manageUser,
        icon: <FaUserFriends />,
        display: "Quản lý người dùng",
      },
      {
        path: configRoutes.manageOrder,
        icon: <FaTruck />,
        display: "Quản lý đơn hàng",
      },
    ],
  },
  {
    title: "Profile",
    child: [
      {
        path: configRoutes.profile,
        icon: <CgProfile />,
        display: "Cá nhân",
      },
    ],
  },
];

function Sidebar() {
  const [searchValue, setSearchValue] = useState("");
  const userInfo = useSelector(selectUser);
  const cartInfo = useSelector(SelectCart);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Đã đăng xuất !");
    dispatch(removeAllItem());
  };

  const getTotalQuantity = () => {
    let total = 0;
    cartInfo.forEach((item) => {
      total += item.quantity;
    });
    return total;
  };

  return (
    <div className={cx("wrapper")}>
      <Link className={cx("header")} to={configRoutes.home}>
        <img className={cx("logo")} src="/logo.jpg" alt="" />
        <div className={cx("name")}>POLOMANOR</div>
      </Link>
      <div className={cx("search")}>
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          spellCheck={false}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div className={cx("search-icon")}>
          <FiSearch />
        </div>
      </div>
      <div className={cx("container")}>
        {SIDE_NAV.map((nav, index) => {
          if (!userInfo || userInfo?.role === userRole.USER) {
            return (
              <div key={index}>
                {!nav.admin && (
                  <div className={cx("nav-group")}>
                    <h4 className={cx("title")}>{nav.title}</h4>
                    {nav.child.map((item, index) => {
                      return (
                        <ul className={cx("list")} key={index}>
                          <li className={cx("item")}>
                            <NavLink
                              className={(nav) =>
                                cx("link", { active: nav.isActive })
                              }
                              to={item.path}
                            >
                              <div className={cx("icon")}>{item.icon}</div>
                              <div className={cx("display")}>
                                {item.display}
                              </div>
                              {item.notification && (
                                <div className={cx("notification")}>
                                  {getTotalQuantity() || 0}+
                                </div>
                              )}
                            </NavLink>
                          </li>
                        </ul>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
          return (
            <div key={index} className={cx("nav-group")}>
              <h4 className={cx("title")}>{nav.title}</h4>
              {nav.child.map((item, index) => {
                return (
                  <ul className={cx("list")} key={index}>
                    <li className={cx("item")}>
                      <NavLink
                        className={(nav) =>
                          cx("link", { active: nav.isActive })
                        }
                        to={item.path}
                      >
                        <div className={cx("icon")}>{item.icon}</div>
                        <div className={cx("display")}>{item.display}</div>
                        {item.notification && (
                          <div className={cx("notification")}>
                            {getTotalQuantity() || 0}+
                          </div>
                        )}
                      </NavLink>
                    </li>
                  </ul>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className={cx("footer")}>
        {userInfo ? (
          <div className={cx("user")}>
            <div className={cx("user-info")}>
              <Avatar>{userInfo.avatar}</Avatar>
              <div className={cx("detail")}>
                <div className={cx("name")}>
                  {userInfo.display_name}
                  <span className={cx("role")}>
                    ({userInfo.role === 2 ? "Admin" : "User"})
                    {userInfo.role === 2 && (
                      <BsCheckCircleFill className={cx("icon-check")} />
                    )}
                  </span>
                </div>
                <p className={cx("email")}>{userInfo.email}</p>
              </div>
            </div>

            <Button
              danger
              leftIcon={<AiOutlineLogout />}
              onClick={handleLogout}
              to={configRoutes.home}
            >
              Đăng xuất
            </Button>
          </div>
        ) : (
          <div className={cx("action")}>
            <Button medium outline to={configRoutes.signUp}>
              Đăng ký
            </Button>
            <Button medium primary to={configRoutes.signIn}>
              Đăng nhập
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
