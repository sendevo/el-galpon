import { Link } from "react-router-dom";
import { Button, Grid } from "@mui/material";
import MainView from "../../components/MainView";
import background from "../../assets/backgrounds/background1.jpg";

const buttonStyle = {
    width: "50vw",
    maxWidth: "400px",
    backgroundColor: "rgba(250,250,250,.5)",
    color: "#000000",
    fontWeight: "bold"
};

const View = () => (
    <MainView background={background}>
        <Grid 
            sx={{mt:10}}
            container 
            direction="column"
            spacing={1} 
            alignItems="center">
            <Grid item>
                <Link to="/products">
                    <Button variant="contained" sx={buttonStyle}>Productos</Button>
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
            <Grid item>
                <Link to="/about">
                    <Button variant="contained" sx={buttonStyle}>Información y ayuda</Button>
                </Link>
            </Grid>
        </Grid>
        
    </MainView>
);

export default View;