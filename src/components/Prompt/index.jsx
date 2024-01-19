import { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Box
} from '@mui/material';
import Input from '../Inputs/Input';
import Select from '../Inputs/Select';

const Prompt = ({open, title, message, inputType, inputProps, onConfirm, onCancel}) => {

    const [value, setValue] = useState("");

    const handleConfirm = () => {
        onConfirm(value);
        setValue(""); // Reset the value
    };

    return (
        <Dialog        
            BackdropProps={{sx:{backdropFilter: "blur(2px)"}}}
            open={open}
            onClose={onCancel}>
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {message}
                </DialogContentText>
                <Box sx={{marginTop: "20px"}}>
                {inputType === "input" && 
                    <Input 
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        {...inputProps}/>
                }
                {inputType === "select" && 
                    <Select
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        {...inputProps} />
                }
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancelar</Button>
                <Button onClick={handleConfirm} autoFocus>Aceptar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default Prompt;