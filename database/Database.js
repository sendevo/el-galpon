import * as SQLite from 'expo-sqlite';

class Database {
    
    constructor(name='database.db', schema={}, production=true){ 
        this.schema = schema; 
        this.production = production; // false -> verbose
        this.db = SQLite.openDatabase(name); 
        this.ready = false;
    }

    async init(){ // Crear todas las tablas si no existen
        return new Promise( (resolve, reject) => {
            
            /// TODO: control de versiones de la db ///
            
            let job = []; 
            for(let t in this.schema){
                
                const cols = [];
                for(let c in this.schema[t].columns)
                    cols.push(c + " " + this.schema[t].columns[c]);
    
                job.push(this.execute(`
                        CREATE TABLE IF NOT EXISTS ${t} (
                            id INTEGER PRIMARY KEY NOT NULL, 
                            created INTEGER,
                            modified INTEGER,
                            ${cols.join(', ')}
                        );`)
                );
            }

            let that = this;
    
            Promise.all(job)
            .then(res => {
                that.ready = true;
                return resolve(res);
            })
            .catch(e => reject(e));
        });
    }

    async execute(statement, params=[]) { // Wrapper
        return new Promise((resolve, reject) => {
            if(!this.production) console.log("Executing statement: ", statement);
            this.db.transaction((tx)=>{
                tx.executeSql(
                    statement, 
                    params, 
                    (_, result) => {resolve(result);},
                    (_, error) => {console.log("Execute error"); reject(error);}
                );
            });
        });
    }

    async insert(table, data) { // Insertar dato a tabla
        const cols = Object.keys(this.schema[table].columns); // Nombres de las columnas
        const qmarks = Array(cols.length).fill("?").join(); // Lista de signos "?" para parametros
        const statement = "INSERT INTO " + table + " (" + cols.join(",") + ") VALUES (" + qmarks + ");"

        // Estampas de tiempo
        data.created = Date.now();
        data.modified = Date.now();

        // Object.keys garantiza orden de atributos?
        let attrs = [];
        for(let c in cols)
            attrs.push(cols[c] in data ? data[cols[c]] : null)
            
        return this.execute(statement, attrs);
    }

    async deleteById(table, id){
        return this.execute("DELETE FROM " + table + " WHERE id = ?;",[id]);
    }

    async getTable(table) { // Obtener todas las filas de la tabla 
        return new Promise((resolve, reject) => {
            this.execute("SELECT * FROM "+table+";")
            .then( ({rows:{_array}}) => {resolve(_array);} )
            .catch(e => reject(e));
        });
    }

    async dropTables(){ // Borrar todas las tablas
        let job = [];
        for(let t in this.schema)
            job.push(this.execute("DROP TABLE " + t + ";"))
        
        return Promise.all(job);
    }
}

export default Database;