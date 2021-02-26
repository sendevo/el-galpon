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

Almacenamiento persistente para metadatos

```js
import AsyncStorage from '@react-native-community/async-storage';
```


## Backlog
[x] Pantalla para menu principal.  
[x] Pantalla para menu de ayuda.  
[x] Testear navegación entre pantallas.  
[x] Pantalla para listado de depósitos.  
[x] Pantalla para edición de depósitos.  
[x] Testear creación y eliminación de depósitos.  
[x] Pantalla para listado de categorías.  
[z] Pantalla para detalles de categoría.  
[x] Pantalla para listado de productos.  
[x] Pantalla para edición de productos.  
[x] Testear creación, edición y eliminación de productos.  
[x] Pantalla para listado de items de un producto.  
[ ] Pantalla para editar item de un producto.  
[ ] Testear inserción, edición y eliminación de items de un producto.  
[ ] Testear inserción de items en edición de nuevo producto (sin guardar).  
[ ] Listar items agrupados por producto en detalles de depósito.  
[ ] Listar items agrupados por producto en detalles de categoría.   
[ ] Herramientas para consultas especiales a la db.  
[ ] Completar acciones del menú de ayuda.  
[ ] Soporte para actualización del modelo de db.  
[ ] Métodos para exportar/importar/sincronizar db.  
---
[ ] Refactoring.  
[ ] Edición de estilos y diseño UI.  

