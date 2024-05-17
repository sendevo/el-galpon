import { 
    Paper,
    Grid,
    Button,
    Typography
} from "@mui/material";
import { componentsStyles } from "../../themes";

const ActionsBlock = ({disabledButtons, onBuy, onMoveStock, onSpend, onMovePack, onReturn}) => (
    <Grid container direction={"column"}>
        <Paper sx={{...componentsStyles.paper, p:1, mt:2}}>
            <Grid container sx={{mb:1}} direction={"column"}>
                <Typography sx={{fontWeight:"bold"}}>Acciones sobre stock</Typography>
            </Grid>
            <Grid 
                container 
                direction="row"
                spacing={1}
                justifyContent="space-around">
                <Grid item>
                    <Button 
                        disabled={disabledButtons.buy}
                        color="green"
                        variant="contained"
                        onClick={onBuy}>
                        Comprar
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        disabled={disabledButtons.moveStock}
                        color="secondary"
                        variant="contained"
                        onClick={onMoveStock}>
                        Mover
                    </Button>
                </Grid>
                <Grid item>
                    <Button     
                        disabled={disabledButtons.spend}
                        color="darkRed"
                        variant="contained"
                        onClick={onSpend}>
                        Usar
                    </Button>
                </Grid>
            </Grid>
        </Paper>
        <Paper sx={{...componentsStyles.paper, p:1, mt:2}}>
            <Grid container sx={{mb:1}} direction={"column"}>
                <Typography sx={{fontWeight:"bold"}}>Acciones sobre envases</Typography>
            </Grid>
            <Grid 
                container 
                direction="row"
                spacing={1}
                justifyContent="space-around">
                <Grid item>
                    <Button
                        disabled={disabledButtons.movePacks}
                        color="secondary"
                        variant="contained"
                        onClick={onMovePack}>
                        Mover
                    </Button>
                </Grid>
                <Grid item>
                    <Button     
                        disabled={disabledButtons.return}
                        color="darkRed"
                        variant="contained"
                        onClick={onReturn}>
                        Devolver
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    </Grid>
);

export default ActionsBlock;