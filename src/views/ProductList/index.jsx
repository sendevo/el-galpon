import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { useDatabase } from "../../context/Database";
import MainView from "../../components/MainView";
import background from "../../assets/backgrounds/background1.jpg";


const View = () => {

    const navigate = useNavigate();
    const db = useDatabase();   
    
    useEffect(() => {
        db.getAllItems('products')
            .then(console.table)
            .catch(console.error);
    }, []);

    return(
        <MainView title={"Productos"} background={background}>
            <Typography>Productos</Typography>
            <Button 
                variant="contained"
                onClick={()=>navigate("/product-form")}>
                    Agregar
                </Button>
        </MainView>
    );
};

export default View;