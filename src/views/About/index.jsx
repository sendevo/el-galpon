import { useTranslation } from 'react-i18next';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails, 
    Box,
    Typography
} from "@mui/material";
import MainView from "../../components/MainView";
import { APP_NAME, VERSION_VALUE } from "../../model/constants";
import background from "../../assets/backgrounds/background1.jpg";
import logoInta from '../../assets/logo_inta.png';
import { FaChevronDown } from "react-icons/fa";


const styles = {
    accordion: {backgroundColor: "rgba(255, 255, 255, 0.7)"},
    summary: {fontWeight: "bold"}
};


const View = () => {

    const {t} = useTranslation('about');

    return(
        <MainView background={background} title={t('title')}>
            <Box>
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
            </Box>

        </MainView>
    );
};

export default View;
