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

const View = () => (
    <MainView background={background} title="Acerca de El Galpón">
        <Box>
            <Accordion sx={styles.accordion}>
                <AccordionSummary expandIcon={<FaChevronDown />}>
                    <Typography sx={styles.summary}>Versión de la aplicación</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <h3 style={{margin:0, textAlign:"center"}}>{APP_NAME} {VERSION_VALUE}</h3>
                    <h3 style={{margin:0}}>Staff</h3>
                    <Typography><b>Autor:</b> Juan Pablo D'Amico</Typography>
                    <Typography><b>Desarrollo:</b> Matías J. Micheletto</Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={styles.accordion}>
                <AccordionSummary expandIcon={<FaChevronDown />}>
                    <Typography sx={styles.summary}>Descripción de la app</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography style={{textAlign: "justify"}}>El Galpón es una aplicación utilitaria para tablets y smartphones que permite gestionar y controlar listas de insumos agropecuarios, depósitos de almacenamiento y movimientos.</Typography>
                    <Typography style={{textAlign: "justify"}}>Al usar la aplicación es posible definir productos, depósitos, insumos y registrar movimientos, para luego consultar insumos por depósitos, ubicaciones, stock y movimientos de cada insumo.</Typography>
                    <Typography style={{textAlign: "justify"}}>La información generada a partir del ingreso de los datos y los cálculos realizados se compila en reportes que se pueden exportar en formato de planillas o PDF.</Typography>
                    <Typography style={{textAlign: "justify"}}>Una vez instalada, la utilización de El Galpón no requiere disponibilidad de señal ni acceso a la red. Estos servicios sólo son necesarios si se desea compartir los reportes generados.</Typography>                            
                </AccordionDetails>
            </Accordion>

            <Accordion sx={styles.accordion}>
                <AccordionSummary expandIcon={<FaChevronDown />}>
                    <Typography sx={styles.summary}>Datos de contacto</Typography>
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
                    <Typography sx={styles.summary}>Fuente de información</Typography>
                </AccordionSummary>
                <AccordionDetails>          
                    <Typography style={{textAlign:"justify"}}>Las ecuaciones de cálculo de insumos fueron desarrolladas y validadas por expertos de INTA. Consulte la sección de "Términos y Condiciones" y "Responsabilidades" para obtener más información.</Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={styles.accordion}>
                <AccordionSummary expandIcon={<FaChevronDown />}>
                    <Typography sx={styles.summary}>Términos y condiciones</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography><i>Aceptación de los términos y condiciones</i></Typography>
                    <Typography style={{textAlign:"justify"}}>Al acceder o utilizar los servicios de CRIOLLO Mochilas, el usuario acepta los términos y condiciones establecidos a continuación.</Typography>
                    <Typography style={{textAlign:"justify"}}>Los textos, las imágenes y demás información que aparece en este sitio y su disposición,
                    pertenecen al Instituto Nacional de Tecnología Agropecuaria (INTA), salvo que se indique lo
                    contrario. La Estación Experimental Agropecuaria Hilario Ascasubi (CERBAS - INTA) autoriza a los
                    usuarios a realizar copias, impresiones y distribuir la información contenida en este sitio, sujeta a
                    las siguientes condiciones:</Typography>
                    <ul style={{listStyle: "inside", paddingLeft: "10px", textAlign: "justify"}}>
                        <li>El uso, impresión, y reproducción de la información disponible en este sitio deberá estar
                        sujeta a fines personales, no comerciales, salvo expresa autorización de la Estación
                        Experimental Agropecuaria Hilario Ascasubi (CERBAS - INTA). La modificación de dicha
                        información no está permitida, y es obligatorio para el usuario citar la fuente original en
                        todas las copias que efectúe.</li>
                        <li>Salvo expresa autorización de la Estación Experimental Agropecuaria Hilario Ascasubi
                        (CERBAS - INTA), el emblema y/o el logo del INTA no deberán ser removidos de ninguna
                        página o elemento gráfico propio en que figuren, ni podrán ser utilizados en páginas o
                        elementos gráficos ajenos. De igual manera, no deberán ser modificados, sin autorización,
                        ninguno de esos elementos.</li>
                        <li>No se deberán establecer enlaces cuyo resultado sea la exhibición de una página o imagen
                        de este sitio a menos de contar con la autorización correspondientes.</li>
                    </ul>
                    <Typography><i>Cambios en los términos y condiciones</i></Typography>
                    <Typography style={{textAlign:"justify"}}>La Estación Experimental Agropecuaria Hilario Ascasubi (CERBAS - INTA) se 
                        reserva los derechos de cambiar o suspender la totalidad o parte de los servicios prestados en cualquier 
                        momento, previa notificación. Si luego de notificados los cambios en los términos y condiciones, el usuario 
                        continúa utilizando dichos servicios, significa que acepta y está de acuerdo en los términos y condiciones modificados.</Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={styles.accordion}>
                <AccordionSummary expandIcon={<FaChevronDown />}>
                    <Typography sx={styles.summary}>Responsabilidades</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography style={{textAlign:"justify"}}>La Estación Experimental Agropecuaria Hilario Ascasubi (CERBAS - INTA) no será responsable de los
                        perjuicios que pudieran ocasionar el uso, o la imposibilidad de uso, de la información disponible en
                        este sitio. La Estación Experimental Agropecuaria Hilario Ascasubi (CERBAS - INTA) no será
                        responsable de ninguna decisión que el usuario tome luego de la ejecución de las utilidades de la
                        aplicación. Las opiniones, análisis y/o información contenidas en el sitio, son provistas a los
                        usuarios con el único fin de colaborar con los mismos a tomar sus propias decisiones y no pueden
                        ser consideradas como única información necesaria. De este modo, el usuario de dicha
                        información, entiende y acepta que, las decisiones que el mismo pudiere adoptar o dejar de
                        adoptar corren enteramente bajo su propio juicio y riesgo. La Estación Experimental Agropecuaria
                        Hilario Ascasubi (CERBAS - INTA) no efectúa ninguna aseveración o garantía en relación al
                        contenido del sitio, incluyendo permisos de comercialización, o garantía alguna sobre la exactitud,
                        adecuación o integridad de la información y los materiales, y no será responsable por errores u
                        omisiones en los mismos. Es responsabilidad del usuario verificar cualquier información detallada
                        en este sitio. Los enlaces hacia otras organizaciones que se hallen contenidos en estas páginas,
                        cumplen una función meramente informativa y La Estación Experimental Agropecuaria Hilario
                        Ascasubi (CERBAS - INTA) no asume, por consiguiente, responsabilidad alguna en cuanto a su
                        validez o contenido. La Estación Experimental Agropecuaria Hilario Ascasubi (CERBAS - INTA) no
                        asume responsabilidad alguna, con relación a los daños que pudieren sufrir los usuarios debido al
                        uso maligno o intrusivo de este servidor, especialmente en cuanto se refiere a la alteración,
                        agregado o falsificación de la información contenida en el mismo, o a la introducción de virus,
                        troyanos, etc., así como de un contenido gráfico ofensivo o ilegal. La Estación Experimental
                        Agropecuaria Hilario Ascasubi (CERBAS - INTA) no recaba, ni almacena ningún dato sensible de sus
                        usuarios y sólo accede a la información y configuración del dispositivo autorizados y/o habilitado
                        por el usuario.</Typography>
                </AccordionDetails>
            </Accordion>
        </Box>
    </MainView>
);

export default View;
