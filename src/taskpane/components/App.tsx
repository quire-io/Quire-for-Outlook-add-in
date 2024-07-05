import * as React from "react";
import { makeStyles } from "@fluentui/react-components";
import { attemptAutoLogin, print, quireAuthentication } from "../../quireService";
import { Image } from "@fluentui/react-components";
import LoginView from "../pages/loginView";
import TaskView from "../pages/createTaskView";

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
  login, task, loading
}

const App: React.FC = () => {
  const styles = useStyles();
  const [currentView, setView] = React.useState<AppView>(AppView.loading);

  React.useEffect(() => {
    Office.onReady(async () => {
      const isLoggedin = await attemptAutoLogin();
      setTimeout(() => setView(isLoggedin ? AppView.task : AppView.login), 1000);
    });
  }, [])

  async function onLogIn() {
    if (await quireAuthentication())
      setView(AppView.task);
    else { //TODO: pop error message
      setView(AppView.login);
      console.error("Failed to login");
    }
  }

  function onLogout() {
    localStorage.clear();
    setView(AppView.login);
  }

  function getView(view: AppView): JSX.Element {
    switch (view) {
      case AppView.login:
        return <LoginView onLogIn={onLogIn}/>;
      case AppView.loading:
        return <LoadingView />;
      case AppView.task:
        return <TaskView onLogout={onLogout} />;
      default:
        return <div>Not implemented</div>;
    }
  }

  return (
    <div className={styles.root}>
      {getView(currentView)}
    </div>
  );
};

export default App;

export const LoadingView: React.FC = () => {
  const styles = useStyles();
  return (
    <section className={styles.loading__view}>
      <Image src="assets/loading.png" alt="Loading" title="Loading" />
    </section>);
}