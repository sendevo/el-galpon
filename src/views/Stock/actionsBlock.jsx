import { 
    Paper,
    Grid,
    Button,
    Typography
} from "@mui/material";
import { componentsStyles } from "../../themes";

const ActionsBlock = ({onAdd, onMove, onRemove}) => (
    <Paper sx={{...componentsStyles.paper, p:1, mt:2}}>
        <Grid container sx={{mb:1}} direction={"column"}>
            <Typography sx={{fontWeight:"bold"}}>Acciones</Typography>
        </Grid>
        <Grid 
            container 
            direction="row"
            spacing={1}
            justifyContent="space-around">
            <Grid item>
                <Button 
                    color="green"
                    variant="contained"
                    onClick={onAdd}>
                    Agregar
                </Button>
            </Grid>
            <Grid item>
                <Button
                    color="secondary"
                    variant="contained"
                    onClick={onMove}>
                    Mover
                </Button>
            </Grid>
            <Grid item>
                <Button     
                    color="red"
                    variant="contained"
                    onClick={onRemove}>
                    Usar
                </Button>
            </Grid>
        </Grid>
    </Paper>
);

export default ActionsBlock;