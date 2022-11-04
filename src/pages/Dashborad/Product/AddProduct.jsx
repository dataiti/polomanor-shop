import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import classNames from "classnames/bind";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { RiDeleteBin6Line, RiAddCircleFill } from "react-icons/ri";
import { IoIosCloseCircle } from "react-icons/io";
import { GiBackwardTime } from "react-icons/gi";
import { toast } from "react-toastify";
import { FaCloudUploadAlt } from "react-icons/fa";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/features/userSlice";
import Swal from "sweetalert2";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import ReactQuill, { Quill } from "react-quill";
import axios from "axios";
import "react-quill/dist/quill.snow.css";

import ImageUploader from "quill-image-uploader";
import { imgbbAPI } from "../../../utils/apiConfig";
import Heading from "../../../components/Heading";
import Button from "../../../components/Button";
import styles from "./AddProduct.module.scss";
import { Field } from "../../../components/Field";
import Label from "../../../components/Label";
import { userRole } from "../../../utils/constant";
import { db } from "../../../firebase/firebaseConfig";
import { configRoutes } from "../../../utils/configRoutes";
import Loading from "../../../components/Loading";
import { useTitle } from "../../../hooks";
Quill.register("modules/imageUploader", ImageUploader);

const cx = classNames.bind(styles);

const schema = yup.object({
  name: yup.string().required("Bắt buộc !"),
  price: yup.number().typeError("Giá tiền phải là số !").required("Bắt buộc !"),
  quantity: yup
    .number()
    .typeError("Số lượng sản phẩm phải là số !")
    .required("Bắt buộc !"),
  sizes: yup.array().typeError("Băt buộc"),
});

