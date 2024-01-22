import { useContext } from "react";
import { UIUtilsDispatchContext } from "../../context/UIFeedback";

const usePrompt = () => {
    const dispatch = useContext(UIUtilsDispatchContext);
  
    return (title, message, inputType, inputProps, onConfirm = val=>console.log(val), onCancel = ()=>{}) => {
        dispatch({
            type: 'SHOW_PROMPT',
            payload: {
                title,
                message,
                inputType,
                inputProps,
                onConfirm: val => {
                    onConfirm(val);
                    dispatch({
                        type: 'HIDE_PROMPT'
                    });
                },
                onCancel: () => {
                    onCancel();
                    dispatch({
                        type: 'HIDE_PROMPT'
                    });
                }
            }
        });
    };
};

export default usePrompt;