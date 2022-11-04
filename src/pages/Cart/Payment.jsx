import classNames from "classnames/bind";
import { collection, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Heading from "../../components/Heading";
import Table from "../../components/Table";
import { db } from "../../firebase/firebaseConfig";
import { removeItem } from "../../redux/features/cartSlice";
import {
  removeAllProductPayment,
  SelectProductPayment,
} from "../../redux/features/paymentSlice";
import numberWithCommas from "../../utils/numberCommas";
import Checkout from "./Checkout";

import styles from "./Payment.module.scss";

const cx = classNames.bind(styles);

function Payment() {
  const [listProductPayment, setListProductPayment] = useState([]);
  const paymentInfo = useSelector(SelectProductPayment);
  const dispatch = useDispatch();

  useEffect(() => {
    setListProductPayment(paymentInfo);
  }, [paymentInfo, setListProductPayment]);

  const handleProductPayment = async () => {
    try {
      // const orderColRef = collection(db, "orders");
      listProductPayment.forEach((item) => {
        updateDoc(doc(db, "products", item.id), {
          sold: item.sold + item.quantity,
          quantity: item.quantityProduct - item.quantity,
        });
        dispatch(removeItem(item.id));
      });
      dispatch(removeAllProductPayment());
      toast.success("Đã mua hàng, sản phẩm đã được giao cho bên vận chuyển!");
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className={cx("wrapper")}>
      <Heading>Thanh toán</Heading>
      <div className={cx("address")}>
        Địa chỉ Nhận hàng: Nguyễn Thành Đạt (+84) 788691936 k294/46/1 Nguyễn
        Lương Bằng, Phường Hòa Khánh Bắc, Quận Liên Chiểu, Đà Nẵng{" "}
      </div>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Thông tin sản phẩm</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {listProductPayment?.map((product) => {
            return (
              <tr key={product.id}>
                <td>{product.id.slice(0, 4) + "..."}</td>
                <td>
                  <div className={cx("table-info")}>
                    <img className={cx("image")} src={product.image} alt="" />
                    <div className={cx("detail")}>
                      <div className={cx("name")}>{product.title}</div>
                      <div className={cx("sizes")}>
                        Màu sắc: {product.color}
                      </div>
                      <div className={cx("sizes")}>Kích cỡ: {product.size}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={cx("price")}>{`${numberWithCommas(
                    product.price
                  )}VND`}</div>
                </td>
                <td>
                  <div className={cx("quantity")}>{product.quantity}</div>
                </td>
                <td>
                  <div className={cx("price")}>{`${numberWithCommas(
                    product.price * product.quantity
                  )}VND`}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Checkout
        handleProductPayment={handleProductPayment}
        product={listProductPayment}
        title="Mua Hàng"
      />
    </div>
  );
}

export default Payment;
