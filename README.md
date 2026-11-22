# PK Eventos · COIL UIDE – UFPSO – ISER

Sistema web de gestión de eventos, asistentes y servicios desarrollado en el proyecto COIL entre la
Universidad Internacional del Ecuador (UIDE), la Universidad Francisco de Paula Santander Ocaña (UFPSO)
y el Instituto Superior de Educación Rural (ISER).

## Tecnologías
- HTML5, CSS3 y JavaScript (sin frameworks)
- `localStorage` como almacenamiento de datos
- Font Awesome (íconos) y Google Fonts (Source Sans 3) por CDN

## Funcionalidades
- Inicio de sesión, registro y recuperación de contraseña de demostración
- Dashboard con métricas (eventos, asistentes, servicios y presupuesto total)
- CRUD completo (Listar, Agregar, Editar, Eliminar) en Eventos, Asistentes y Servicios
- Confirmación antes de eliminar y notificaciones tipo toast
- Cambio de estado Activo/Inactivo con un clic
- Validación de formularios y diseño responsive (celular, tablet y PC)

> La autenticación no usa servidor ni base de datos. Las cuentas y contraseñas se guardan en `localStorage` del navegador; la recuperación solo permite cambiar la contraseña localmente y no verifica identidad ni envía correos. No usar con datos reales ni como mecanismo de seguridad.

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
| Abdul | UFPSO | Desarrollo de lógica y autenticación |
| Karol | UFPSO | Diseño UI/UX y responsive |
| Juan David | UFPSO | QA, pruebas y documentación |
