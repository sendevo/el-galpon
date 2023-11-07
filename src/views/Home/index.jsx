import { Link } from "react-router-dom";
import { 
    Box, 
    Button, 
    Grid,
    Typography 
} from "@mui/material";
import MainView from "../../components/MainView";
import { APP_NAME } from "../../model/constants";
import { viewsStyles } from "../../themes";
import background from "../../assets/backgrounds/background1.jpg";
import logo from "../../assets/logo_el_galpon.png";
import leftImage from "../../assets/logo_inta_white.png";
import rightImage from "../../assets/logo_ministerio_white.png";


const styles = viewsStyles.home;

const View = () => (
    <MainView background={background}>
        <Box sx={styles.mainIcon}>
            <img src={logo} height="25%" width="25%" alt="logo"/>
        </Box>
        <Box style={{textAlign: "center", marginTop:"5px"}}>
            <Typography variant="h4" sx={styles.title}>{APP_NAME}</Typography>
        </Box>
        <Grid 
            sx={styles.buttonsContainer}
            container 
            direction="column"
            spacing={1} 
            alignItems="center">
            <Grid item>
                <Link to="/store-list">
                    <Button variant="contained" sx={styles.button}>Depósitos</Button>
                </Link>
            </Grid>
            <Grid item>
                <Link to="/product-list">
                    <Button variant="contained" sx={styles.button}>Productos</Button>
                </Link>
            </Grid>
            <Grid item>
                <Link to="/stock">
                    <Button variant="contained" sx={styles.button}>Insumos</Button>
                </Link>
            </Grid>
            <Grid item>
                <Link to="/operations">
                    <Button variant="contained" sx={styles.button}>Movimientos</Button>
                </Link>
            </Grid>
            <Grid item sx={{mt:2}}>
                <Link to="/about">
                    <Button variant="contained" sx={styles.button}>Información y ayuda</Button>
                </Link>
            </Grid>
        </Grid>
        <Box sx={styles.bottomBox}>
            <img 
                src={leftImage} 
                style={{...styles.logo,left: "0"}} />
            <img 
                src={rightImage}
                style={{...styles.logo,right: "0"}} />
        </Box>
    </MainView>
);

export default View;