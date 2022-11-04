import classNames from "classnames/bind";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import parse from "html-react-parser";
import { IoRemoveOutline, IoAddSharp } from "react-icons/io5";
import { GiShoppingCart } from "react-icons/gi";
import { IoBookmarkSharp } from "react-icons/io5";
import { toast } from "react-toastify";

import { db } from "../../firebase/firebaseConfig";
import numberWithCommas from "../../utils/numberCommas";
import styles from "./Detail.module.scss";
import ProdductOther from "./ProductOther";
import Heading from "../../components/Heading";
import Loading from "../../components/Loading";
import Button from "../../components/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/features/cartSlice";
import { selectUser } from "../../redux/features/userSlice";
import { configRoutes } from "../../utils/configRoutes";
import useTitle from "../../hooks/useTitle";

const cx = classNames.bind(styles);

function Detail() {
  let { id } = useParams();
  const [dataDetail, setDataDetail] = useState({});
  const [imagePerview, setImagePerView] = useState("");
  const [listImage, setListImage] = useState([]);
  const [quantityCart, setQuantityCart] = useState(1);
  const [colorCart, setColorCart] = useState("");
  const [sizeCart, setSizeCart] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const userInfo = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useTitle("Polomanor - Chi Tiết Sản Phẩm");

  useEffect(() => {
    setIsLoading(true);
    const fetchApi = async () => {
      try {
        const docRef = doc(db, "products", id);
        onSnapshot(docRef, (snapshot) => {
          setDataDetail({ id: snapshot.id, ...snapshot.data() });
          setIsLoading(false);
        });
      } catch (err) {
        setIsLoading(false);
      }
    };
    fetchApi();
  }, [id]);

  useEffect(() => {
    setImagePerView(dataDetail.image);
    setListImage(dataDetail.images);
  }, [dataDetail]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleChangeImage = (image) => {
    setImagePerView(image);
  };

  const handleDecrementProduct = () => {
    if (quantityCart === 0) return;
    setQuantityCart((prev) => prev - 1);
  };

  const handleSelectColor = (color) => {
    if (color === colorCart) {
      setColorCart("");
    } else setColorCart(color);
  };

  const handleSelectSize = (size) => {
    if (size === sizeCart) {
      setSizeCart("");
    } else setSizeCart(size);
  };

  const handleIncrementProduct = () => {
    if (quantityCart === dataDetail.quantity) return;
    setQuantityCart((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    if (!userInfo) {
      toast.warning("Vui lòng đăng nhập để mua sản phẩm");
      return;
    }
    if (!colorCart || !sizeCart) {
      toast.warning("Vui lòng chọn màu sắc, kích cỡ");
      return;
    }
    const dataProduct = {
      id: dataDetail.id,
      title: dataDetail.name,
      image: dataDetail.image,
      price: dataDetail.price,
      color: colorCart,
      size: sizeCart,
      quantity: quantityCart,
      quantityProduct: dataDetail.quantity,
      sold: dataDetail.sold,
    };
    dispatch(addToCart(dataProduct));
    toast.success("Đã thêm sản phẩm vào giỏ hàng");
    setColorCart("");
    setSizeCart("");
    setQuantityCart(1);
  };

  const handleBuyProduct = async () => {
    if (!userInfo) {
      toast.warning("Vui lòng đăng nhập để mua sản phẩm");
      return;
    }
    if (!colorCart || !sizeCart) {
      toast.warning("Vui lòng chọn màu sắc, kích cỡ");
      return;
    }
    const dataProduct = {
      id: dataDetail.id,
      title: dataDetail.name,
      image: dataDetail.image,
      price: dataDetail.price,
      color: colorCart,
      size: sizeCart,
      quantity: quantityCart,
      quantityProduct: dataDetail.quantity,
      sold: dataDetail.sold,
    };
    dispatch(addToCart(dataProduct));
    toast.success("Đã thêm sản phẩm vào giỏ hàng");
    setColorCart("");
    setSizeCart("");
    setQuantityCart(1);
    navigate(configRoutes.cart);
  };

  return (
    <div className={cx("wrapper")}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className={cx("detail")}>
            <div className={cx("images")}>
              <div className={cx("image-preview")}>
                <img src={imagePerview} alt="" />
              </div>
              <div className={cx("list-image", "grid-layout-4")}>
                {listImage?.map((image, index) => {
                  return (
                    <div
                      key={index}
                      onMouseOver={() => handleChangeImage(image)}
                    >
                      <img
                        className={cx(
                          "image-item",
                          image === imagePerview ? "active" : ""
                        )}
                        src={image}
                        alt=""
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={cx("info")}>
              <div className={cx("name")}>
                {dataDetail.new && (
                  <div className={cx("flag-new")}>
                    <IoBookmarkSharp className={cx("icon")} />
                    <span>Mới</span>
                  </div>
                )}
                {dataDetail.name}
              </div>
              <div className={cx("price")}>
                {dataDetail.old_price && (
                  <span>{numberWithCommas(dataDetail?.old_price)} VND</span>
                )}
                {dataDetail.price >= 0 && (
                  <p>{numberWithCommas(dataDetail.price)} VND</p>
                )}
              </div>
              <div className={cx("sold")}>
                <p className={cx("title")}>Đã bán:</p>
                <div>{dataDetail.sold}</div>
              </div>
              <div className={cx("options")}>
                <p className={cx("title")}>Màu sắc:</p>
                {dataDetail?.colors?.map((color, index) => {
                  return (
                    <div
                      className={cx(
                        "item",
                        color === colorCart ? "active" : ""
                      )}
                      key={index}
                      onClick={() => handleSelectColor(color)}
                    >
                      {color.toUpperCase()}
                    </div>
                  );
                })}
              </div>
              <div className={cx("options")}>
                <p className={cx("title")}>Kích cỡ:</p>
                {dataDetail?.sizes?.map((size, index) => {
                  return (
                    <div
                      className={cx("item", size === sizeCart ? "active" : "")}
                      key={index}
                      onClick={() => handleSelectSize(size)}
                    >
                      {size.toUpperCase()}
                    </div>
                  );
                })}
              </div>
              <div className={cx("quantity")}>
                <p className={cx("title")}>Số lượng:</p>
                <div className={cx("action")}>
                  <button
                    className={cx("decre-btn")}
                    onClick={handleDecrementProduct}
                  >
                    <IoRemoveOutline />
                  </button>
                  <div className={cx("text")}>{quantityCart}</div>
                  <button
                    className={cx("incre-btn")}
                    onClick={handleIncrementProduct}
                  >
                    <IoAddSharp />
                  </button>
                </div>
                <p className={cx("current-quantity")}>
                  {dataDetail.quantity} sản phẩm sẵn có
                </p>
              </div>
              <div className={cx("actions-buy")}>
                <Button
                  large
                  outline
                  leftIcon={<GiShoppingCart />}
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ hàng
                </Button>
                <Button medium primary onClick={handleBuyProduct}>
                  Mua ngay
                </Button>
              </div>
            </div>
          </div>
          <div className={cx("description")}>
            <div className={cx("title")}>Mô tả sản phẩm</div>
            <div className={cx("content")}>
              {(dataDetail.descriptions && parse(dataDetail.descriptions)) ||
                ""}
            </div>
          </div>
          <Heading>SẢN PHẨM KHÁC</Heading>
          <ProdductOther id={id} />
        </>
      )}
    </div>
  );
}

export default Detail;
