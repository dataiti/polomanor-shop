import classNames from "classnames/bind";
import { Link } from "react-router-dom";

import Loading from "../Loading";
import styles from "./Button.module.scss";

const cx = classNames.bind(styles);

function Button({
  to,
  onClick,
  type,
  href,
  medium = false,
  small = false,
  primary = false,
  secondary = false,
  disable = false,
  loading = false,
  full = false,
  outline = false,
  spin = false,
  leftIcon = false,
  danger = false,
  rouded = false,
  large = false,
  children,
  classNames,
  ...props
}) {
  let Button = "button";

  const rest = {
    onClick: onClick,
    type: { type },
    ...props,
  };

  if (to) {
    Button = Link;
    rest.to = to;
  }

  if (disable) {
    Object.keys(props).forEach((key) => {
      if (key.startsWith("on") && typeof props[key] === "function") {
        delete props[key];
      }
    });
  }

  const classes = cx("wrapper", {
    [classNames]: classNames,
    primary,
    secondary,
    full,
    disable,
    danger,
    spin,
    medium,
    small,
    large,
    outline,
    rouded,
  });

  const child = !!loading ? <Loading /> : children;

  return (
    <Button className={classes} {...rest}>
      {leftIcon && <div className={cx("icon")}>{leftIcon}</div>}
      {<span className={cx("title")}>{child}</span>}
    </Button>
  );
}

export default Button;
