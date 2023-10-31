import { useEffect } from "react";
import { Button, Typography } from "@mui/material";
import { useDatabase } from "../../context/Database";
import MainView from "../../components/MainView";
import background from "../../assets/backgrounds/background1.jpg";

const View = () => {

    const db = useDatabase();   
    
    useEffect(() => {
        db.getAllItems('products')
        .then(console.table)
        .catch(console.error);
    }, []);

    const handleCreate = () => {
        const data = {
            product_id: 1,
            name: "2,4 D",
            category: "herbicidas",
            extra: {}
        };
        db.addItem(data,'products')
        .then(()=>console.log("Data pushed to db"))
        .catch(console.error);
    };

    return(
        <MainView title={"Productos"} background={background}>
            <Typography>Productos</Typography>
            <Button variant="contained" onClick={handleCreate}>Crear nuevo</Button>
        </MainView>
    );
};

export default View;