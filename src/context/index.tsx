import { useContext } from "react";
import { SystemContext } from "./system.context";

export const useSystemContext = () => useContext(SystemContext);
