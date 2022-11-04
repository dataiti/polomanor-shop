import classNames from "classnames/bind";
import { SwiperSlide, Swiper } from "swiper/react";
import { useEffect, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import Heading from "../../components/Heading";
import ProductCard from "../../components/ProductCard";
import styles from "./Home.module.scss";
import { db } from "../../firebase/firebaseConfig";

const cx = classNames.bind(styles);

function HomeSelling({ setLoading }) {
  const [listSellingProduct, setListSellingProduct] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchApi = async () => {
      try {
        onSnapshot(
          query(
            collection(db, "products"),
            where("status", "==", 1),
            limit(10)
          ),
          (snapshot) => {
            const result = [];
            snapshot.forEach((doc) => {
              result.push({
                id: doc.id,
                ...doc.data(),
              });
            });
            setListSellingProduct(result.sort((a, b) => b.sold - a.sold));
            setLoading(false);
          }
        );
      } catch (err) {
        setLoading(false);
      }
    };
    fetchApi();
  }, [setLoading]);

  return (
    <div className={cx("section")}>
      <Heading>TOP BÁN</Heading>
      <div className={cx("container")}>
        <Swiper
          className={cx("list-product", "grid-layout-5")}
          grabCursor={"true"}
          spaceBetween={20}
          slidesPerView={"auto"}
        >
          {listSellingProduct?.map((item, index) => (
            <SwiperSlide key={item.id}>
              {item.sold > 0 && (
                <ProductCard data={item} isSelling index={index} />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default HomeSelling;
