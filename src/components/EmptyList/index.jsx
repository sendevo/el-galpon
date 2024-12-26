import {
    Paper,
    Box,
    Typography
} from "@mui/material";
import { componentsStyles } from "../../themes";
import iconEmpty from "../../assets/icons/empty_folder.png";

const EmptyList = ({message}) => (
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
                sx={{mt: 2, p:2}}>
                <img style={{marginTop: "20px"}} src={iconEmpty} height="100px" alt="Sin datos" />
                <Typography 
                    sx={{m:3, textAlign:"center"}}
                    variant="h5" 
                    fontWeight={"bold"}>
                        {message}
                </Typography>
            </Box>
    </Box>
    
);

export default EmptyList;