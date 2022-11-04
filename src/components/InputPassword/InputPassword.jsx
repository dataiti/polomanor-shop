import classNames from "classnames/bind";
import { Fragment, useState } from "react";
import { useController } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import styles from "./InputPassword.module.scss";

const cx = classNames.bind(styles);

function InputPassword({
  control,
  name = "",
  placehoder = "",
  type = "text",
  className = "",
  hasIcon = true,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const { field } = useController({ control, defaultValue: "", name });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Fragment>
      <input
        id={name}
        type={showPassword ? "text" : "password"}
        placeholder={placehoder}
        className={cx("input", { ...className })}
        spellCheck={false}
        aria-autocomplete="list"
        {...field}
      />
      <div className={cx("eye-icon")} onClick={handleTogglePassword}>
        {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
      </div>
    </Fragment>
  );
}

export default InputPassword;
