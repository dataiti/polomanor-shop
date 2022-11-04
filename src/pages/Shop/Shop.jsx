import classNames from "classnames/bind";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

import Loading from "../../components/Loading";
import ProductCard from "../../components/ProductCard/ProductCard";
import { db } from "../../firebase/firebaseConfig";
import { useTitle } from "../../hooks";
import { useOutside } from "../../hooks";
import styles from "./Shop.module.scss";

const cx = classNames.bind(styles);

const NAVBAR_FILTER = [
  {
    type: "ALL",
    title: "Tất Cả",
  },
  {
    type: "NEW",
    title: "Mới Nhất",
  },
  {
    type: "SELLING",
    title: "Bán Chạy",
  },
  {
    type: "PRICE",
    title: "Giá",
    child: [
      {
        type: "ASCENDING",
        title: "Giá: Thấp đến Cao",
      },
      {
        type: "DESCENDING",
        title: "Giá: Cao đến Thấp",
      },
    ],
  },
];

function Shop() {
  const [listProduct, setListProduct] = useState([]);
  const [typeSort, setTypeSort] = useState("ALL");
  const [textOption, setTextOption] = useState("Giá");
  const [displayOption, setDisplayOption] = useState(false);
  const [loading, setLoading] = useState(false);
  const selectRef = useRef();
  useTitle("Polomanor - Sản Phẩm");
  useOutside(selectRef, setDisplayOption);

  useEffect(() => {
    setLoading(true);
    const fetchApi = async () => {
      try {
        onSnapshot(
          query(collection(db, "products"), where("status", "==", 1)),
          (snapshot) => {
            const result = [];
            snapshot.forEach((doc) => {
              result.push({
                id: doc.id,
                ...doc.data(),
              });
            });
            setListProduct(result);
            setLoading(false);
          }
        );
      } catch (err) {
        setLoading(true);
      }
    };
    fetchApi();
  }, []);

  const handleFilterProduct = (type, title) => {
    setTypeSort(type);
    const coppyArr = [...listProduct];
    if (type === "ALL") {
      coppyArr.sort(() => 0.5 - Math.random());
      setTextOption("Giá");
    } else if (type === "NEW") {
      coppyArr.sort(
        (a, b) =>
          new Date(b?.createAt?.seconds) - new Date(a?.createAt?.seconds)
      );
      setTextOption("Giá");
    } else if (type === "SELLING") {
      coppyArr.sort((a, b) => b.sold - a.sold);
      setTextOption("Giá");
    } else if (type === "ASCENDING") {
      coppyArr.sort((a, b) => a.price - b.price);
      setTextOption(title);
    } else if (type === "DESCENDING") {
      coppyArr.sort((a, b) => b.price - a.price);
      setTextOption(title);
    }
    setDisplayOption(false);
    setListProduct(coppyArr);
  };

  const handleHoverSelected = () => {
    setDisplayOption(!displayOption);
  };

  return (
    <div className={cx("wrapper")}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <a href="#product-list" className={cx("link-banner")}>
            <img className={cx("img")} src="/banner-product.jpg" alt="" />
          </a>
          <div id="product-list">
            <div className={cx("navbar-filter")}>
              <h4 className={cx("title")}>Sắp xếp theo</h4>
              {NAVBAR_FILTER.map((item, index) => {
                return (
                  <div key={index}>
                    {item.type !== "PRICE" ? (
                      <div
                        className={cx(
                          "navbar-item",
                          item.type === typeSort ? "active" : ""
                        )}
                        key={index}
                        onClick={() => handleFilterProduct(item.type)}
                      >
                        {item.title}
                      </div>
                    ) : (
                      <div
                        ref={selectRef}
                        className={cx("select")}
                        onClick={handleHoverSelected}
                      >
                        <span>
                          {textOption} <FiChevronDown />
                        </span>
                        {displayOption && (
                          <div className={cx("list-option")}>
                            {item.child.map((item, index) => (
                              <div
                                key={index}
                                className={cx("option")}
                                onClick={() =>
                                  handleFilterProduct(item.type, item.title)
                                }
                              >
                                {item.title}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className={cx("container")}>
              <div className={cx("grid-layout-5")}>
                {listProduct.map((item) => {
                  return <ProductCard data={item} key={item.id} />;
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Shop;
