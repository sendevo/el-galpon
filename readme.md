# El Galpón

El Galpón es una aplicación utilitaria para tablets, pc y smartphones que permite organizar y gestionar insumos de producción agrícola, llevar el control de stock y movimientos.

### Próximamente, disponible en [Google Play!](https://play.google.com/store/apps/details?id=com.inta.elgalpon)  

![el-galpon](images/promo.png)   


## Stories
  - [x] Crear, editar y eliminar productos y depósitos.  
  - [ ] Registrar movimiento (compra, venta, uso, devolución) de productos entre depósitos.  
  - [ ] Consultar historial de movimientos.  
  - [ ] Cuando se registra un movimiento, se actualiza el stock de insumos.  
  - [ ] Consultar insumos de cada producto, listado por producto o por depósito.  
  - [ ] Se debe mostrar notificaciones de productos pronto a vencerse.  

## Backlog versión 1.0.0 (alpha)  

### Modelo de datos
  - [x] Modelo de productos, insumos, depósitos y movimientos.  
  - [x] Base de datos con IndexedDB.  
  - [ ] Creación y edición de:
    - [x] Productos.  
    - [x] Depósitos.  
    - [ ] Items.  
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
    - [ ] Eliminacion con confirmacion.  
    - [ ] Consultar insumos.  
  - [ ] Productos. 
    - [ ] Listado con filtro.  
    - [x] Creación y edicion.  
    - [ ] Eliminacion con confirmacion.  
    - [ ] Consultar insumos.  
  - [ ] Insumos:  
    - [ ] Listado con filtro.  
  - [ ] Movimientos.  
  - [ ] Importación y exportación:  
     - [ ] Importación de ubicaciones desde mapa.  
     - [ ] Importación de planilla de depósitos.  
     - [ ] Importacion de planilla de items (genera productos).  
     

### Producción e integración  
  - [x] Compilación web -> vercel (sinc con rama main).  
  - [ ] Compilación Android ->  PlayStore.  
  - [ ] Migraciones de base de datos.  