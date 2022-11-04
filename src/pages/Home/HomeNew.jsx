import classNames from "classnames/bind";
import { SwiperSlide, Swiper } from "swiper/react";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import Heading from "../../components/Heading";
import ProductCard from "../../components/ProductCard";
import { db } from "../../firebase/firebaseConfig";
import styles from "./Home.module.scss";

const cx = classNames.bind(styles);

function HomeNew({ setLoading }) {
  const [listNewProduct, setListNewProduct] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchApi = async () => {
      try {
        onSnapshot(
          query(
            collection(db, "products"),
            where("status", "==", 1),
            where("new", "==", true)
          ),
          (snapshot) => {
            const result = [];
            snapshot.forEach((doc) => {
              result.push({
                id: doc.id,
                ...doc.data(),
              });
            });
            setListNewProduct(
              result.sort(
                (a, b) =>
                  new Date(b?.createAt?.seconds) -
                  new Date(a?.createAt?.seconds)
              )
            );
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
      <Heading>SẢN PHẨM MỚI</Heading>
      <div className={cx("container")}>
        <Swiper
          className={cx("list-product", "grid-layout-5")}
          grabCursor={"true"}
          spaceBetween={20}
          slidesPerView={"auto"}
        >
          {listNewProduct?.map((item) => (
            <SwiperSlide key={item.id}>
              <ProductCard data={item} isNew />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default HomeNew;
