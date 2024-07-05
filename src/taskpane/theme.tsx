import { BrandVariants, Theme, createLightTheme } from "@fluentui/react-components";

//https://react.fluentui.dev/?path=/docs/theme-theme-designer--page
//generate from #05843E
const quireTheme: BrandVariants = {
  10: "#010402",
  20: "#0F1C11",
  30: "#132F1A",
  40: "#143D20",
  50: "#154B26",
  60: "#145A2C",
  70: "#126933",
  80: "#05843E", //was #0C7939, changed to #05843E for button color
  90: "#198843",
  100: "#3D9556",
  110: "#58A26A",
  120: "#70AF7D",
  130: "#87BC91",
  140: "#9EC9A6",
  150: "#B5D6BB",
  160: "#CCE3D0"
};

export const quireLightTheme: Theme = {
  ...createLightTheme(quireTheme)
}
