import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails, 
    Grid,
    Typography,
    Paper
} from "@mui/material";
import { useDatabase } from "../../context/Database";
import MainView from "../../components/MainView";
import Select from '../../components/Inputs/Select';
import { APP_NAME, VERSION_VALUE } from "../../model/constants";
import background from "../../assets/backgrounds/background1.jpg";
import logoInta from '../../assets/logo_inta.png';
import { FaChevronDown } from "react-icons/fa";


const styles = {
    accordion: {backgroundColor: "rgba(255, 255, 255, 0.7)"},
    summary: {fontWeight: "bold"},
    languageBlock: {
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        p:1
    },
    languageInput:{
        mt: 1
    }
};

const languages = [
    {value: "es", label: "Español"},
    {value: "en", label: "English"}
];

const View = () => {
    const db = useDatabase();

    const {t} = useTranslation('about');

    const onLocaleChange = (locale) => {
        db.updateLocale(locale);
    }

    return(
        <MainView background={background} title={t('title')}>
            <Grid container direction="column" spacing={2}>
                <Grid item>
                    <Accordion sx={styles.accordion}>
                        <AccordionSummary expandIcon={<FaChevronDown />}>
                            <Typography sx={styles.summary}>{t('version')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <h3 style={{margin:0, textAlign:"center"}}>{APP_NAME} {VERSION_VALUE}</h3>
                            <h3 style={{margin:0}}>Staff</h3>
                            <Typography><b>{t('author')}:</b> Juan Pablo D'Amico</Typography>
                            <Typography><b>{t('developer')}:</b> <a href="https://sendevosoftware.com.ar" target="_blank" rel="noopener noreferrer">Sendevo Software</a></Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion sx={styles.accordion}>
                        <AccordionSummary expandIcon={<FaChevronDown />}>
                            <Typography sx={styles.summary}>{t('description')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography style={{textAlign: "justify"}}>{t('descriptionP1')}</Typography>
                            <Typography style={{textAlign: "justify"}}>{t('descriptionP2')}</Typography>
                            <Typography style={{textAlign: "justify"}}>{t('descriptionP3')}</Typography>
                            <Typography style={{textAlign: "justify"}}>{t('descriptionP4')}</Typography>                            
                        </AccordionDetails>
                    </Accordion>

                    <Accordion sx={styles.accordion}>
                        <AccordionSummary expandIcon={<FaChevronDown />}>
                            <Typography sx={styles.summary}>{t('contact')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography sx={{mt:1, mb:1}}>
                                <img src={logoInta} width="25px" style={{verticalAlign:"middle"}} alt="logo INTA"/> INTA <a href="inta.gob.ar">inta.gob.ar</a>
                            </Typography>
                            <Typography sx={{mt:1, mb:1}}>
                                <img src={logoInta} width="25px" style={{verticalAlign:"middle"}} alt="logo INTA"/> E.E.A. Hilario Ascasubi <a href="inta.gob.ar/ascasubi">inta.gob.ar/ascasubi</a>
                            </Typography>
                            <Typography sx={{mt:1, mb:1}}>
                                E-mail: <a href="mailto:eeaascasubi.criollo@inta.gob.ar">eeaascasubi.criollo@inta.gob.ar</a>
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion sx={styles.accordion}>
                        <AccordionSummary expandIcon={<FaChevronDown />}>
                            <Typography sx={styles.summary}>{t('sources')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>          
                            <Typography style={{textAlign:"justify"}}>{t('sourcesText')}</Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion sx={styles.accordion}>
                        <AccordionSummary expandIcon={<FaChevronDown />}>
                            <Typography sx={styles.summary}>{t('terms')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography><i>{t('termsAccept')}</i></Typography>
                            <Typography style={{textAlign:"justify"}}>{t('termsP1')}</Typography>
                            <Typography style={{textAlign:"justify"}}>{t('termsP2')}</Typography>
                            <ul style={{listStyle: "inside", paddingLeft: "10px", textAlign: "justify"}}>
                                <li>{t('termsIt1')}</li>
                                <li>{t('termsIt2')}</li>
                                <li>{t('termsIt3')}</li>
                            </ul>
                            <Typography><i>{t('termsChanges')}</i></Typography>
                            <Typography style={{textAlign:"justify"}}>{t('termsChangesP1')}</Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion sx={styles.accordion}>
                        <AccordionSummary expandIcon={<FaChevronDown />}>
                            <Typography sx={styles.summary}>{t('responsibilities')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography style={{textAlign:"justify"}}>{t('responsibilitiesP1')}</Typography>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item>
                    <Paper sx={styles.languageBlock}>
                        <Grid 
                            container 
                            spacing={1} 
                            direction={"row"}
                            sx={styles.languageInput}>
                            <Grid item xs={4}>
                                <Typography sx={{fontWeight:"bold"}}>{t('language')+":"}</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Select
                                    value={i18next.language}
                                    onChange={e => onLocaleChange(e.target.value)}
                                    options = {languages} />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </MainView>
    );
};

export default View;
