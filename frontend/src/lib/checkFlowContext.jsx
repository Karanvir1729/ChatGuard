import { createContext, useContext, useState } from "react";

export const defaultCheckFlowState = {
  conversationText: "",
  conversationFile: null,
  confirmationChecked: false,
  institution: "",
  courseCode: "",
  isUofTStudent: false,
  assignmentType: "",
  studentStatus: "",
  syllabusFile: null
};

const CheckFlowContext = createContext(null);

export function CheckFlowProvider({ children }) {
  const [flowState, setFlowState] = useState(defaultCheckFlowState);

  const updateFlowState = (nextState) => {
    if (typeof nextState === "function") {
      setFlowState((currentState) => ({
        ...currentState,
        ...nextState(currentState)
      }));
      return;
    }

    setFlowState((currentState) => ({
      ...currentState,
      ...nextState
    }));
  };

  const resetFlowState = () => {
    setFlowState({ ...defaultCheckFlowState });
  };

  return (
    <CheckFlowContext.Provider
      value={{
        flowState,
        updateFlowState,
        resetFlowState
      }}
    >
      {children}
    </CheckFlowContext.Provider>
  );
}

export function useCheckFlow() {
  const context = useContext(CheckFlowContext);

  if (!context) {
    throw new Error("useCheckFlow must be used within CheckFlowProvider.");
  }

  return context;
}
