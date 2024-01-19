import React, { useReducer, createContext } from 'react';
import Preloader from '../../components/Preloader';
import Toast from '../../components/Toast';
import Confirm from '../../components/Confirm';
import Prompt from '../../components/Prompt';
import { reducer, initialState } from './reducer';

export const UIUtilsStateContext = createContext();
export const UIUtilsDispatchContext = createContext();

const UIUtilsProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {loading, toast, confirm, prompt} = state;

    return (
        <UIUtilsStateContext.Provider value={state}>
            <UIUtilsDispatchContext.Provider value={dispatch}>
                {loading && <Preloader />}
                {toast && <Toast {...toast} />}
                {confirm && <Confirm {...confirm} />}
                {prompt && <Prompt {...prompt} />}
                {children}
            </UIUtilsDispatchContext.Provider>
        </UIUtilsStateContext.Provider>
    );
}

export default UIUtilsProvider;