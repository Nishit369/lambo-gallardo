import { swatch, fileIcon, ai, logocar, stylishcar, download, headlight } from "../assets";

export const EditorTabs = [
  {
    name: "colorpicker",
    icon: swatch,
  },
  {
    name: "filepicker",
    icon: fileIcon,
  },
  {
    name: "aipicker",
    icon: ai,
  },
];

export const FilterTabs = [
  {
    name: "logoCar",
    icon: logocar,
  },
  {
    name: "stylishCar",
    icon: stylishcar,
  },
  {
    name: "headlights",
    icon: headlight,
  }
];

export const DecalTypes = {
  logo: {
    stateProperty: "logoDecal",
    filterTab: "logoCar",
  },
  full: {
    stateProperty: "fullDecal",
    filterTab: "stylishCar",
  },
};
