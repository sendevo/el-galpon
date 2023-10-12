import { Typography } from "@mui/material";
import MainView from "../../components/MainView";
import background from "../../assets/backgrounds/background1.jpg";

const View = () => {
    return(
        <MainView title={"Productos"} background={background}>
            <Typography>Productos</Typography>
        </MainView>
    );
};

export default View;