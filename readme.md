# Despliegue

## Instalación Expo-CLI

```bash
$ npm install --global expo-cli
```

Instalar dependencias (Listado en package.json)

```bash
$ expo install
```

Checkear path de modulos globales npm en variable de entorno

```bash
export PATH=~/.npm-global/bin:$PATH
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





# Notas

Identificador de instalación (para versionado y demás)

```js
import Constants from 'expo-constants';
const id = Constants.installationId;
```



## Backlog  

### TODO
- [x] Pantalla para menu principal.  
- [x] Pantalla para menu de ayuda.  
- [x] Testear navegación entre pantallas.  
- [x] Pantalla para listado de depósitos.  
- [x] Pantalla para edición de depósitos.  
- [x] Testear creación y eliminación de depósitos.  
- [x] Pantalla para listado de categorías.  
- [x] Pantalla para detalles de categoría.  
- [x] Pantalla para listado de productos.  
- [x] Pantalla para edición de productos.  
- [x] Testear creación, edición y eliminación de productos.  
- [x] Pantalla para listado de items de un producto.  
- [x] Seleccionar depósito por defecto para nuevos items.  
- [x] Formulario de edición de items.  
- [ ] Testear inserción, edición y eliminación de items de un producto.  
- [ ] Testear inserción de items en edición de nuevo producto (sin guardar).  
- [x] Listar items agrupados por producto en detalles de depósito.  
- [x] Listar items agrupados por producto en detalles de categoría.   
- [ ] Completar acciones del menú de ayuda.  
- [ ] Métodos para exportar/importar/sincronizar db.  
- [ ] Soporte para actualización del modelo de db.  
- [ ] Herramientas para consultas especiales a la db (dashboard?).  
- [ ] Incorporar fotografía de producto/item/deposito.  
----  
- [ ] Refactoring.  
- [ ] Edición de estilos y diseño UI.  

### Fix
- [ ] Al eliminar elementos, la última tarjeta no se borra (ver qué devuelve la consulta vacía).  

