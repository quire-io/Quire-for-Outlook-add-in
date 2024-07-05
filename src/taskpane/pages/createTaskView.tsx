import * as React from 'react';
import * as m from '../../constants';
import { Dropdown, OptionOnSelectData, Option, makeStyles, SelectionEvents, Label, Input, Textarea, Checkbox, mergeClasses, Button, Menu, MenuTrigger, MenuPopover, MenuList, MenuItem } from '@fluentui/react-components';
import { loadProjects, inboxProject, print, Project } from '../../quireService';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { LoadingView } from '../components/App';
import { QuestionCircleRegular, Settings20Regular, SignOutRegular } from '@fluentui/react-icons';

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
  },
  setting__button: {
    position: "absolute",
    right: "20px",
    bottom: "16px",
    '&:hover': {
      cursor: "pointer",
      color: "#424242",
    }
  },
  option__icon: {
    color: "#424242 !important",
  }
});

const TaskView: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const [view, setView] = React.useState<'create' | 'done' | 'loading'>('loading');
  const descriptionRef = React.useRef<String>("");
  const projectsRef = React.useRef<Project[]>([]);
  const settingButton = <SettingButton onLogout={onLogout} />;

  function getView(type: 'create' | 'done' | 'loading') {
    switch (type) {
      case 'create':
        return (
          <>
            <CreateView
              onDone={() => setView('done')}
              onCancel={() => Office.context.ui.closeContainer()}
              projects={projectsRef.current}
              description={descriptionRef.current} />
            {settingButton}
          </>);
      case 'done':
        return (
          <>
            <DoneView />
            {settingButton}
          </>);
      case 'loading':
        return <LoadingView />;
    }
  }

  async function getDescription() {
    return new Promise<String>((resolve, reject) => {
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
      .catch((error) => console.error(error));
  }, []);

  return getView(view);
}

interface CreateTaskProps {
  onDone: () => void;
  onCancel: () => void;
  description: String;
  projects: Project[];
}

const CreateView: React.FC<CreateTaskProps> = (prop: CreateTaskProps) => {
  const style = useStyle();
  const projectOid = React.useRef<String>(inboxProject.oid);
  const [taskName, setTaskName] = React.useState<String>(`Re: ${Office.context.mailbox.item.subject}`);
  const dueDate = React.useRef<Date>(new Date());
  const [assignees, setAssignees] = React.useState<String>("");
  const [tags, setTags] = React.useState<String>("");
  const [description, setDescription] = React.useState<String>(prop.description);
  const asPlainText = React.useRef<Boolean>(false);

  const labelClasses = mergeClasses(style.task__view__label, style.task__view__full__row);

  function wrapContent(title: String, content: React.ReactNode, description?: String) {
    const descriptionClass = mergeClasses(style.task__view__description, style.task__view__full__row);
    return (
      <section className={style.taks__view__section}>
        <Label className={labelClasses}>{title}</Label>
        {content}
        {description && <Label className={descriptionClass}>{description}</Label>}
      </section>
    );
  }

  function inputBuilder(value: String, setter: React.Dispatch<React.SetStateAction<String>>) {
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
          onChange={(_, data) => asPlainText.current = data.checked as Boolean} />
      </section>
    );
  }

  function buttonBuilder(options: { appearance: 'primary' | 'outline', onClick: () => void, content: String }) {
    return (
      <Button
        appearance={options.appearance}
        className={style.task__view__button}
        onClick={options.onClick}>{options.content}</Button>
    );
  }

  function onCreate() {
    //TODO: validation

    prop.onDone();
  }

  return (
    <div className={style.task__view}>
      {wrapContent(m.M_FORMCOLUMN_PROJECT,
        <ProjectSelectionDropdown projects={prop.projects} onSelected={(oid) => projectOid.current = oid} />)}
      {wrapContent(m.M_FORMCOLUMN_TASK, inputBuilder(taskName, setTaskName))}
      {wrapContent(m.M_FORMCOLUMN_DUE,
        <DatePicker
          onSelectDate={(date) => dueDate.current = date}
          className={style.task__view__full__row} />)}
      {wrapContent(m.M_FORMCOLUMN_ASSIGNEES, inputBuilder(assignees, setAssignees), m.M_FORMCOLUMN_ASSIGNEES_DESCRIPTION)}
      {wrapContent(m.M_FORMCOLUMN_TAGS, inputBuilder(tags, setTags), m.M_FORMCOLUMN_TAGS_DESCRIPTION)}
      {descriptionBuilder()}
      <section className={style.task__view__button__group}>
        {buttonBuilder({ appearance: 'primary', onClick: onCreate, content: m.M_BUTTON_CREATE })}
        {buttonBuilder({ appearance: 'outline', onClick: prop.onCancel, content: m.M_BUTTON_CANCEL })}
      </section>
    </div>
  );
}

interface ActionableComponentProps<T> {
  onSelected?: (selected: T) => void;
  projects: Project[];
}

const ProjectSelectionDropdown: React.FC<ActionableComponentProps<String>> = (prop: ActionableComponentProps<String>) => {
  function onOptionSelect(_: SelectionEvents, data: OptionOnSelectData) {
    prop.onSelected?.(data.optionValue);
  }

  function createProjectOptions() {
    return prop.projects.map((project) => {
      return <Option
        style={{ overflow: "clip" }}
        value={project.oid}>
        {project.name}
      </Option>
    });
  };

  return (
    <Dropdown
      style={{ width: "100%" }}
      defaultValue={inboxProject.name}
      defaultSelectedOptions={[inboxProject.oid]}
      appearance='outline'
      onOptionSelect={onOptionSelect}>
      {...createProjectOptions()}
    </Dropdown>
  )
};

const DoneView: React.FC = () => {
  const style = useStyle();

  return (
    <section className={style.task__view}>
      <Label>{m.M_DONE_MESSAGE}</Label>
      <Button
        className={style.task__view__button} style={{ marginTop: "16px" }}
        onClick={() => print("VIEW on QUIRE")}>{m.M_BUTTON_VIEW_DONE}</Button>
      <Button className={style.task__view__button} onClick={() => print("CREATE ANOTHER TASK")}>{m.M_BUTTON_VIEW_CREATE}</Button>
    </section>
  );
}

const SettingButton: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const style = useStyle();

  function onHelp() {
    //TODO: link to guide/blog if we have one
  }

  return (
    <Menu>
      <MenuTrigger>
        <Settings20Regular className={style.setting__button} />
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          <MenuItem icon={<QuestionCircleRegular className={style.option__icon} />}>{m.M_SETTING_HELP}</MenuItem>
          <MenuItem icon={<SignOutRegular className={style.option__icon} />} onClick={onLogout}>{m.M_SETTING_LOGOUT}</MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

export default TaskView;