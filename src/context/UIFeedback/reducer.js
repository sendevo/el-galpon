/* 
UI components format:

toast: {
    open: false,
    message: "",
    severity: "info", // success, info, error
    onClose: ()=>{}
},
confirm: {
    open: false,
    title: "",
    message: "",
    onConfirm: ()=>{},
    onCancel: ()=>{}
},
prompt: {
    open: false,
    title: "",
    message: "",
    inputType: "input",
    inputProps: {
        type: "text",
        label: "Valor",
        unit: ""
    },
    onConfirm: val=>console.log(val),
    onCancel: ()=>{}
}
*/

export const initialState = {
    loading: false,
    toast: null,
    confirm: null,
    prompt: null
};

export const reducer = (prevState, action) => {
    switch(action.type) {
        case 'TOGGLE_PRELOADER':
            return {
                ...prevState,
                loading: action.payload
            };
        case 'SHOW_TOAST':{
            const {message, severity, onClose} = action.payload;
            return {
                ...prevState,
                toast: {
                    open: true,
                    message,
                    severity,
                    onClose                    
                }
            };
        }
        case 'HIDE_TOAST': {
            return {
                ...prevState,
                toast: {
                    ...prevState.toast,
                    open: false
                }
            };
        }
        case 'SHOW_CONFIRM': {
            const {title, message, onConfirm, onCancel, okLabel, cancelLabel} = action.payload;
            return {
                ...prevState,
                confirm: {
                    open: true,
                    title,
                    message, 
                    onConfirm,
                    onCancel,
                    okLabel,
                    cancelLabel
                }
            };
        }
        case 'HIDE_CONFIRM': {
            return {
                ...prevState,
                confirm: null
            };
        }
        case 'SHOW_PROMPT': {
            const {title, message, inputType, inputProps, onConfirm, onCancel} = action.payload;
            return {
                ...prevState,
                prompt: {
                    open: true,
                    title, 
                    message,
                    inputType,
                    inputProps,
                    onConfirm,
                    onCancel
                }
            };
        }
        case 'HIDE_PROMPT': {
            return {
                ...prevState,
                prompt: null
            }
        }
        default: 
            console.warn(`Unhandled action type: ${action.type}`);
            return prevState;
    }
};