import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
    ListItem,
    ListItemText,
    ListItemAvatar, 
    Typography,
    Paper,
    Grid
} from "@mui/material";
import moment from "moment";
import ContextMenu from "../../components/ContextMenu";
import { 
    FaBell, 
    FaEllipsisV,
    FaEye,
    FaEyeSlash,
    FaTrash 
} from "react-icons/fa";


const listItemStyle = {
    borderRadius: "5px", 
    marginBottom: "5px"
};

const titleContainerStyle = { 
    display: "flex", 
    alignItems: "center" 
};


const titleStyle = {
    fontWeight:"bold",
    fontSize: "18px",
    lineHeight: "1"
}

const dateContainerStyle = { 
    display: "flex", 
    alignItems: "center" 
}

const dateStyle = {
    fontSize: "12px",
    whiteSpace: "nowrap",
    lineHeight: "1",
    ml: "auto"
}

const Alert = ({alert, onOpen, onRead, onDelete}) => {
    
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);

    const { t } = useTranslation("alerts");

    return(
        <ListItem 
            alignItems="flex-start"
            sx={{...listItemStyle, backgroundColor: alert.seen ? "#EEE" : "#F6CECE"}}
            components={Paper}
            key={alert.id}>
            <ListItemAvatar>
                <FaBell size={25} />
            </ListItemAvatar>
            <ListItemText 
                sx={{p:0, m:0}}
                onClick={onOpen}
                primary={
                    <Grid container spacing={1}>
                        <Grid item xs={10}>
                            <Grid container alignItems={"center"} spacing={2} justifyContent="space-between">
                                <Grid 
                                    item
                                    sx={titleContainerStyle}>
                                    <Typography sx={titleStyle}>
                                        {t(alert.type)}
                                    </Typography>
                                </Grid>
                                <Grid 
                                    item 
                                    sx={dateContainerStyle}>
                                    <Typography style={dateStyle}>
                                        {moment(alert.timestamp).fromNow()}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={2} justifyContent="flex-end" display="flex">
                            <FaEllipsisV onClick={e => {
                                setMenuAnchorEl(e.currentTarget);
                                e.stopPropagation();
                            }}/>
                        </Grid>
                    </Grid>
                } 
                secondary={alert.message}/>
            <ContextMenu
                anchorEl={menuAnchorEl} 
                onClose={()=>setMenuAnchorEl(null)}
                options={
                    [
                        {
                            text: (alert.seen ? "Marcar como no leido" : "Marcar como leido"),
                            icon: (alert.seen ? <FaEyeSlash size={15} /> : <FaEye size={15} />),
                            onClick: onRead
                        },
                        {
                            text: "Eliminar",
                            icon: <FaTrash size={15} />,
                            onClick: onDelete
                        }
                    ]
                } />
        </ListItem> 
    );
};

export default Alert;