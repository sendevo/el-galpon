import { createContext, useContext } from "react";
import LocalDatabase from "../../model/DB";

export const DatabaseContext = createContext();
export const useDatabase = () => useContext(DatabaseContext);

const DatabaseProvider = ({children}) => {
    const database = new LocalDatabase();
    
    return (
        <DatabaseContext.Provider value={database}>
            {children}
        </DatabaseContext.Provider>
    );
};

export default DatabaseProvider;