// frontend/src/middleware.ts
/* import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      // Si la ruta empieza con /admin, solo entra el rol ADMIN
      if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== "ADMIN") {
        return false;
      }
      return !!token;
    },
  },
}); */

/*
¿Es necesario el Middleware?
La respuesta corta es: Sí, pero cumplen funciones distintas en el Backend y en el Frontend.

En el Frontend (Next.js): ES CRUCIAL
El middleware en Next.js es lo que garantiza que un Cliente no pueda siquiera "ver" la página de administración.

Función: Actúa antes de que la página se renderice. Si el usuario intenta entrar a /admin/configuracion y su token dice que es CLIENT, el middleware lo redirige al home o a un 403.

Sin él: El usuario podría ver la estructura de la página de administración (aunque no vea datos reales) antes de que el cliente de React lo saque.

En el Backend (NestJS): DEPENDE
En NestJS, normalmente se prefieren los Guards (Guardias) sobre los Middlewares para la lógica de roles.

Middleware: Se usa para cosas generales como leer la IP (Trazabilidad/Logs) o sanitizar el body de la petición.

Guards: Son mejores para RBAC porque tienen acceso al "Reflector" (para saber qué rol requiere el método) y al usuario ya autenticado.

Mi recomendación para tu proyecto:

Usa un Middleware en NestJS solo para capturar la IP y el Navegador para tus Logs de auditoría.

Usa un Guard en NestJS para validar los roles de los usuarios antes de ejecutar cualquier acción en la base de datos.

Usa un Middleware en Next.js para proteger el acceso a las carpetas /admin, /groomer y /receptionist.
*/