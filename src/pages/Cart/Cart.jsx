import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoRemoveOutline, IoAddSharp } from "react-icons/io5";
import { AiOutlineEye } from "react-icons/ai";

import styles from "./Cart.module.scss";
import Heading from "../../components/Heading";
import Table from "../../components/Table";
import numberWithCommas from "../../utils/numberCommas";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import NoLogin from "../../components/NoLogin";
import {
  decrementQuantity,
  incrementQuantity,
  removeItem,
  SelectCart,
} from "../../redux/features/cartSlice";
import { selectUser } from "../../redux/features/userSlice";
import { configRoutes } from "../../utils/configRoutes";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { addProductToPayMent } from "../../redux/features/paymentSlice";
import Checkout from "./Checkout";

const cx = classNames.bind(styles);

function Cart() {
  const [listProducts, setListProducts] = useState([]);
  const [checked, setChecked] = useState([]);
  const [dataPayment, setDataPayment] = useState([]);
  const [loading, setLoading] = useState(true);
  const cartInfo = useSelector(SelectCart);
  const userInfo = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setListProducts(cartInfo);
    setDataPayment(listProducts.filter((item) => checked.includes(item.id)));
    setLoading(false);
  }, [cartInfo, checked, listProducts]);

  const handleIncrementProductCart = (productId) => {
    dispatch(incrementQuantity(productId));
  };

  const handleDecrementProductCart = (productId) => {
    dispatch(decrementQuantity(productId));
  };

  const handleDeleteProductCart = (productId) => {
    Swal.fire({
      title: "Bạn có chắc không?",
      text: "Bạn sẽ không thể hoàn nguyên điều này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có, xóa nó!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeItem(productId));
        toast.success("Xóa sản phẩm thành công !");
        Swal.fire("Đã xóa! ", " Sản phẩm đã được xóa. ", " Thành công ");
      }
    });
  };

  const handleCheckboxChange = (e) => {
    let copyArrChecked = [...checked];
    if (e.target.checked) {
      copyArrChecked = [...checked, e.target.value];
    } else {
      copyArrChecked.splice(checked.indexOf(e.target.value), 1);
    }
    setChecked(copyArrChecked);
  };

  const handleProductPayment = () => {
    if (!checked.length) {
      toast.warning("Vui lòng chọn sản phẩm !");
      return;
    }
    dispatch(addProductToPayMent(dataPayment));
    navigate(configRoutes.payment);
  };

  if (!userInfo) {
    return <NoLogin />;
  }

  if (listProducts.length <= 0) {
    return (
      <>
        <Heading>Giỏ hàng</Heading>
        <div className={cx("empty-cart")}>
          Giỏ hàng trống !
          <Button primary medium to={configRoutes.product}>
            Mua ngay
          </Button>
        </div>
      </>
    );
  }

  return (
    <div className={cx("wrapper", loading ? "loading" : "")}>
      <Heading>Giỏ hàng</Heading>
      {!loading ? (
        <Table>
          <thead>
            <tr>
              <th>Chọn</th>
              <th>Thông tin sản phẩm</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {listProducts?.map((product) => {
              return (
                <tr key={product.id}>
                  <td>
                    <div>
                      <input
                        type="checkbox"
                        value={product.id}
                        onChange={handleCheckboxChange}
                      />
                    </div>
                  </td>
                  <td>
                    <div className={cx("table-info")}>
                      <img className={cx("image")} src={product.image} alt="" />
                      <div className={cx("detail")}>
                        <div className={cx("name")}>{product.title}</div>
                        <div className={cx("sizes")}>
                          Màu sắc: {product.color}
                        </div>
                        <div className={cx("sizes")}>
                          Kích cỡ: {product.size}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={cx("price")}>{`${numberWithCommas(
                      product.price
                    )}VND`}</div>
                  </td>
                  <td>
                    <div className={cx("quantity")}>
                      <div className={cx("action")}>
                        <button
                          className={cx("decre-btn")}
                          onClick={() => handleDecrementProductCart(product.id)}
                        >
                          <IoRemoveOutline />
                        </button>
                        <div className={cx("text")}>{product.quantity}</div>
                        <button
                          className={cx("incre-btn")}
                          onClick={() => handleIncrementProductCart(product.id)}
                        >
                          <IoAddSharp />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={cx("price")}>{`${numberWithCommas(
                      product.price * product.quantity
                    )}VND`}</div>
                  </td>
                  <td>
                    <div className={cx("action")}>
                      <Button
                        medium
                        rouded
                        onClick={() => handleDeleteProductCart(product.id)}
                        leftIcon={<RiDeleteBin6Line />}
                      />
                      <Button
                        medium
                        rouded
                        leftIcon={<AiOutlineEye />}
                        to={`${configRoutes.product}/${product.id}`}
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
      <Checkout
        handleProductPayment={handleProductPayment}
        product={dataPayment}
      />
    </div>
  );
}

export default Cart;
