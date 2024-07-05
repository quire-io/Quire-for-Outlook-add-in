import * as React from "react";
import { makeStyles, Image, Button } from "@fluentui/react-components";
import { M_LOGIN_BUTTON, M_LOGIN_DESCRIPTION, M_LOGIN_TITLE } from "../../constants";

const useStyles = makeStyles({
  login__view: {
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
});

interface LoginViewProps {
  onLogIn?: () => void;
}

const LoginView: React.FC<LoginViewProps> = (prop: LoginViewProps) => {

  const styles = useStyles();

  return (
    <section className={styles.login__view}>
      <Image width="100%" height="auto" src="assets/welcome_start.png" title="welcome_view" />
      <span>{M_LOGIN_TITLE}</span>
      <span>{M_LOGIN_DESCRIPTION}</span>
      <Button style={{ marginTop: "16px" }}
        appearance="primary"
        onClick={prop.onLogIn}>{M_LOGIN_BUTTON}</Button>
    </section>
  )
};

export default LoginView;