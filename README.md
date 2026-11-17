# PK Eventos · COIL UIDE – UFPSO – SER

Sistema web de gestión de eventos, asistentes y servicios desarrollado en el proyecto COIL entre la
Universidad Internacional del Ecuador (UIDE) y la Universidad Francisco de Paula Santander Ocaña (UFPSO).

## Tecnologías
- HTML5, CSS3 y JavaScript (sin frameworks)
- `localStorage` como almacenamiento de datos
- Font Awesome (íconos) y Google Fonts (Source Sans 3) por CDN

## Funcionalidades
- Dashboard con métricas (eventos, asistentes, servicios y presupuesto total)
- CRUD completo (Listar, Agregar, Editar, Eliminar) en Eventos, Asistentes y Servicios
- Confirmación antes de eliminar y notificaciones tipo toast
- Cambio de estado Activo/Inactivo con un clic
- Validación de formularios y diseño responsive (celular, tablet y PC)

## Estructura
```
index.html      → estructura de la página
css/styles.css  → diseño
js/app.js       → lógica (CRUD, modal, localStorage)
```

## Cómo ejecutarlo
Abrir `index.html` con Live Server en VS Code (o doble clic en el archivo).

## Cómo colaborar
1. Clonar el repositorio: `git clone https://github.com/GaBiT0o0/COIL.git`
2. Crear una rama propia: `git checkout -b nombre-integrante`
3. Hacer cambios, luego `git add .` y `git commit -m "descripción corta"`
4. Subir la rama: `git push origin nombre-integrante` y abrir un Pull Request

## Integrantes
| Nombre | Universidad | Rol |
|---|---|---|
| Gabriel Terán | UIDE | Frontend |
|  | UFPSO |  |
