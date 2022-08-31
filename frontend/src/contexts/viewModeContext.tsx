import { createContext, ReactNode, useContext, useState } from "react";

const VIEW_MODE_BUTTON_TEXT = {
  NORMAL: "작게 보기",
  MINI: "크게 보기",
};

export const VIEW_MODE = {
  NORMAL: VIEW_MODE_BUTTON_TEXT.NORMAL,
  MINI: VIEW_MODE_BUTTON_TEXT.MINI,
};

export type ViewModeOptions = typeof VIEW_MODE[keyof typeof VIEW_MODE];
type ViewContextValues = {
  viewMode: ViewModeOptions;
  toggleViewMode: () => void;
};
export const ViewModeContext = createContext({} as ViewContextValues);

export const ViewModeContextProvider = ({ children }: { children: any }) => {
  const [viewMode, setViewMode] = useState<ViewModeOptions>(VIEW_MODE.NORMAL);

  const toggleViewMode = () =>
    viewMode === VIEW_MODE.NORMAL ? setViewMode(VIEW_MODE.MINI) : setViewMode(VIEW_MODE.NORMAL);

  return (
    <ViewModeContext.Provider value={{ viewMode, toggleViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
};

export const useViewModeContext = () => useContext(ViewModeContext);
