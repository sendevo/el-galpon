import { useTranslation } from 'react-i18next';
import { 
    Paper,
    Grid,
    Box,
    Button,
    Typography
} from "@mui/material";
import { componentsStyles } from "../../themes";

const exportButtonStyle = {
    marginTop: "20px",
    display:"flex", 
    alignItems:"center", 
    justifyContent:"center"
};

const OperationsBlock = ({enabledOperations, onOperation, onExport}) => {
    
    const { t } = useTranslation('operationsBlock');
    
    return (
        <Paper sx={{...componentsStyles.paper, p:1, mt:2}}>
            { (enabledOperations.MOVE_STOCK || enabledOperations.SPEND || enabledOperations.BUY) &&
                <Grid container sx={{mb:1}} direction={"column"}>
                    <Grid item>
                        <Typography sx={{fontWeight:"bold", mb:1}}>{t('selected')}</Typography>
                        <Grid 
                            container 
                            direction="row"
                            spacing={2}
                            justifyContent="space-around">
                            <Grid item>
                                <Button
                                    disabled={!enabledOperations.BUY}
                                    color="success"
                                    variant="contained"
                                    onClick={()=>onOperation("BUY")}>
                                    {t('buy')}
                                </Button>
                            </Grid>    
                            <Grid item>
                                <Button
                                    disabled={!enabledOperations.MOVE_STOCK}
                                    color="secondary"
                                    variant="contained"
                                    onClick={()=>onOperation("MOVE_STOCK")}>
                                    {t('move')}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button     
                                    disabled={!enabledOperations.SPEND}
                                    color="darkRed"
                                    variant="contained"
                                    onClick={()=>onOperation("SPEND")}>
                                    {t('spend')}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            }
            { enabledOperations.MOVE_PACKS && enabledOperations.RETURN_PACKS &&
                <Grid container direction={"column"}>
                    <Typography sx={{fontWeight:"bold", mb:1, mt:1}}>{t('emptyPacks')}</Typography>
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
                                onClick={()=>onOperation("MOVE_PACKS")}>
                                {t('move')}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button     
                                disabled={!enabledOperations.RETURN_PACKS}
                                color="darkRed"
                                variant="contained"
                                onClick={()=>onOperation("RETURN_PACKS")}>
                                {t('return')}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            }
            <Box sx={exportButtonStyle}>
                <Button
                    color="info"
                    variant="contained"
                    onClick={onExport}>
                    {t('export')}
                </Button>
            </Box>
        </Paper>
    );
};

export default OperationsBlock;