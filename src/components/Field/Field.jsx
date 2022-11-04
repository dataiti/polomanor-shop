import classNames from "classnames/bind";
import { BsCheckCircleFill } from "react-icons/bs";

import Input from "../Input";
import Label from "../Label";
import styles from "./Field.module.scss";

const cx = classNames.bind(styles);

function Field({
  control,
  label = "",
  name = "",
  type = "",
  placeholder = "",
  newPrice,
  errors = false,
  children = "",
  ...props
}) {
  return (
    <div className={cx("form-group")}>
      <Label htmlFor={name} children={label} />
      <div className={cx("input-wrapper")}>
        <Input
          type={type}
          control={control}
          name={name}
          placeholder={placeholder}
          {...props}
        />
        {errors && <p className={cx("errors-mes")}>{errors.message}</p>}
        {!errors?.message && (
          <span className={cx("icon-check")}>
            <BsCheckCircleFill />
          </span>
        )}
      </div>
    </div>
  );
}

export default Field;
