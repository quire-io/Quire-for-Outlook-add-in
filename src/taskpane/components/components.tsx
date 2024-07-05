import { Menu, MenuTrigger, MenuPopover, MenuList, MenuItem, Label, makeStyles, Image } from "@fluentui/react-components";
import { Settings20Regular, QuestionCircleRegular, SignOutRegular } from "@fluentui/react-icons";
import { VoidRun } from "../../quireService";
import React from "react";
import * as m from "../../constants";

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
  }
});


export const SettingButton: React.FC<{ onLogout?: VoidRun }> = ({ onLogout }) => {
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

export const showError = (message: string) => <Label style={{ color: "#EB425E" }}>{message}</Label>

export const LoadingView: React.FC = () => {
  const style = useStyle();
  return (
    <section className={style.loading__view}>
      <Image src="assets/loading.png" alt="Loading" title="Loading" />
    </section>);
}