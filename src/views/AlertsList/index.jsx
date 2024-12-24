import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { List } from "@mui/material";
import MainView from "../../components/MainView";
import Alert from "./alert";
import { useDatabase } from "../../context/Database";


const View = () => {
    const [alerts, setAlerts] = useState([]);
    const db = useDatabase();
    const { t } = useTranslation("alerts");
    
    const navigate = useNavigate();

    const sortedAlerts = alerts.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1);
      
    useEffect(() => {
        db.query("alerts")
            .then(setAlerts)
            .catch(console.error);
     }, []);

    const onOpen = index => {
        onRead(index, true);
        const link = "stock?id:eq:" + alerts[index].item_id;
        //console.log(link);
        navigate(link);
    };
    
    const onRead = (index, value, callback) => {
        const alert = alerts[index];
        alert.seen = value;
        db.insert("alerts", alert)
            .then(() => db.query("alerts"))
            .then(setAlerts)
            .then(() => callback && callback())
            .catch(console.error);
    };
    
    const onDelete = () => {
        const id = alerts[index].id;
        db.delete("alerts", id)
            .then(() => db.query("alerts"))
            .then(setAlerts)
            .catch(console.error);
    };

    return(
        <MainView title={t('title')}>
            <List>
                {sortedAlerts.map((alert, index) => (
                    <Alert key={index} 
                        alert={alert} 
                        onOpen={() => onOpen(index)}
                        onRead={() => onRead(index, !alert.seen)} 
                        onDelete={() => onDelete(index)} />
                ))}
            </List>            
        </MainView>
    );
};

export default View;