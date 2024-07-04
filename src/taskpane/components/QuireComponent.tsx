import { Button, makeStyles } from "@fluentui/react-components"
import { COLOR_PRIMARY, COLOR_SECONDARY } from "../../constants";
import React from "react";

//didn't find out how to override theme color
const buttonStyles = makeStyles({
  quire__primaryButton: {
    backgroundColor: COLOR_PRIMARY,
    color: "#FFFFFF",
    "&:hover": {
      backgroundColor: COLOR_SECONDARY,
      color: "#FFFFFF",
    }
  }
});

interface QuirePrimaryButtonProps {
  onClick?: () => void;
  content?: string;
  style?: React.CSSProperties;
}

export const QuirePrimaryButton: React.FC<QuirePrimaryButtonProps> = (prop: QuirePrimaryButtonProps) => {
  const btnStyles = buttonStyles();

  return (
    <Button className={btnStyles.quire__primaryButton}
      style={prop.style}
      onClick={prop.onClick}>{prop.content}</Button>
  );
}