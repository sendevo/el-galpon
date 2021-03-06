import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Database {
    
    constructor(name='database.db', schema={}) { 
        this.schema = schema; 
        this.db = SQLite.openDatabase(name); 
        this.ready = false;
        this.config = {}
    }

    async init() { // Crear todas las tablas si no existen
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
    
            // Cargar config y ejecutar promesa
            let that = this;
            AsyncStorage.getItem('@app_config')
            .then(value=>{
                that.config = value != null ? JSON.parse(value) : {};
                Promise.all(job)
                .then(res => {
                    that.ready = true;
                    return resolve(res);
                })
                .catch(e => reject(e));
            })
            .catch(e => reject(e));
        });
    }

    async setConfig(key, value) { // Guardar objeto de configuracion
        const prev = this.config[key];
        this.config[key] = value;
        try{
            await AsyncStorage.setItem('@app_config', JSON.stringify(this.config));
        } catch(e) {
            console.log(e);
            this.config[key] = prev; // En caso de error se restaura
        }
    }
    
    async execute(statement, params=[]) { // Wrapper
        return new Promise((resolve, reject) => {
            console.log("Executing statement: ", statement, " with params: ", params);
            this.db.transaction((tx)=>{
                tx.executeSql(
                    statement, 
                    params, 
                    (_, result) => {console.log("Execute success"); resolve(result);},
                    (_, error) => {console.log("Execute error"); reject(error);}
                );
            });
        });
    }

    /// ESCRITURA

    async insert(table, data) { // Insertar dato a tabla
        const cols = Object.keys(this.schema[table].columns); // Nombres de las columnas
        // Estampas de tiempo
        data.created = Date.now();
        data.modified = Date.now();
        cols.push("created", "modified");
        
        const qmarks = Array(cols.length).fill("?").join(); // Lista de signos "?" para parametros
        const statement = "INSERT INTO " + table + " (" + cols.join(",") + ") VALUES (" + qmarks + ");"

        // Object.keys garantiza orden de atributos?
        let values = [];
        for(let c in cols)
            values.push(cols[c] in data ? data[cols[c]] : null);

        return this.execute(statement, values);
    }

    async update(table, id, data) { // Actualizar columnas
        const cols = Object.keys(this.schema[table].columns);
        
        // Generar lista de pares columna=valor separados por coma
        let values = []
        for(let v in data){
            if(cols.includes(v)){
                let val = data[v];
                if(typeof val == "string")
                    val = "'"+val+"'";
                values.push(v + " = " + val);
            }else{
                console.log("Error de variable: "+v);
            }
        }

        // Agregar estampa de tiempo de modificacion del campo
        values.push("modified = "+Date.now());

        // Generar comando SQL
        const statement = "UPDATE " + table + " SET " + values.join(',') + " WHERE id = ?";
        return this.execute(statement, [id]);
    }

    // ELIMINACION

    async deleteById(table, id) {
        return this.execute("DELETE FROM " + table + " WHERE id = ?;",[id]);
    }

    async dropTables() { // Borrar todas las tablas
        let job = [];
        for(let t in this.schema)
            job.push(this.execute("DROP TABLE " + t + ";"))
        
        return Promise.all(job);
    }

    // CONSULTA

    async getTable(table) { // Obtener todas las filas de la tabla 
        return new Promise((resolve, reject) => {
            this.execute("SELECT * FROM "+table+";")
            .then( ({rows:{_array}}) => {resolve(_array);} )
            .catch(e => reject(e));
        });
    }

}

export default Database;