function AddProduct() {
  const [listImage, setListImage] = useState([]);
  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);
  const [colorValue, setColorValue] = useState("");
  const [listColor, setListColor] = useState(["ĐEN", "TRẮNG"]);
  const [sizeValue, setSizeValue] = useState("");
  const [listSize, setListSize] = useState(["M", "L"]);
  const [mesErrorSize, setMesErrorSize] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector(selectUser);
  useTitle("Polomanor - Thêm Sản Phẩm");

  const inputColorRef = useRef("");

  useEffect(() => {
    const handleRemoveEnter = (e) => {
      if (e.which === 13) e.preventDefault();
    };
    window.addEventListener("keydown", handleRemoveEnter);
    return () => window.removeEventListener("keydown", handleRemoveEnter);
  }, [colorValue]);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      price: "",
      quantity: "",
    },
    resolver: yupResolver(schema),
  });

  const handleAddListColor = () => {
    if (colorValue && !listColor.includes(colorValue)) {
      setListColor((prev) => [...prev, colorValue]);
      setColorValue("");
      inputColorRef.current.focus();
    }
    setColorValue("");
  };

  const handleAddListSize = () => {
    if (
      sizeValue &&
      !listSize.includes(sizeValue) &&
      ["S", "M", "L", "XL", "XXL"].includes(sizeValue)
    ) {
      setListSize((prev) => [...prev, sizeValue]);
      setSizeValue("");
      setMesErrorSize("");
      inputColorRef.current.focus();
    }
    setSizeValue("");
    setMesErrorSize("");
  };

  const handleInputSize = (e) => {
    const value = e.target.value.toUpperCase();
    setSizeValue(value);
    if (["S", "M", "L", "XL", "XXL"].includes(value) || !value) {
      setMesErrorSize("");
    } else {
      setMesErrorSize("Kích cỡ không hợp lệ!");
    }
  };

  const handleDeleteColor = (color) => {
    setListColor((prev) => prev.filter((item) => !color.includes(item)));
  };

  const handleDeleteSize = (size) => {
    setListSize((prev) => prev.filter((item) => size !== item));
  };

  const handleSelectedImage = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    if (listImage.length === 4) {
      toast.warning("Chỉ được thêm tối đa 4 hình ảnh !");
      return;
    }

    setValue("image_name", file.name);
    handleUploadFile(file);
  };

  const handleUploadFile = (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgresspercent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL);
        });
      }
    );
  };

  const handleDeleteImage = async (img) => {
    try {
      const storage = getStorage();
      const imageRef = ref(storage, "files/" + getValues("image_name"));
      await deleteObject(imageRef);
      setImgUrl("");
      setProgresspercent(0);
      setListImage((prev) => prev.filter((item) => !img.includes(item)));
    } catch (err) {
      setImgUrl("");
    }
  };

  const handleAddListImage = () => {
    setImgUrl("");
    setProgresspercent(0);
    setListImage((prev) => [...prev, imgUrl]);
  };

  const handleSelectImageFromList = (img) => {
    setImgUrl(img);
  };

  const onSubmitAddNewProduct = async (values) => {
    if (currentUser?.role !== userRole.ADMIN) {
      Swal.fire("Không thể thêm sản phẩm", "Bạn không phải Admin", "warning");
      return;
    }
    try {
      if (!isValid) return;

      const cloneValuesPost = {
        ...values,
        new: true,
        status: 1,
        price: Number(values.price),
        quantity: Number(values.quantity),
        sold: 0,
        old_price: null,
        image: listImage.slice(0, 1).toString(),
        images: [...listImage],
        colors: [...listColor],
        sizes: [...listSize],
        descriptions: content,
      };

      const productColRef = collection(db, "products");
      setLoading(true);
      await addDoc(productColRef, {
        ...cloneValuesPost,
        createAt: serverTimestamp(),
      });
      reset();
      setLoading(false);
      setListImage([]);
      setListColor(["Đen", "Trắng"]);
      setListSize(["M", "L"]);
      setContent("");
      toast.success("Đã thêm sản phẩm thành công !");
    } catch (err) {
      toast.error("Thêm sản phẩm thất bại !");
      setLoading(false);
    }
  };

  const modules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote"],
        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["link", "image"],
      ],
      imageUploader: {
        upload: async (file) => {
          const bodyFormData = new FormData();
          bodyFormData.append("image", file);
          const response = await axios({
            method: "post",
            url: imgbbAPI,
            data: bodyFormData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          return response.data.data.url;
        },
      },
    }),
    []
  );

  return (
    <div className={cx("wrapper")}>
      {loading && <Loading />}
      <Heading>Thêm sản phẩm</Heading>
      <div className={cx("previos-btn")}>
        <Button
          medium
          secondary
          outline
          leftIcon={<GiBackwardTime />}
          to={configRoutes.manageProduct}
        >
          Quay lại
        </Button>
      </div>
      <form
        className={cx("form")}
        onSubmit={handleSubmit(onSubmitAddNewProduct)}
      >
        <div className={cx("container", "grid-layout-2")}>
          <div className={cx("image")}>
            <div className={cx("upload-image")}>
              {!imgUrl ? (
                <>
                  <label htmlFor="image"></label>
                  <input
                    type="file"
                    id="image"
                    hidden
                    onChange={handleSelectedImage}
                  />

                  <div className={cx("choose-image")}>
                    <FaCloudUploadAlt className={cx("icon-upload")} />
                    <p>Chọn hình ảnh</p>
                  </div>
                </>
              ) : (
                <div className={cx("has-image")}>
                  <img src={imgUrl} alt="" />
                  <div className={cx("overlay")}></div>
                  <div className={cx("action")}>
                    <button
                      type="button"
                      className={cx("delete-btn")}
                      onClick={() => handleDeleteImage(imgUrl)}
                    >
                      <RiDeleteBin6Line className={cx("icon")} />
                    </button>
                    <button
                      type="button"
                      className={cx("add-btn")}
                      onClick={handleAddListImage}
                    >
                      <RiAddCircleFill />
                    </button>
                  </div>
                </div>
              )}
            </div>
            {!imgUrl && (
              <div
                className={cx("progress")}
                style={{ width: `${Math.ceil(progresspercent)}%` }}
              ></div>
            )}
            <div className={cx("list-image")}>
              {listImage.slice(0, 4).map((imgUrl, index) => {
                return (
                  <img
                    key={index}
                    className={cx("image-item")}
                    src={imgUrl}
                    alt=""
                    onClick={() => handleSelectImageFromList(imgUrl)}
                  />
                );
              })}
            </div>
          </div>
          <div className={cx("detail")}>
            <Field
              className={cx("input-title")}
              control={control}
              name="name"
              label="Tên sản phẩm"
              placehoder="Nhập tên sản phẩm"
              errors={errors.name}
            />
            <Field
              className={cx("input-title")}
              control={control}
              name="price"
              label="Giá"
              placehoder="Nhập giá"
              errors={errors.price}
            />
            <Field
              className={cx("input-title")}
              control={control}
              name="quantity"
              label="Số lượng"
              placehoder="Nhập số lượng"
              errors={errors.quantity}
            />
            <div>
              <Label>Chọn màu sắc</Label>
              <div className={cx("field-option")}>
                <ul className={cx("list")}>
                  {listColor.map((color, index) => {
                    return (
                      <li key={index}>
                        <span className={cx("text")}>{color}</span>
                        <IoIosCloseCircle
                          className={cx("icon")}
                          onClick={() => handleDeleteColor(color)}
                        />
                      </li>
                    );
                  })}
                  <div className={cx("input")}>
                    <input
                      ref={inputColorRef}
                      type="text"
                      placeholder="Nhập màu sắc"
                      value={colorValue}
                      onChange={(e) =>
                        setColorValue(e.target.value.toUpperCase())
                      }
                    />
                    <button
                      type="button"
                      className={cx("btn")}
                      onClick={handleAddListColor}
                    >
                      <RiAddCircleFill className={cx("icon")} />
                    </button>
                  </div>
                </ul>
              </div>
            </div>
            <div>
              <Label>Chọn kích cỡ</Label>
              <div className={cx("field-option")}>
                <ul className={cx("list")}>
                  {listSize.map((size, index) => {
                    return (
                      <li key={index}>
                        <span className={cx("text")}>{size}</span>
                        <IoIosCloseCircle
                          className={cx("icon")}
                          onClick={() => handleDeleteSize(size)}
                        />
                      </li>
                    );
                  })}
                  <div className={cx("input")}>
                    <input
                      ref={inputColorRef}
                      type="text"
                      placeholder="Kích cỡ: S, M, L, XL, XXL"
                      value={sizeValue.toUpperCase()}
                      onChange={handleInputSize}
                    />
                    <button
                      type="button"
                      className={cx("btn")}
                      onClick={handleAddListSize}
                    >
                      <RiAddCircleFill className={cx("icon")} />
                    </button>
                  </div>
                </ul>
                {mesErrorSize && (
                  <p className={cx("mes-error")}>{mesErrorSize}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={cx("descriptions")}>
          <Label>Mô tả sản phẩm</Label>
          <div className="w-full entry-content">
            <ReactQuill
              modules={modules}
              theme="snow"
              value={content}
              onChange={setContent}
            />
          </div>
        </div>
        <div className={cx("submit-btn")}>
          <Button primary medium type="submit">
            Thêm sản phẩm
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
