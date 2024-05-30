import { createContext, useEffect, useContext, useState } from "react";
//import LocalDatabase from "../../model/DB";
import LocalDatabase from "../../model/DB";
import Preloader from "../../components/Preloader";

export const DatabaseContext = createContext();
export const useDatabase = () => useContext(DatabaseContext);

const DatabaseProvider = ({children}) => {

    const [database, setDatabase] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const onDBReady = db => {
            setDatabase(db);
            setLoading(false);
        };
        new LocalDatabase(onDBReady);
    }, []);
        
    return (
        loading ? <Preloader /> :
            <DatabaseContext.Provider value={database}>
                {children}
            </DatabaseContext.Provider>
    );
};

export default DatabaseProvider;