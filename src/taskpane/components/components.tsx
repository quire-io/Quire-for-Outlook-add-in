import { Menu, MenuTrigger, MenuPopover, MenuList, MenuItem, Label, makeStyles, Image } from "@fluentui/react-components";
import { Settings20Regular, QuestionCircleRegular, SignOutRegular, Dismiss20Regular } from "@fluentui/react-icons";
import { VoidRun } from "../../quireService";
import React from "react";
import * as m from "../../constants";
import { DatePicker } from "@fluentui/react-datepicker-compat";

const useStyle = makeStyles({
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
  },
  loading__view: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  floating__clear__button: {
    position: "absolute",
    margin: "6px",
    right: "50px"
  },
  date__picker: {
    width: "100%",
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
  }
});


export const SettingButton: React.FC<{ onLogout?: VoidRun }> = ({ onLogout }) => {
  const style = useStyle();

  function onHelp() {
    window.open(m.HELP_URL, "_blank");
  }

  return (
    <Menu>
      <MenuTrigger>
        <Settings20Regular className={style.setting__button} />
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          <MenuItem icon={<QuestionCircleRegular className={style.option__icon} />} onClick={onHelp}>{m.M_SETTING_HELP}</MenuItem>
          <MenuItem icon={<SignOutRegular className={style.option__icon} />} onClick={onLogout}>{m.M_SETTING_LOGOUT}</MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

export const showError = (message: string) => <Label style={{ color: "#EB425E" }}>{message}</Label>

export const LoadingView: React.FC = () => {
  const style = useStyle();
  return (
    <section className={style.loading__view}>
      <Image src="assets/loading.png" alt="Loading" title="Loading" />
    </section>);
}


export const ClearableDatePicker: React.FC<{ dueRef: React.MutableRefObject<Date | undefined> }> = ({ dueRef }) => {
  const style = useStyle();

  const [date, setDate] = React.useState<Date | null>(null);

  function onSelect(date?: Date | undefined | null) {
    dueRef.current = date;
    setDate(date);
  }

  return (
    <div style={{ width: "100%", display: "flex", flexWrap: "nowrap" }}>
      <DatePicker onSelectDate={onSelect} style={{ width: "100%" }} value={date} />
      {
        date &&
        <div onClick={() => onSelect(null)} className={style.floating__clear__button}>
          <Dismiss20Regular />
        </div>
      }
    </div>
  )
}