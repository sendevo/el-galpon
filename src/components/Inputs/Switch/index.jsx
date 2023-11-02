import { 
    Box, 
    Grid, 
    FormControlLabel, 
    Switch as MuiSwitch,
    Typography
} from "@mui/material";
import classes from '../style.module.css';

const Switch = ({name, value, error, labelLeft, labelRight, onChange}) => (
    <Box>
        {name && <span className={classes.Title}>{name}</span>}
    
        <Box className={classes.InputContainer} style={{border: error ? "1px solid red":null}}>
            <Grid 
                container 
                direction="row"
                alignItems="center" 
                spacing={0}>
                <Grid item sm={4}>
                    <Typography fontWeight={value ? "normal" : "bold"}>
                        {labelLeft}
                    </Typography>
                </Grid>
                <Grid item sm={4}>
                    <FormControlLabel
                        label=""
                        labelPlacement="bottom"
                        sx={{"&.MuiFormControlLabel-root":{margin:"0px"}}}
                        control={
                            <MuiSwitch checked={value} onChange={onChange} />
                        }/>        
                </Grid>
                <Grid item sm={4}>
                    <Typography fontWeight={value ? "bold" : "normal"}>
                        {labelRight}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    </Box>
);

export default Switch;