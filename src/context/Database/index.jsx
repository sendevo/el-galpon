import { 
    createContext, 
    useEffect, 
    useContext, 
    useState 
} from "react";
import { Box } from "@mui/material";
import LocalDatabase, { DB_TEST_MODE } from "../../model/DB";
import Preloader from "../../components/Preloader";
import useConfirm from "../../hooks/useConfirm";
import background from "../../assets/backgrounds/background1.jpg";


export const DatabaseContext = createContext();
export const useDatabase = () => useContext(DatabaseContext);

const preloaderStyle = {
    backgroundColor: "transparent",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover!important",
    filter: "blur(2px)",
    height: "100%",
    width: "100%",
    t: 0,
    l: 0,
    position: "fixed",
    zIndex: -1,
    background: `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.1)), url(${background})`
};

const DatabaseProvider = ({children}) => {

    const [database, setDatabase] = useState(null);
    const [loading, setLoading] = useState(true);

    const confirm = useConfirm();

    useEffect(() => {
        const db = new LocalDatabase();
        db.init()
            .then(() => {
                if (DB_TEST_MODE) {    
                    confirm(
                        "Versión de prueba",
                        "Está ejecutando una versión demostrativa, los datos son de prueba y se restablecerán al recargar la aplicación",
                        () => {
                            db.loadTestData()
                                .then(() => {
                                    setDatabase(db);
                                    setLoading(false);
                                })
                                .catch(console.error);
                        },
                        () => {},
                        "Aceptar",
                        "" 
                    );
                }else{
                    setDatabase(db);
                    setLoading(false);
                }
            })
            .catch(console.error);
    }, []);
        
    return (
        loading ? 
            <Box sx={preloaderStyle}>
                    <Preloader /> 
            </Box>
            :
            database && 
            <DatabaseContext.Provider value={database}>
                {children}
            </DatabaseContext.Provider>
    );
};

export default DatabaseProvider;