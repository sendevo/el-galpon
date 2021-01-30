import React, {createContext} from 'react';
import Database from './database/Database';
import schema from './database/schema';

const db = new Database('stock_management.db', schema, false);
db.init();

export const GlobalContext = createContext();

export const GlobalProvider = props => {

    return (
        <GlobalContext.Provider value={{db}}>
            {props.children}
        </GlobalContext.Provider>
    );
}