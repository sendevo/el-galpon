import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button
} from '@mui/material';

const Confirm = ({open, title, message, onConfirm, onCancel, okLabel, cancelLabel}) => (
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
        </DialogContent>
        <DialogActions>
            <Button onClick={onCancel}>
                {cancelLabel !== undefined && cancelLabel !== null ? cancelLabel : "Cancelar"}
            </Button>
            <Button onClick={onConfirm} autoFocus>{okLabel || "Aceptar"}</Button>
        </DialogActions>
    </Dialog>
);

export default Confirm;