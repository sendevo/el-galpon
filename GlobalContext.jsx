import React, {createContext} from 'react';
import Database from './database/Database'; // Acoplamiento debil con el resto del sistema
import schema from './database/schema'; // Acoplamiento fuerte con el resto del sistema

const db = new Database('stock_management.db', schema);
db.init();

export const GlobalContext = createContext();

export const GlobalProvider = props => {
    return (
        <GlobalContext.Provider value={{db}}>
            {props.children}
        </GlobalContext.Provider>
    );
}