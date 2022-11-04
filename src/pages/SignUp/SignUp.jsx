import classNames from "classnames/bind";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

import { auth, db } from "../../firebase/firebaseConfig";
import { Field, PasswordField } from "../../components/Field";
import AuthLayout from "../../layout/AuthLayout";
import styles from "./SignUp.module.scss";
import { configRoutes } from "../../utils/configRoutes";
import Button from "../../components/Button/Button";
import slugify from "slugify";
import { toast } from "react-toastify";
import { userRole } from "../../utils/constant";
import { useEffect } from "react";

const cx = classNames.bind(styles);

const schema = yup.object({
  fullname: yup.string().required("Bắt buộc !"),
  email: yup.string().required("Bắt buộc !").email("Sai định dạng Email !"),
  password: yup
    .string()
    .required("Bắt buộc !")
    .min(8, "Mật khẩu phải nhiều hơn 8 ký tự !")
    .max(16, "Mật khẩu phải ít hơn 16 ký tự !"),
});

function SignUp() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting, errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Polomanor Shop - Đăng Ký";
  }, []);

  const handleSubmitRegister = async (values) => {
    try {
      if (!isValid) return;
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      await updateProfile(auth.currentUser, {
        displayName: values.fullname,
        photoURL: "/default-avatar.png",
      });

      await setDoc(doc(db, "user", auth.currentUser.uid), {
        id: auth.currentUser.uid,
        display_name: values.fullname,
        email: values.email,
        avatar: "/default-avatar.png",
        user_url: slugify(values.fullname, { lower: true }),
        role: userRole.USER,
        createAt: serverTimestamp(),
      });
      toast.success("Đăng ký tài khoản thành công !");
      reset();
      navigate(configRoutes.signIn);
    } catch (err) {
      toast.error("Tài khoản hoặc mật khẩu đã tồn tại !");
    }
  };

  return (
    <AuthLayout title="Đăng Ký">
      <form
        className={cx("form")}
        onSubmit={handleSubmit(handleSubmitRegister)}
      >
        <Field
          control={control}
          name="fullname"
          label="Tên đầy đủ"
          placehoder="Ex: Nguyễn Thành Đạt"
          errors={errors.fullname}
        />
        <Field
          type="email"
          control={control}
          name="email"
          label="Địa chỉ Email"
          placehoder="Ex: polomanor@gmail.com"
          errors={errors.email}
        />
        <PasswordField
          type="password"
          control={control}
          name="password"
          label="Mật khẩu"
          placehoder="Nhập mật khẩu"
          errors={errors.password}
        />
        <Button
          type="submit"
          full
          disable={isSubmitting}
          loading={isSubmitting}
        >
          Đăng ký
        </Button>
        <div className={cx("have-account")}>
          Bạn đã có tài khoản ?{" "}
          <Link className={cx("link")} to={configRoutes.signIn}>
            Đăng nhập
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default SignUp;
