import { 
    Paper,
    Grid,
    Button,
    Typography
} from "@mui/material";
import { componentsStyles } from "../../themes";

const ActionsBlock = ({enabledOperations, onBuy, onMoveStock, onSpend, onMovePack, onReturn}) => (
    <Paper sx={{...componentsStyles.paper, p:1, mt:2}}>
        { (enabledOperations.MOVE_STOCK || enabledOperations.SPEND || enabledOperations.BUY) &&
            <Grid container sx={{mb:1}} direction={"column"}>
                <Grid item>
                    <Typography sx={{fontWeight:"bold"}}>Insumos seleccionados</Typography>
                    <Grid 
                        container 
                        direction="row"
                        spacing={2}
                        justifyContent="space-around">
                        <Grid item>
                            <Button
                                disabled={!enabledOperations.BUY}
                                color="green"
                                variant="contained"
                                onClick={onBuy}>
                                Comprar
                            </Button>
                        </Grid>    
                        <Grid item>
                            <Button
                                disabled={!enabledOperations.MOVE_STOCK}
                                color="secondary"
                                variant="contained"
                                onClick={onMoveStock}>
                                Mover
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button     
                                disabled={!enabledOperations.SPEND}
                                color="darkRed"
                                variant="contained"
                                onClick={onSpend}>
                                Usar
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        }
        { enabledOperations.MOVE_PACKS && enabledOperations.RETURN_PACKS &&
            <Grid container direction={"column"}>
                <Typography sx={{fontWeight:"bold"}}>Envases seleccionados</Typography>
                <Grid 
                    container 
                    direction="row"
                    spacing={1}
                    justifyContent="space-around">
                    <Grid item>
                        <Button
                            disabled={!enabledOperations.MOVE_PACKS}
                            color="secondary"
                            variant="contained"
                            onClick={onMovePack}>
                            Mover
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button     
                            disabled={!enabledOperations.RETURN_PACKS}
                            color="darkRed"
                            variant="contained"
                            onClick={onReturn}>
                            Devolver
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        }
    </Paper>
);

export default ActionsBlock;