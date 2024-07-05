import * as React from "react";
import { attemptAutoLogin, quireAuthentication } from "../../quireService";
import LoginView from "../pages/loginView";
import TaskView from "../pages/createTaskView";
import { LoadingView } from "./components";

enum AppView {
  login, task, loading
}

const App: React.FC = () => {
  const [currentView, setView] = React.useState<AppView>(AppView.loading);
  const [error, setError] = React.useState<string | undefined>();

  React.useEffect(() => {
    Office.onReady(async () =>
      await attemptAutoLogin()
        .then(() => setView(AppView.task))
        .catch(() => setView(AppView.login)));
  }, [])

  async function onLogIn() {
    await quireAuthentication()
      .then(() => {
        setError(undefined);
        setView(AppView.task);
      })
      .catch(setError);
  }

  function onLogout() {
    localStorage.clear();
    setView(AppView.login);
  }

  function getView(view: AppView) {
    switch (view) {
      case AppView.login:
        return <LoginView onLogin={onLogIn} error={error} />;
      case AppView.task:
        return <TaskView onLogout={onLogout} />;
      case AppView.loading:
        return <LoadingView />
    }
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      {getView(currentView)}
    </div>
  );
};

export default App;