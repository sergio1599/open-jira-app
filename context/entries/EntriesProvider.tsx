import { FC, PropsWithChildren, useReducer, useEffect } from "react";
import { useSnackbar } from "notistack";
import { Entry } from "../../interfaces";
import { EntriesContext, entriesReducer } from "./";
import { entriesApi } from "../../apis";

export interface EntriesState {
  entries: Entry[];
}

const Entries_INITIAL_STATE: EntriesState = {
  entries: [],
};

export const EntriesProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(entriesReducer, Entries_INITIAL_STATE);
  const { enqueueSnackbar } = useSnackbar();

  /* Creo el método que agrega la nueva entrada, hago el dispach
  para hacer el envío de la nueva entrada con el payload, disparará la acción, modificará el state */
  const addNewEntry = async (description: string) => {
    /* const newEntry: Entry = {
      _id: uuidv4(),
      description: description,
      createdAt: Date.now(),
      status: "pending",
    }; */

    const { data } = await entriesApi.post<Entry>("/entries", {
      description,
    });
    dispatch({ type: "[Entry] Add-Entry", payload: data });
  };

  const deleteEntry = async ({ _id }: Entry, showSnackBar = false) => {
    try {
      const { data } = await entriesApi.delete<Entry>(`/entries/${_id}`, {});
      dispatch({ type: "[Entry] Entry-Deleted", payload: data });
      if (showSnackBar) {
        enqueueSnackbar("Entrada se borró satisfactoriamente", {
          variant: "success",
          autoHideDuration: 1500,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
        });
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const updateEntry = async (
    { _id, description, status }: Entry,
    showSnackBar = false
  ) => {
    try {
      const { data } = await entriesApi.put<Entry>(`/entries/${_id}`, {
        description,
        status,
      });
      dispatch({ type: "[Entry] Entry-Updated", payload: data });
      if (showSnackBar) {
        enqueueSnackbar("Entrada actualizada", {
          variant: "success",
          autoHideDuration: 1500,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
        });
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const refreshEntries = async () => {
    const { data } = await entriesApi.get<Entry[]>("entries");
    dispatch({ type: "[Entry] Refresh-Data", payload: data });
  };

  useEffect(() => {
    refreshEntries();
  }, []);

  return (
    <EntriesContext.Provider
      value={{
        ...state,
        addNewEntry,
        updateEntry,
        deleteEntry,
      }}
    >
      {children}
    </EntriesContext.Provider>
  );
};
