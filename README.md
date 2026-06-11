# Proyecto PetSpa

Este proyecto consta de un **backend** desarrollado con NestJS y un **frontend** en React con Vite y TailwindCSS.

---

## Tecnologías principales

### Backend

- **NestJS**: Framework Node.js para construir aplicaciones escalables y mantenibles.
- **GraphQL**: API flexible para consultar y mutar datos.
- **Prisma**: ORM para interactuar con la base de datos PostgreSQL.
- **PostgreSQL**: Base de datos relacional.
- **JWT**: Autenticación mediante tokens JSON Web Tokens.
- **Bcrypt**: Hashing seguro de contraseñas.
- **Nodemailer**: Envío de correos electrónicos (verificación, notificaciones).
- **Swagger**: Documentación automática de la API.
- **Throttler**: Protección contra exceso de solicitudes (rate limiting).
- **Class-validator & Class-transformer**: Validación y transformación de datos.

### Frontend

- **React**: Biblioteca principal para construir interfaces de usuario.
- **React Router DOM**: Manejo de rutas en la aplicación.
- **Axios**: Para realizar solicitudes HTTP al backend.
- **Vite**: Bundler rápido para desarrollo y producción.
- **TailwindCSS**: Framework de CSS utilitario para estilos rápidos y responsivos.
- **TypeScript**: Tipado estático para mayor seguridad y autocompletado.

---
## Cómo levantar el proyecto

Sigue estos pasos para levantar **backend** y **frontend** desde cero:

---

### 1️⃣ Clonar el repositorio

```bash
git clone <URL_DEL_REPO>
cd <NOMBRE_DEL_REPO>
```



🔧 Backend
2️⃣ Entrar al backend
cd backend
3️⃣ Instalar dependencias
npm install
4️⃣ Configurar variables de entorno (.env)

Crea un archivo .env en la raíz del backend:

DATABASE_URL="postgresql://usuario:password@localhost:5432/nombre_db"

JWT_SECRET="tu_secreto_seguro"

EMAIL_USER="tu_correo@gmail.com"
EMAIL_PASS="tu_password_o_app_password"

Asegúrate de tener PostgreSQL instalado y corriendo localmente.

5️⃣ Ejecutar migraciones con Prisma
npx prisma generate
npx prisma migrate dev --name init

Esto:

Genera el cliente de Prisma
Crea las tablas en la base de datos
6️⃣ Levantar backend en desarrollo
npm run dev

Backend disponible en:

http://localhost:3000
📌 Scripts útiles del backend
npm run dev: modo desarrollo con hot reload
npm run build: compila el proyecto
npm run start:prod: ejecuta versión compilada
npm run test: ejecuta tests con Jest
npm run lint: revisa y corrige errores de código
💻 Frontend
7️⃣ Entrar al frontend
cd ../frontend
8️⃣ Instalar dependencias
npm install
9️⃣ Configurar .env (opcional)

Si tu frontend consume el backend:

VITE_API_URL=http://localhost:3000
🔟 Levantar frontend
npm run dev

Frontend disponible en:

http://localhost:5173
📌 Scripts útiles del frontend
npm run dev: desarrollo
npm run build: build de producción
npm run preview: previsualizar build
npm run lint: revisar código



## Notas

- El proyecto está dividido en dos carpetas principales: `backend` y `frontend`.