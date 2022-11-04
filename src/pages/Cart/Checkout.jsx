import classNames from "classnames/bind";
import Button from "../../components/Button";
import numberWithCommas from "../../utils/numberCommas";

import styles from "./Checkout.module.scss";

const cx = classNames.bind(styles);

function Checkout({ handleProductPayment, product, title = "Thanh Toán" }) {
  const getTotal = () => {
    let totalQuantity = 0;
    let totalPrice = 0;
    product.forEach((item) => {
      totalQuantity += item.quantity;
      totalPrice += item.price * item.quantity;
    });
    return { totalQuantity, totalPrice };
  };

  return (
    <div className={cx("checkout")}>
      <div className={cx("total")}>
        <div className={cx("block")}>
          <span>Tổng thanh toán</span>
          <p className={cx("total-quantity")}>
            ({getTotal().totalQuantity} sản phẩm):
          </p>
          <p className={cx("total-price")}>
            {numberWithCommas(getTotal().totalPrice)} VND
          </p>
        </div>

        <div className={cx("action")}>
          <Button primary medium onClick={handleProductPayment}>
            {title}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
