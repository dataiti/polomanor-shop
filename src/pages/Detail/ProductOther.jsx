import classNames from "classnames/bind";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { SwiperSlide, Swiper } from "swiper/react";

import Loading from "../../components/Loading";
import ProductCard from "../../components/ProductCard/ProductCard";
import { db } from "../../firebase/firebaseConfig";
import styles from "./Detail.module.scss";

const cx = classNames.bind(styles);

function ProdductOther({ id }) {
  const [listProduct, setListProduct] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchApi = async () => {
      try {
        onSnapshot(
          query(
            collection(db, "products"),
            where("status", "==", 1),
            limit(20)
          ),
          (snapshot) => {
            const result = [];
            snapshot.forEach((doc) => {
              result.push({
                id: doc.id,
                ...doc.data(),
              });
            });
            setListProduct(
              result.sort(function () {
                return 0.5 - Math.random();
              }) && result.filter((item) => item.id !== id)
            );
            setLoading(false);
          }
        );
      } catch (err) {
        setLoading(false);
      }
    };
    fetchApi();
  }, [id]);

  return (
    <div className={cx("wrapper")}>
      {loading ? (
        <Loading />
      ) : (
        <Swiper
          className={cx("list-product", "grid-layout-5")}
          grabCursor={"true"}
          spaceBetween={20}
          slidesPerView={"auto"}
        >
          {listProduct?.map((item) => (
            <SwiperSlide key={item.id}>
              <ProductCard data={item} isNew />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}

export default ProdductOther;
