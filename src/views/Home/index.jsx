import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
    Box, 
    Button, 
    Grid,
    Typography 
} from "@mui/material";
import MainView from "../../components/MainView";
import views from "../index";
import { APP_NAME } from "../../model/constants";
import { useDatabase } from "../../context/Database";
import background from "../../assets/backgrounds/background1.jpg";
import logo from "../../assets/logo_el_galpon.png";
import leftImage from "../../assets/logo_inta_white.png";
import rightImage from "../../assets/logo_ministerio_white.png";
import NotificationIcon from "../../components/NotificationIcon";

/*
import argFlag from "../../assets/icons/argentina_flag.png";
import engFlag from "../../assets/icons/uk_flag.png";
*/


const styles = {
    title: {
        marginTop: "0px",
        marginBottom: "0px",
        lineHeight: "100%",
        color: "white",
        textShadow: "1px 1px 1px black",
        textTransform: "uppercase",
        fontWeight: "bold"
    },
    logo: {
        margin:"5px 5px 0px 5px",
        position: "absolute",
        padding: "0px", 
        height: "50px"
    },
    notificationIcon: {
        margin:"5px 5px 0px 5px",
        position: "absolute",
        padding: "0px", 
        height: "40px",
        right: "12px",
        top: "12px"
    },
    mainIcon: {
        textAlign: "center", 
        mb: 0, 
        mt:2
    },
    buttonsContainer: {marginTop:"5%"},
    button: {
        p: 2,
        lineHeight: "1em",
        width: "75vw",
        maxWidth: "400px",
        height: "60px",
        backgroundColor: "rgba(250,250,250,.75)",
        textTransform: "none"
    },
    buttonIcon: {
        position: "absolute",
        left: "15px",
        width: "30px",
        height: "30px"
    },
    buttonText: {
        left: "60px",
        maxWidth: "calc(100% - 60px)",
        textAlign: "center",
        color: "#000000",
        fontWeight: "bold",
        lineHeight: "1em",
        //textTransform: "uppercase"
    },
    bottomBox: {
        backgroundColor: "#2D6F94",
        width: "100vw",
        height: "65px",
        m: 0,
        left: 0,
        bottom: 0,
        position: "fixed",
        verticalAlign: "middle",
        textAlign: "left"
    }
};


const View = () => {
    
    const [notifications, setNotifications] = useState(0);

    const db = useDatabase();
    const { t } = useTranslation('home');

    useEffect(() => {
        db.query("alerts")
            .then(alerts => {
                const alertCount = alerts.filter(a => a.seen === false).length;
                setNotifications(alertCount);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    return (
        <MainView background={background}>

            <Link to="/alerts" style={styles.notificationIcon}>
                <NotificationIcon unreadCount={notifications} />
            </Link>

            <Box sx={styles.mainIcon}>
                <img src={logo} height="25%" width="25%" alt="logo"/>
            </Box>
            <Box style={{textAlign: "center", marginTop:"5px"}}>
                <Typography variant="h4" sx={styles.title}>{APP_NAME}</Typography>
            </Box>
            <Grid 
                sx={styles.buttonsContainer}
                container 
                direction="column"
                spacing={1} 
                alignItems="center">
                    {
                        views
                            .filter(p => Boolean(p.homeTitle))
                            .map((p,k) => (
                                <Grid item key={k}>
                                    <Button
                                        component={Link} 
                                        to={p.path}
                                        variant="contained" 
                                        sx={styles.button}>
                                        <img src={p.icon} style={styles.buttonIcon} />
                                        <Typography style={styles.buttonText}>
                                            {t(p.homeTitle)}
                                        </Typography>
                                    </Button>
                                </Grid>            
                            ))
                    }
            </Grid>
            <Box sx={styles.bottomBox}>
                <img 
                    src={leftImage} 
                    style={{...styles.logo,left: "0"}} />
                <img 
                    src={rightImage}
                    style={{...styles.logo,right: "0"}} />
            </Box>
        </MainView>
    )
};

export default View;