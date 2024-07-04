import * as React from 'react';
import * as m from '../../constants';
import { Dropdown, OptionOnSelectData, Option, makeStyles, SelectionEvents, Label, Input, Textarea, Checkbox, mergeClasses, Button } from '@fluentui/react-components';
import { getProjects, inboxProject, print, Project } from '../../quireService';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { QuirePrimaryButton } from '../components/QuireComponent';

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
  }
});

const TaskView: React.FC = () => {
  const [view, setView] = React.useState<'create' | 'done'>('create');

  function getView(type: 'create' | 'done') {
    switch (type) {
      case 'create':
        return <_CreateView onDone={() => setView('done')} onCancel={() => setView('create')}/>;
      case 'done':
        return <_DoneView />;
    }
  }

  return getView(view);
}

interface CreateTaskProps {
  onDone: () => void;
  onCancel: () => void;
}

const _CreateView: React.FC<CreateTaskProps> = (prop: CreateTaskProps) => {
  const style = useStyle();
  const [project, setProjectOid] = React.useState<String>(inboxProject.oid);
  const [taskName, setTaskName] = React.useState<String>(`Re: ${Office.context.mailbox.item.subject}`);
  const [dueDate, setDueDate] = React.useState<Date>(new Date());
  const [assignees, setAssignees] = React.useState<String>("");
  const [tags, setTags] = React.useState<String>("");
  const [description, setDescription] = React.useState<String>("");
  const [savePlainText, toggleSavePlainText] = React.useState<Boolean>(false);

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
          label={m.M_FORMCOLUMN_DESCRIPTION_OPTION}
          onChange={(_, data) => toggleSavePlainText(data.checked as boolean)}/>
      </section>
    );
  }

  function onCreate() {
    //TODO: validation

    prop.onDone();
  }

  return (
    <div className={style.task__view}>
      {wrapContent(m.M_FORMCOLUMN_PROJECT, <ProjectSelectionDropdown onSelected={setProjectOid}/>)}
      {wrapContent(m.M_FORMCOLUMN_TASK, inputBuilder(taskName, setTaskName))}
      {wrapContent(m.M_FORMCOLUMN_DUE, 
        <DatePicker
          onSelectDate={setDueDate}
          className={style.task__view__full__row}/>)}
      {wrapContent(m.M_FORMCOLUMN_ASSIGNEES, inputBuilder(assignees, setAssignees), m.M_FORMCOLUMN_ASSIGNEES_DESCRIPTION)}
      {wrapContent(m.M_FORMCOLUMN_TAGS, inputBuilder(tags, setTags), m.M_FORMCOLUMN_TAGS_DESCRIPTION)}
      {descriptionBuilder()}
      <section className={style.task__view__button__group}>
        <QuirePrimaryButton className={style.task__view__button} content={m.M_BUTTON_CREATE} onClick={onCreate} />
        <Button className={style.task__view__button} content={m.M_BUTTON_CANCEL} onClick={prop.onCancel}>{m.M_BUTTON_CANCEL}</Button>
      </section>
    </div>
  );
}

interface ActionableComponentProps<T> {
  onSelected?: (selected: T) => void;
}

const ProjectSelectionDropdown: React.FC<ActionableComponentProps<String>> = (prop: ActionableComponentProps<String>) => {
  const [projectsList, setProjectsList] = React.useState<Project[]>([inboxProject]);

  function onOptionSelect(_: SelectionEvents, data: OptionOnSelectData) {
    prop.onSelected?.(data.optionValue);
  }

  function createProjectOptions() {
    return projectsList.map((project) => {
      return <Option
        style={{ overflow: "clip" }}
        value={project.oid}>
        {project.name}
      </Option>
    });
  };

  React.useEffect(() => {
    prop.onSelected?.(inboxProject.oid);

    getProjects().then((projects) => setProjectsList(projects));
  }, []);

  return (
    <Dropdown 
      style={{width: "100%"}}
      defaultValue={inboxProject.name}
      defaultSelectedOptions={[inboxProject.oid]}
      appearance='outline'
      onOptionSelect={onOptionSelect}>
      {...createProjectOptions()}
    </Dropdown>
  )
};

const _DoneView: React.FC = () => {
  const style = useStyle();

  return (
    <section className={style.task__view}>
      <Label>{m.M_DONE_MESSAGE}</Label>
      <QuirePrimaryButton 
        className={style.task__view__button} style={{ marginTop: "16px" }}
        content={m.M_BUTTON_VIEW_DONE} onClick={() => print("VIEW on QUIRE")} />
      <Button className={style.task__view__button} onClick={() => print("CREATE ANOTHER TASK")}>{m.M_BUTTON_VIEW_CREATE}</Button>
    </section>
  );
}

export default TaskView;