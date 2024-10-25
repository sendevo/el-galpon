import { Button, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

const ActionsBlock = ({onSubmit, onCancel}) => {
    const {t} = useTranslation('common');

    return (
        <Grid 
            container 
            spacing={2} 
            direction={"row"} 
            justifyContent={"space-around"}>
            <Grid item>
                <Button 
                    variant="contained"
                    color="success"
                    onClick={onSubmit}>
                    {t('confirm')}
                </Button>
            </Grid>
            <Grid item>
                <Button 
                    variant="contained"
                    color="error"
                    onClick={onCancel}>
                    {t('cancel')}
                </Button>
            </Grid>
        </Grid>
    );
};

export default ActionsBlock;