import { BsCheckCircleFill } from "react-icons/bs";
import classNames from "classnames/bind";

import InputPassword from "../InputPassword/InputPassword";
import Label from "../Label";
import styles from "./Field.module.scss";

const cx = classNames.bind(styles);

function PasswordField({
  control,
  label = "",
  name = "",
  type = "",
  placeholder = "",
  errors,
  children = "",
  ...props
}) {
  return (
    <div className={cx("form-group")}>
      <Label htmlFor={name} children={label} />
      <div className={cx("input-wrapper")}>
        <InputPassword
          type={type}
          control={control}
          name={name}
          placeholder={placeholder}
          {...props}
        />
        {errors ? (
          <p className={cx("errors-mes")}>{errors.message}</p>
        ) : (
          <span className={cx("icon-check")}>
            <BsCheckCircleFill />
          </span>
        )}
      </div>
    </div>
  );
}

export default PasswordField;
