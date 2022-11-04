import classNames from "classnames/bind";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

import { Field, PasswordField } from "../../components/Field";
import AuthLayout from "../../layout/AuthLayout";
import styles from "./SignIn.module.scss";
import { configRoutes } from "../../utils/configRoutes";
import Button from "../../components/Button/Button";
import { auth } from "../../firebase/firebaseConfig";

const cx = classNames.bind(styles);

const schema = yup.object({
  email: yup.string().required("Bắt buộc !").email("Sai định dạng Email !"),
  password: yup
    .string()
    .required("Bắt buộc !")
    .min(8, "Mật khẩu phải trên 8 ký tự !")
    .max(16, "Mật khẩu phải ít hơn 16 ký tự !"),
});

function SignIn() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting, errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const handleSubmitRegister = async (values) => {
    try {
      if (!isValid) return;
      await signInWithEmailAndPassword(auth, values.email, values.password);

      toast.success("Đăng nhập thành công !");
      navigate(configRoutes.home);
      reset();
    } catch (error) {
      toast.error("Sai email hoặc mật khẩu !");
    }
  };

  return (
    <AuthLayout title="Đăng Nhập">
      <form
        className={cx("form")}
        onSubmit={handleSubmit(handleSubmitRegister)}
      >
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
          classNames={"submit-btn"}
        >
          Đăng nhập
        </Button>
        <div className={cx("have-account")}>
          Bạn chưa có tài khoản ?{" "}
          <Link className={cx("link")} to={configRoutes.signUp}>
            Đăng ký
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default SignIn;
