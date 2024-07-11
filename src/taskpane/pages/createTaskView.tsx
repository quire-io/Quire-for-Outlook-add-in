import * as React from 'react';
import * as m from '../../constants';
import { Dropdown, OptionOnSelectData, Option, makeStyles, SelectionEvents, Label, Input, Textarea, Checkbox, mergeClasses, Button } from '@fluentui/react-components';
import { loadProjects, Project, Task, createTask, VoidRun } from '../../quireService';
import { showError, LoadingView, SettingButton, ClearableDatePicker } from '../components/components';
import TurndownService from 'turndown';

const useStyle = makeStyles({
  task__view: {
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  taks__view__section: {
    display: "flex",
    flexWrap: "wrap",
    gap: "2px",
  },
  task__view__label: {
    color: "#616161",
  },
  task__view__description: {
    fontSize: "12px",
    color: "#6E6E6E",
  },
  task__view__full__row: {
    width: "100%",
  },
  task__view__button__group: {
    marginTop: "16px",
    display: "flex",
    gap: "12px",
  },
  task__view__button: {
    padding: "6px 12px",
    minWidth: "unset",
    width: "fit-content",
  },
});

const TaskView: React.FC<{ onLogout?: VoidRun, onLogoutWithError?: (error?: string) => void }> = ({ onLogout, onLogoutWithError }) => {
  const [view, setView] = React.useState<'create' | 'done' | 'loading'>('loading');
  const descriptionRef = React.useRef<string>("");
  const projectsRef = React.useRef<Project[]>([]);
  const settingButton = <SettingButton onLogout={onLogout} />;
  const taskUrlRef = React.useRef<string>("");

  function getView(type: 'create' | 'done' | 'loading') {
    switch (type) {
      case 'create':
        return (
          <>
            <CreateView
              onDone={(url) => {
                taskUrlRef.current = url;
                setView('done');
              }}
              onCancel={() => Office.context.ui.closeContainer()}
              projects={projectsRef.current}
              description={descriptionRef.current} />
            {settingButton}
          </>);
      case 'done':
        return (
          <>
            <DoneView url={taskUrlRef.current} back={() => setView('create')} />
            {settingButton}
          </>);
      case 'loading':
        return <LoadingView />;
    }
  }

  async function getDescription() {
    return new Promise<string>((resolve, reject) => {
      Office.context.mailbox.item.body.getAsync("text", (result) => {
        if (result.status === Office.AsyncResultStatus.Succeeded) {
          descriptionRef.current = result.value;
          resolve(result.value);
        }
        else
          reject(result.error);
      });
    });
  }

  async function getProjects() {
    return new Promise<Project[]>((resolve, reject) => {
      loadProjects().then((projects) => {
        projectsRef.current = projects;
        resolve(projects);
      }).catch((error) => reject(error));
    });
  }


  React.useEffect(() => {
    Promise.all([getProjects(), getDescription()])
      .then(() => setView('create'))
      .catch((error) => onLogoutWithError(error));
  }, []);

  return getView(view);
}

interface CreateTaskProps {
  onDone: (url: string) => void;
  onCancel: VoidRun;
  description: string;
  projects: Project[];
}

const CreateView: React.FC<CreateTaskProps> = (prop: CreateTaskProps) => {
  const style = useStyle();
  const projectOid = React.useRef<string | undefined>(prop.projects[0] && prop.projects[0].id);
  const [taskName, setTaskName] = React.useState<string>(Office.context.mailbox.item.subject);
  const dueDate = React.useRef<Date | undefined>();
  const [assignees, setAssignees] = React.useState<string>("");
  const [tags, setTags] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>(prop.description);
  const asPlainText = React.useRef<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const labelClasses = mergeClasses(style.task__view__label, style.task__view__full__row);

  const turndownService = new TurndownService();

  React.useEffect(() => {
    if (prop.projects.length === 0)
      setError(m.M_ERROR_NO_AVAILABLE);
  }, []);

  function wrapContent(title: string, content: React.ReactNode, description?: string) {
    const descriptionClass = mergeClasses(style.task__view__description, style.task__view__full__row);
    return (
      <section className={style.taks__view__section}>
        <Label className={labelClasses}>{title}</Label>
        {content}
        {description && <Label className={descriptionClass}>{description}</Label>}
      </section>
    );
  }

  function inputBuilder(value: string, setter: React.Dispatch<React.SetStateAction<string>>) {
    return (<Input
      value={value.toString()}
      onChange={(_, data) => setter(data.value)}
      className={style.task__view__full__row} type="text" />);
  }

  function descriptionBuilder() {
    return (
      <section style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
        <Label className={labelClasses}>{m.M_FORMCOLUMN_DESCRIPTION}</Label>
        <Textarea
          value={description.toString()}
          onChange={(_, data) => setDescription(data.value)}
          className={style.task__view__full__row} />
        <Checkbox
          value={asPlainText.current.toString()}
          label={m.M_FORMCOLUMN_DESCRIPTION_OPTION}
          onChange={(_, data) => asPlainText.current = data.checked as boolean} />
      </section>
    );
  }

  function buttonBuilder(options: { appearance: 'primary' | 'outline', onClick: VoidRun, content: string, disabled?: boolean }) {
    return (
      <Button
        disabled={options.disabled}
        appearance={options.appearance}
        className={style.task__view__button}
        onClick={options.onClick}>{options.content}</Button>
    );
  }

  async function onCreate() {
    function getSplitValueList(target: string): string[] | undefined {
      if (target.trim() === "") return undefined;
      const list = target.split(",").map((item) => item.trimStart().trimEnd());
      if (list.length === 0) return undefined;
      return list;
    }

    const desc = asPlainText.current ? 
      turndownService.turndown(description) : description;

    const task = new Task(
      taskName as string,
      dueDate.current,
      getSplitValueList(assignees),
      getSplitValueList(tags),
      desc);

    await createTask(task, projectOid.current)
      .then((taskUrl) => {
        setError(undefined);
        prop.onDone(taskUrl);
      })
      .catch(setError);
  }

  const isCreatable = !(taskName.trim() === "" || projectOid.current == undefined);

  return (
    <div className={style.task__view}>
      {wrapContent(m.M_FORMCOLUMN_PROJECT,
        <ProjectSelectionDropdown projects={prop.projects} onSelected={(oid) => projectOid.current = oid} />)}
      {wrapContent(m.M_FORMCOLUMN_TASK, inputBuilder(taskName, setTaskName))}
      {wrapContent(m.M_FORMCOLUMN_DUE, <ClearableDatePicker dueRef={dueDate} />)}
      {wrapContent(m.M_FORMCOLUMN_ASSIGNEES, inputBuilder(assignees, setAssignees), m.M_FORMCOLUMN_ASSIGNEES_DESCRIPTION)}
      {wrapContent(m.M_FORMCOLUMN_TAGS, inputBuilder(tags, setTags), m.M_FORMCOLUMN_TAGS_DESCRIPTION)}
      {descriptionBuilder()}
      <section className={style.task__view__button__group}>
        {buttonBuilder({ appearance: 'primary', onClick: onCreate, content: m.M_BUTTON_CREATE, disabled: !isCreatable})}
        {buttonBuilder({ appearance: 'outline', onClick: prop.onCancel, content: m.M_BUTTON_CANCEL })}
      </section>

      {error && showError(error)}
    </div>
  );
}

interface ActionableComponentProps<T> {
  onSelected?: (selected: T) => void;
  projects: Project[];
}

const ProjectSelectionDropdown: React.FC<ActionableComponentProps<string>> = (prop: ActionableComponentProps<string>) => {
  function onOptionSelect(_: SelectionEvents, data: OptionOnSelectData) {
    prop.onSelected?.(data.optionValue);
  }

  function createProjectOptions() {
    return prop.projects.map((project) => {
      return <Option
        style={{ overflow: "clip" }}
        value={project.id}>
        {project.name}
      </Option>
    });
  };

  const firstProject = prop.projects[0];

  return (
    <Dropdown
      style={{ width: "100%" }}
      defaultValue={firstProject && firstProject.name}
      defaultSelectedOptions={[firstProject && firstProject.id]}
      appearance='outline'
      onOptionSelect={onOptionSelect}>
      {...createProjectOptions()}
    </Dropdown>
  )
};

const DoneView: React.FC<{ url: string, back: VoidRun }> = ({ url, back }) => {
  const style = useStyle();

  return (
    <section className={style.task__view}>
      <Label>{m.M_DONE_MESSAGE}</Label>
      <Button
        appearance="primary"
        className={style.task__view__button} style={{ marginTop: "16px" }}
        onClick={() => window.open(url, "_blank")}>{m.M_BUTTON_VIEW_DONE}</Button>
      <Button className={style.task__view__button} onClick={back}>{m.M_BUTTON_VIEW_CREATE}</Button>
    </section>
  );
}

export default TaskView;