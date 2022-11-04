import classNames from "classnames/bind";
import { Link } from "react-router-dom";

import { configRoutes } from "../../utils/configRoutes";
import numberCommas from "../../utils/numberCommas";
import styles from "./ProductCard.module.scss";
import Flag from "../Flag";

const cx = classNames.bind(styles);

function ProductCard({ data }) {
  return (
    <Link to={`${configRoutes.product}/${data.id}`}>
      <div className={cx("product-item")}>
        {data.new && <Flag isNew />}
        {data.sold >= 10 && <Flag isSelling />}
        <div className={cx("image")}>
          <img src={data.image} alt="" />
        </div>
        <div className={cx("detail")}>
          <h3 className={cx("name")}>{data.name}</h3>
          <div className={cx("sold")}>
            <p>Đã bán: {data.sold}</p>
            <span>Còn {data.quantity} sản phẩm</span>
          </div>
          <div className={cx("price")}>
            {data.old_price && <span>{numberCommas(data?.old_price)} VND</span>}
            <p>{numberCommas(data.price)} VND</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
