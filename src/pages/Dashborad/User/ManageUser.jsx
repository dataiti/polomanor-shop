import classNames from "classnames/bind";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import Avatar from "../../../components/Avatar/Avatar";
import { BsCheckCircleFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import Header from "../Header";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import Table from "../../../components/Table";
import { db } from "../../../firebase/firebaseConfig";
import styles from "./ManageUser.module.scss";
import { selectUser } from "../../../redux/features/userSlice";
import { useDebounce, useTitle } from "../../../hooks";
import Loading from "../../../components/Loading";
import { userRole } from "../../../utils/constant";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdEditNote } from "react-icons/md";

const cx = classNames.bind(styles);

function ManageUser() {
  const [userInfo, setUserInfo] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector(selectUser);
  const debouncedValue = useDebounce(searchValue, 500);
  useTitle("Polomanor - Quản Lý Người Dùng");

  useEffect(() => {
    setLoading(true);
    const fetchApi = () => {
      const bannerColRef = collection(db, "user");
      onSnapshot(bannerColRef, (snapshot) => {
        const result = [];
        snapshot.forEach((doc) => {
          result.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setUserInfo(
          result.filter((item) => {
            return (
              item.display_name
                .toLowerCase()
                .includes(debouncedValue.toLowerCase()) ||
              item.email.toLowerCase().includes(debouncedValue.toLowerCase())
            );
          })
        );
        setLoading(false);
      });
    };
    fetchApi();
  }, [debouncedValue]);

  const handleDeleteUser = async (userId) => {
    try {
      if (currentUser?.role !== userRole.ADMIN) {
        Swal.fire("Không thể xóa", "Bạn không phải Admin", "warning");
        return;
      }
      const userColRef = doc(db, "user", userId);
      Swal.fire({
        title: "Bạn có chắc không?",
        text: "Bạn sẽ không thể hoàn nguyên điều này!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Có, xóa nó!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteDoc(userColRef);
          // await deleteUser(currentUser);
          toast.success("Xóa người dùng thành công !");
          Swal.fire("Đã xóa! ", " Người dùng đã được xóa. ", " Thành công ");
        }
      });
    } catch (err) {
      toast.error("Xóa người dùng thất bại !");
    }
  };

  return (
    <div className={cx("wrapper", loading ? "loading" : "")}>
      <Heading>Quản lý người dùng</Heading>
      <Header
        placeholder="Tìm kiếm người dùng..."
        addUserText="Thêm User"
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      {!loading ? (
        <Table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Thông tin</th>
              <th>Vai trò</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {userInfo?.map((user) => {
              return (
                <tr key={user.id}>
                  <td>{user.id.slice(0, 5) + "..."}</td>
                  <td>
                    <div className={cx("table-info")}>
                      <Avatar>{user.avatar}</Avatar>
                      <div className={cx("detail")}>
                        <div className={cx("name")}>
                          {user.display_name}
                          <span className={cx("role")}>
                            ({user.role === 2 ? "Admin" : "User"})
                            {user.role === 2 && (
                              <BsCheckCircleFill className={cx("icon-check")} />
                            )}
                          </span>
                        </div>
                        <p className={cx("email")}>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>{user.role === 2 ? "Admin" : "User"}</td>
                  <td>
                    {new Date(
                      user?.createAt?.seconds * 1000
                    ).toLocaleDateString("vi-VI")}
                  </td>
                  <td>
                    <div className={cx("action")}>
                      <Button
                        medium
                        rouded
                        onClick={() => handleDeleteUser(user.id)}
                        leftIcon={<RiDeleteBin6Line />}
                      />
                      <Button medium rouded leftIcon={<MdEditNote />} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default ManageUser;
