import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button
} from '@mui/material';
import { useTranslation } from "react-i18next";

const Confirm = ({open, title, message, onConfirm, onCancel, okLabel, cancelLabel}) => {
    const { t } = useTranslation("ui");

    return (
        <Dialog        
            BackdropProps={{sx:{backdropFilter: "blur(2px)"}}}
            sx={{zIndex: '9999'}}
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
                {typeof onCancel === "function" &&
                    <Button onClick={onCancel}>
                        {cancelLabel || t("cancel")}
                    </Button>
                }
                <Button onClick={onConfirm} autoFocus>{okLabel || t("ok")}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default Confirm;