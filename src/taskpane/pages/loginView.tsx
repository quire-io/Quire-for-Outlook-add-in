import * as React from "react";
import { makeStyles, Image, Button } from "@fluentui/react-components";
import { M_LOGIN_BUTTON, M_LOGIN_DESCRIPTION, M_LOGIN_TITLE } from "../../constants";
import { VoidRun } from "../../quireService";
import { showError } from "../components/components";

const useStyles = makeStyles({
  login__view: {
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
});

const LoginView: React.FC<{ onLogin: VoidRun, error: string }> = ({ onLogin, error }) => {

  const styles = useStyles();

  return (
    <section className={styles.login__view}>
      <Image width="100%" height="auto" src="assets/welcome_start.png" title="welcome_view" />
      <span>{M_LOGIN_TITLE}</span>
      <span>{M_LOGIN_DESCRIPTION}</span>
      <Button style={{ marginTop: "16px" }}
        appearance="primary"
        onClick={onLogin}>{M_LOGIN_BUTTON}</Button>
      {error && showError(error)}
    </section>
  )
};

export default LoginView;