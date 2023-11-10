import { Typography } from "@mui/material";
import MainView from "../../components/MainView";
import image from "../../assets/working_monkey.jpg";

const View = () => {
    return(
        <MainView title={"Insumos por depósito"}>
            <Typography 
                sx={{mb:2}}
                textAlign={"center"}
                fontStyle={"italic"}
                fontSize={"20px"}
                color={"rgb(100,100,100)"}>
                    Esta sección se encuentra en desarrollo...
            </Typography>
            <img src={image} style={{
                width: "100%",
                top: "50%",
                borderRadius: "10%"
            }}/>
        </MainView>
    );
};

export default View;