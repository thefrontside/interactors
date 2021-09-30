import React from "react";
import Link from "@docusaurus/Link";
import { baseButton } from "./boop-button.css.ts";

export default function Button({ ...props }) {
  let Component = props.to ? Link : "button";

  return <Component className={baseButton} {...props} />;
}
