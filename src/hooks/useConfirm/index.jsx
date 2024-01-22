import { useContext } from "react";
import { UIUtilsDispatchContext } from "../../context/UIFeedback";

const useConfirm = () => {
    const dispatch = useContext(UIUtilsDispatchContext);
  
    return (
        title, 
        message, 
        onConfirm = ()=>{}, 
        onCancel = ()=>{}, 
        okLabel = "Aceptar", 
        cancelLabel = "Cancelar") => {
        dispatch({
            type: 'SHOW_CONFIRM',
            payload: {            
                title,
                message,
                onConfirm: ()=>{
                    onConfirm();
                    dispatch({
                        type: 'HIDE_CONFIRM'
                    });
                },
                onCancel: ()=>{
                    onCancel();
                    dispatch({
                        type: 'HIDE_CONFIRM'
                    });
                },
                okLabel,
                cancelLabel
            }
        });
    };
};

export default useConfirm;