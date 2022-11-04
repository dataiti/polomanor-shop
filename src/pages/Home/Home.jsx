import classNames from "classnames/bind";
import { useState } from "react";
import { Link } from "react-router-dom";

import styles from "./Home.module.scss";
import Loading from "../../components/Loading";
import { configRoutes } from "../../utils/configRoutes";
import HomeNew from "./HomeNew";
import HomeSelling from "./HomeSelling";
import HomeSlider from "./HomeSlider";
import { useTitle } from "../../hooks";

const cx = classNames.bind(styles);

function Home() {
  const [loading, setLoading] = useState(false);
  useTitle("Polomanor - Trang Chủ");

  return (
    <div className={cx("wrapper")}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <HomeSlider setLoading={setLoading} />
          <HomeNew setLoading={setLoading} />
          <Link to={configRoutes.product} className={cx("link-banner")}>
            <img className={cx("img")} src="/banner-product-2.jpg" alt="" />
          </Link>
          <HomeSelling setLoading={setLoading} />
        </>
      )}
    </div>
  );
}

export default Home;
