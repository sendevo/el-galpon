import { Link } from "react-router-dom";
import { 
    Box, 
    Button, 
    Grid,
    Typography 
} from "@mui/material";
import MainView from "../../components/MainView";
import views from "../index";
import { APP_NAME } from "../../model/constants";
import background from "../../assets/backgrounds/background1.jpg";
import logo from "../../assets/logo_el_galpon.png";
import leftImage from "../../assets/logo_inta_white.png";
import rightImage from "../../assets/logo_ministerio_white.png";


const styles = {
    title: {
        marginTop: "0px",
        marginBottom: "0px",
        lineHeight: "100%",
        color: "white",
        textShadow: "4px 4px 3px black",
        textTransform: "uppercase",
        fontWeight: "bold"
    },
    logo: {
        margin:"5px 5px 0px 5px",
        position: "absolute",
        padding: "0px", 
        height: "50px"
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
        width: "60vw",
        maxWidth: "400px",
        backgroundColor: "rgba(250,250,250,.75)",
        color: "#000000",
        fontWeight: "bold"
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

const View = () => (
    <MainView background={background}>
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
                                    {p.homeTitle}
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
);

export default View;