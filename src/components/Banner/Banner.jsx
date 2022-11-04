import classNames from "classnames/bind";
import { useRef } from "react";
import { SwiperSlide, Swiper } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay } from "swiper";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./Banner.module.scss";

const cx = classNames.bind(styles);

function Banner({ listBanner }) {
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  return (
    <div className={cx("banner")}>
      <Swiper
        cssMode={true}
        slidesPerView={"auto"}
        pagination={true}
        keyboard={true}
        modules={[Navigation, Autoplay, Pagination, Mousewheel, Keyboard]}
        autoplay={{ delay: 5000 }}
        navigation={{
          prevEl: navigationPrevRef.current,
          nextEl: navigationNextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = navigationPrevRef.current;
          swiper.params.navigation.nextEl = navigationNextRef.current;
        }}
      >
        {listBanner?.map((banner) => {
          return (
            <SwiperSlide key={banner.id}>
              <img className={cx("img")} src={banner.banner_url} alt="" />
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className={cx("prev")} ref={navigationPrevRef}>
        <IoIosArrowBack />
      </div>
      <div className={cx("next")} ref={navigationNextRef}>
        <IoIosArrowForward />
      </div>
    </div>
  );
}

export default Banner;
