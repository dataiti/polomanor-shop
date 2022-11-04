import classNames from "classnames/bind";
import { useController } from "react-hook-form";

import styles from "./Input.module.scss";

const cx = classNames.bind(styles);

function Input({
  control,
  name = "",
  placehoder = "",
  type = "text",
  className = "",
}) {
  const { field } = useController({ control, defaultValue: "", name });

  return (
    <input
      id={name}
      type={type}
      placeholder={placehoder}
      className={cx("input", className)}
      spellCheck={false}
      aria-autocomplete="list"
      {...field}
    />
  );
}

export default Input;
