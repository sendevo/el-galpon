import { Link } from "react-router-dom";
import { Box,Grid, Typography } from "@mui/material";
import MainView from "../../components/MainView";
import background from "../../assets/backgrounds/background1.jpg";

const View = () => {
    return(
        <MainView background={background}>
            <Typography>El Galpón</Typography>
        </MainView>
    );
};

export default View;