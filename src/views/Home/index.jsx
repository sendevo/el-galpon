import { Link } from "react-router-dom";
import { 
    Box, 
    Button, 
    Grid,
    Typography 
} from "@mui/material";
import MainView from "../../components/MainView";
import { APP_NAME } from "../../model/constants";
import background from "../../assets/backgrounds/background1.jpg";
import logo from "../../assets/logo_el_galpon.png";
import leftImage from "../../assets/logo_inta_white.png";
import rightImage from "../../assets/logo_ministerio_white.png";


const titleStyle = {
    marginTop: "0px",
	marginBottom: "0px",
	lineHeight: "100%",
	color: "white",
	textShadow: "4px 4px 3px black",
    textTransform: "uppercase",
    fontWeight: "bold"
};

const mainIconStyle = {
    textAlign: "center", 
    mb: 0, 
    mt:2
};

const buttonsContainer = {
    marginTop:"5%"
};

const buttonStyle = {
    p: 2,
    lineHeight: "1em",
    width: "60vw",
    maxWidth: "400px",
    backgroundColor: "rgba(250,250,250,.5)",
    color: "#000000",
    fontWeight: "bold"
};

const bottomBox = {
    backgroundColor: "#2D6F94",
    width: "100vw",
    height: "65px",
    m: 0,
    left: 0,
    bottom: 0,
    position: "fixed",
    verticalAlign: "middle",
	textAlign: "left"
};

const logoStyle = {
    margin:"5px 5px 0px 5px",
    position: "absolute",
    padding: "0px", 
    height: "50px"
};

const View = () => (
    <MainView background={background}>
        <Box sx={mainIconStyle}>
            <img src={logo} height="25%" width="25%" alt="logo"/>
        </Box>
        <Box style={{textAlign: "center", marginTop:"5px"}}>
            <Typography variant="h4" sx={titleStyle}>{APP_NAME}</Typography>
        </Box>
        <Grid 
            sx={buttonsContainer}
            container 
            direction="column"
            spacing={1} 
            alignItems="center">
            <Grid item>
                <Link to="/product-list">
                    <Button variant="contained" sx={buttonStyle}>Productos</Button>
                </Link>
            </Grid>
            <Grid item>
                <Link to="/stock">
                    <Button variant="contained" sx={buttonStyle}>Insumos</Button>
                </Link>
            </Grid>
            <Grid item>
                <Link to="/stores">
                    <Button variant="contained" sx={buttonStyle}>Depósitos</Button>
                </Link>
            </Grid>
            <Grid item>
                <Link to="/operations">
                    <Button variant="contained" sx={buttonStyle}>Movimientos</Button>
                </Link>
            </Grid>
            <Grid item sx={{mt:2}}>
                <Link to="/about">
                    <Button variant="contained" sx={buttonStyle}>Información y ayuda</Button>
                </Link>
            </Grid>
        </Grid>
        <Box sx={bottomBox}>
            <img 
                src={leftImage} 
                style={{...logoStyle,left: "0"}} />
            <img 
                src={rightImage}
                style={{...logoStyle,right: "0"}} />
        </Box>
    </MainView>
);

export default View;