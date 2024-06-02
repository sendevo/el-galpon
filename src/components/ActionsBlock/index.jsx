import { Button, Grid } from '@mui/material';

const ActionsBlock = ({onSubmit, onCancel}) => (
    <Grid container spacing={2} direction={"row"} justifyContent={"space-around"}>
        <Grid item>
            <Button 
                variant="contained"
                color="success"
                onClick={onSubmit}>
                Confirmar
            </Button>
        </Grid>
        <Grid item>
            <Button 
                variant="contained"
                color="error"
                onClick={onCancel}>
                Cancelar
            </Button>
        </Grid>
    </Grid>
);

export default ActionsBlock;