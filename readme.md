# El Galpón

El Galpón es una aplicación utilitaria para tablets, pc y smartphones que permite organizar y gestionar insumos de producción agrícola, llevar el control de stock y movimientos.

### Próximamente, disponible en [Google Play!](https://play.google.com/store/apps/details?id=com.inta.elgalpon)  

![el-galpon](images/promo.png)   


## Stories
  - [ ] Crear, editar y eliminar productos y depósitos (revisar que no tengan items asociados).  
  - [ ] Filtrar consulta de insumos, productos o depositos.  
  - [ ] Realizar movimiento de insumos con consideraciones de stock en depósitos.
  - [ ] Consultar historial de movimientos.  
  - [ ] Se debe mostrar notificaciones de productos pronto a vencerse.  

## Backlog versión 1.0.0 (alpha)  

### Modelo de datos
  - [x] Modelo de productos, insumos, depósitos y movimientos.  
  - [x] Base de datos.  
  - [ ] Creación y edición de:
    - [x] Productos.  
    - [x] Depósitos.  
    - [ ] Items (operaciones).  
  - [ ] Registro y consulta de movimientos.  
  - [ ] Consulta filtrada y paginada de:  
    - [ ] Depositos.  
    - [ ] Productos.  
    - [ ] Insumos.  
    - [ ] Movimientos.  

### Interfaz gráfica y utilidades
  - [x] Boilerplate React 18 + MUI + Capacitor.  
  - [x] Menu de utilidades.  
  - [x] Context GUI (modals, toasts, prompts).  
  - [x] Service para Database.  
  - [x] Ayuda y acerca de.  
  - [ ] Depósitos:  
    - [ ] Listado con filtro.  
    - [x] Creación y edicion.  
    - [x] Eliminacion con confirmacion.  
    - [x] Consultar insumos.  
  - [ ] Productos
    - [ ] Listado con filtro.
    - [ ] Creación y edicion.
  - [ ] Insumos. 
    - [ ] Listado con filtro.  
    - [x] Creación y edicion.  
    - [ ] Operaciones de producto:  
      - [ ] Comprar.  
      - [ ] Mover.  
      - [ ] Usar.  
      - [ ] Mover envase.  
      - [ ] Devolver envase.  
  - [ ] Movimientos.  
    - [ ] Listado con filtro.
  - [ ] Importación y exportación:  
     - [ ] Importación de ubicaciones desde mapa.  
     - [ ] Importación de planilla de depósitos.  
     - [ ] Importacion de planilla de items (genera productos).  
  - [ ] Base de datos.
    - [ ] Esquema
    - [ ] Migraciones.
    - [ ] LocalStorage a IndexedDB.
  - [ ] Notificaciones.
     

### Producción e integración  
  - [x] Compilación web -> vercel (sinc con rama main).  
  - [ ] Compilación Android ->  PlayStore.  
  - [ ] Migraciones de base de datos.  


### Refactor

  - [ ] La lógica de operaciones está implementada en la vista de formulario de compra/movimiento