import classNames from "classnames/bind";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdEditNote } from "react-icons/md";

import Header from "../Header";
import numberCommas from "../../../utils/numberCommas";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import Table from "../../../components/Table";
import { db } from "../../../firebase/firebaseConfig";
import styles from "./ManageProduct.module.scss";
import { selectUser } from "../../../redux/features/userSlice";
import { useDebounce, useTitle } from "../../../hooks";
import Loading from "../../../components/Loading";
import { userRole } from "../../../utils/constant";
import { configRoutes } from "../../../utils/configRoutes";
import convertVietnameseToEnglish from "../../../utils/convertVItoEN";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

function ManageProduct() {
  const [listProducts, setListProducts] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector(selectUser);
  const debouncedValue = useDebounce(searchValue, 500);
  const navigate = useNavigate();
  useTitle("Polomanor - Quản Lý Sản Phẩm");

  useEffect(() => {
    setLoading(true);
    const fetchApi = () => {
      const productsColRef = collection(db, "products");
      onSnapshot(productsColRef, (snapshot) => {
        const result = [];
        snapshot.forEach((doc) => {
          result.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setListProducts(
          debouncedValue
            ? result.filter((item) => {
                return convertVietnameseToEnglish(
                  item.name.toLowerCase()
                ).includes(
                  convertVietnameseToEnglish(debouncedValue.toLowerCase())
                );
              })
            : result.sort(
                (a, b) =>
                  new Date(b?.createAt?.seconds) -
                  new Date(a?.createAt?.seconds)
              )
        );
        setLoading(false);
      });
    };
    fetchApi();
  }, [debouncedValue]);

  const handleDeleteProduct = async (productId) => {
    try {
      if (currentUser?.role !== userRole.ADMIN) {
        Swal.fire("Không thể xóa", "Bạn không phải Admin", "warning");
        return;
      }
      const productDocRef = doc(db, "products", productId);
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
          await deleteDoc(productDocRef);
          toast.success("Xóa sản phẩm thành công !");
          Swal.fire("Đã xóa! ", " Sản phẩm đã được xóa. ", " Thành công ");
        }
      });
    } catch (err) {
      toast.error("Xóa sản phẩm thất bại !");
    }
  };

  return (
    <div className={cx("wrapper", loading ? "loading" : "")}>
      <Heading>Quản lý sản phẩm</Heading>
      <Header
        placeholder="Tìm kiếm sản phẩm..."
        addUserText="Thêm sản phẩm"
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        to={configRoutes.addProduct}
      />
      {!loading ? (
        <Table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Thông tin sản phẩm</th>
              <th>Giá tiền</th>
              <th>Số lượng</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {listProducts?.map((product) => {
              return (
                <tr key={product.id}>
                  <td>{product.id.slice(0, 5) + "..."}</td>
                  <td>
                    <div className={cx("table-info")}>
                      <img className={cx("image")} src={product.image} alt="" />
                      <div className={cx("detail")}>
                        <div className={cx("name")}>{product.name}</div>
                        <div className={cx("sizes")}>
                          Màu sắc:
                          {product.colors.map((color, index) => {
                            return <p key={index}>{color}</p>;
                          })}
                        </div>
                        <div className={cx("sizes")}>
                          Kích cỡ:
                          {product.sizes.map((size, index) => {
                            return <p key={index}>{size}</p>;
                          })}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={cx("price")}>{`${numberCommas(
                      product.price
                    )}VND`}</div>
                  </td>
                  <td>{product.quantity}</td>
                  <td>
                    {new Date(
                      product?.createAt?.seconds * 1000
                    ).toLocaleDateString("vi-VI")}
                  </td>
                  <td>
                    <div className={cx("action")}>
                      <Button
                        medium
                        rouded
                        onClick={() => handleDeleteProduct(product.id)}
                        leftIcon={<RiDeleteBin6Line />}
                      />
                      <Button
                        medium
                        rouded
                        leftIcon={<MdEditNote />}
                        onClick={() =>
                          navigate(
                            `${configRoutes.updateProduct}?id=${product.id}`
                          )
                        }
                      />
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

export default ManageProduct;
