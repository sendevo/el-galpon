# El Galpón

El Galpón es una aplicación utilitaria para tablets, pc y smartphones que permite organizar y gestionar insumos de producción agrícola, llevar el control de stock y movimientos.

### Próximamente, disponible en [Google Play!](https://play.google.com/store/apps/details?id=com.inta.elgalpon)  

![el-galpon](images/promo.png)   


## Stories
  - [ ] Crear, editar y eliminar productos y depósitos.  
  - [ ] Registrar movimiento (compra, venta, uso, devolución) de productos entre depósitos.  
  - [ ] Consultar historial de movimientos.  
  - [ ] Cuando se registra un movimiento, se actualiza el stock de insumos.  
  - [ ] Consultar insumos de cada producto, listado por producto o por depósito.  
  - [ ] Se debe mostrar notificaciones de productos pronto a vencerse.  

## Backlog versión 1.0.0 (alpha)  

### Modelo de datos
  - [ ] Modelo de productos, insumos, depósitos e insumos.  
  - [x] Modelo de categorías.  
  - [x] Base de datos con IndexedDB.  
  - [ ] Creación y edición de:
    - [x] Productos.  
    - [x] Depósitos.  
    - [ ] Movimientos.  
  - [ ] Registro automático de insumos.  
  - [ ] Consulta de:  
    - [ ] Insumos de un producto.  
    - [ ] Insumos en un depósito.  
    - [ ] Movimientos de un producto.  

### Interfaz gráfica y utilidades
  - [x] Boilerplate React 18 + MUI + Capacitor.  
  - [x] Menu de utilidades.  
  - [x] Context GUI (modals, toasts, prompts).  
  - [x] Service para Database.  
  - [x] Ayuda y acerca de.  
  - [ ] Listado de:  
    - [x] Depósitos.  
    - [x] Productos.  
    - [ ] Insumos.  
    - [ ] Movimientos.  
  - [ ] Formularios para edición de:  
    - [x] Depósitos.  
    - [x] Productos.  
    - [ ] Movimientos.  
  - [ ] Exportación de consultas a XLS.  
  - [ ] Exportación de consultas a PDF.  

### Producción e integración  
  - [x] Compilación web -> vercel (sinc con rama main).  
  - [ ] Compilación Android ->  PlayStore.  
  - [ ] Migraciones de base de datos.  