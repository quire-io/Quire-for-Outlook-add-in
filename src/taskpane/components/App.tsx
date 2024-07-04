import * as React from "react";
import { makeStyles } from "@fluentui/react-components";
import { attemptAutoLogin, print, quireAuthentication } from "../../quireService";
import { Image } from "@fluentui/react-components";
import LoginView from "../pages/loginView";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
  loading__view: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  }
});

enum AppView {
  login, main, loading
}

const App: React.FC = () => {
  const styles = useStyles();
  const [currentView, setView] = React.useState<AppView>(AppView.loading);

  React.useEffect(() => {
    Office.onReady(async () => {
      const isLoggedin = await attemptAutoLogin();
      setTimeout(() => setView(isLoggedin ? AppView.main : AppView.login), 1000);
    });
  })

  async function onLogIn() {
    if (await quireAuthentication())
      setView(AppView.main);
    else { //TODO: pop error message
      setView(AppView.login);
      console.error("Failed to login");
    }
  }

  function _getView(view: AppView): JSX.Element {
    switch (view) {
      case AppView.login:
        return <LoginView onLogIn={onLogIn}/>;
      case AppView.loading:
        return (
          <section className={styles.loading__view}>
            <Image src="assets/loading.png" alt="Loading" title="Loading" />
          </section>);
      default:
        return <div>Not implemented</div>;
    }
  }

  return (
    <div className={styles.root}>
      {_getView(currentView)}
    </div>
  );
};

export default App;