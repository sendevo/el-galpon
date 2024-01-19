export const showToast = (dispatch, message, severity = "info", duration = 2000, onClose = ()=>{}) => {
    dispatch({
        type: 'SHOW_TOAST',
        payload: {
            message,
            severity,
            onClose
        }
    });
    setTimeout(()=>{
        dispatch({
            type: 'HIDE_TOAST'
        });
    }, duration);
};

export const setLoading = (dispatch, loading) => {
    dispatch({
        type: 'TOGGLE_PRELOADER',
        payload: loading
    });
};

export const showConfirm = (
    dispatch, 
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

export const showPrompt = (dispatch, title, message, inputType, inputProps, onConfirm = val=>console.log(val), onCancel = ()=>{}) => {
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

export const openDrawer = (dispatch, content) => {
    dispatch({
        type: "OPEN_DRAWER",
        payload: {
            children: content,
            onClose: () => closeDrawer(dispatch)
        }
    });
};

export const closeDrawer = (dispatch) => {
    dispatch({
        type: "CLOSE_DRAWER"
    });
};