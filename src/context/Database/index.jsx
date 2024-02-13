import { createContext, useContext } from "react";
//import LocalDatabase from "../../model/DB";
import LocalDatabase from "../../model/DB/test"; // Testing database (volatile)
import { debug } from "../../model/utils";

export const DatabaseContext = createContext();
export const useDatabase = () => useContext(DatabaseContext);

const DatabaseProvider = ({children}) => {
    const database = new LocalDatabase();

    debug("Using database type = "+database.type);
    
    return (
        <DatabaseContext.Provider value={database}>
            {children}
        </DatabaseContext.Provider>
    );
};

export default DatabaseProvider;