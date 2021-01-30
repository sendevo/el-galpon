# Despliegue

## Instalación Expo-CLI
```bash
$ npm install --global expo-cli
```

## Instalar dependencias

Si las versiones de package.json son correctas:

```bash
$ expo install
```

Dependencias:

```bash
@react-navigation/native 
@react-navigation/stack 
@react-native-community/masked-view 
react-native-gesture-handler 
react-native-reanimated 
react-native-screens 
expo-sqlite
```

## Iniciar app
```bash
$ expo start
```

## Iniciar emulador android (Linux)
```bash
cd ~/Android/Sdk/emulator
./emulator -avd Pixel_3a_API_30_x86
```


### Agregar path de modulos globales npm a variable de entorno (Linux)
```bash
export PATH=~/.npm-global/bin:$PATH
```




# Notas

Identificador de instalación (para versionado y demás)

```js
import Constants from 'expo-constants';
const id = Constants.installationId;
```

Uso de la DB (SQLite)

```js
import Database from './database/Database';
import schema from './database/schema';

// Crear tabla
const db = new Database('stock_management.db', schema, false);

db.init()
.then(()=>{

  // Lo que sigue se puede hacer solo si la db esta inicializada correctamente

  // Cargar datos
  db.insert("storage", {name:"Galpón", lat:37.2912, long:63.510})
  .then(() => console.log("Exito"))
  .catch(() => console.log("Error"));

  db.insert("products", {name:"Glifosato", description:"", quantity:20})
  .then(() => console.log("Exito"))
  .catch(() => console.log("Error"));

  // Consultar datos
  db.getTable("storage")
  .then(res => console.log(res))
  .catch(e => console.log(e));

  db.getTable("products")
  .then(res => console.log(res)) 
  .catch((e) => console.log(e));


  // Borrar todo
  db.dropTables()
  .then(()=>console.log("Tablas eliminadas."))
  .catch(()=>console.log("Error en eliminación de tablas."));

})
.catch(()=>console.log("Error inicializacion db."));

```
