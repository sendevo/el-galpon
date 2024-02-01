import {
    Paper,
    Box,
    Typography
} from "@mui/material";
import { componentsStyles } from "../../themes";

const EmptyListSection = ({message, icon}) => (
    <Box
        component={Paper} 
        sx={{
            ...componentsStyles.paper,
            mt: 2,
            height:"40vh",
            display:"flex",
            justifyContent:"center",
            alignItems:"center"
        }}>
            <Box 
                display={"flex"} 
                flexDirection={"column"} 
                alignItems={"center"}
                sx={{mt: 2}}>
                <img src={icon} height="100px" alt="Sin datos" />
                <Typography variant="h5" fontWeight={"bold"}>{message}</Typography>
            
            </Box>
        
    </Box>
    
);

export default EmptyListSection;