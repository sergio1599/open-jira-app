import { createContext } from "react";

interface ContextProps {
  entries: [] /* Falta el tipo de dato del arreglo */;
}

export const EntriesContext = createContext({} as ContextProps);