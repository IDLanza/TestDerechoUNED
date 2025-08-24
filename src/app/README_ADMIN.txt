INSTRUCCIONES RÁPIDAS – Panel /admin (CRUD mínimo)
==================================================

1) Copia estas carpetas/archivos dentro de tu proyecto Next.js:
   - app/admin/layout.tsx
   - app/admin/page.tsx
   - app/admin/cursos/page.tsx
   - app/admin/asignaturas/page.tsx
   - app/admin/temas/page.tsx
   - app/admin/preguntas/page.tsx
   - sql/admin_schema.sql

   Nota: Tu proyecto debe tener ya creados:
     - lib/supabaseServer.ts  (usando @supabase/ssr)
     - Autenticación de Supabase funcionando

2) En Supabase → SQL Editor ejecuta el archivo:
   sql/admin_schema.sql
   (crea tablas + RLS + políticas para desarrollo)

3) Despliega (git add/commit/push) y abre:
   /admin  → verás el menú.
   /admin/cursos → alta/listado/borrado de cursos.
   /admin/asignaturas → con select de curso.
   /admin/temas → con select de asignatura.
   /admin/preguntas → con select de tema.

4) Seguridad (más adelante):
   Estas policies son abiertas (a cualquier usuario autenticado).
   Cuando quieras, afinamos por propietario (auth.uid()), y añadimos edición.

5) Problemas típicos:
   - Error relation "public.cursos" does not exist → Ejecuta el SQL primero.
   - 401 / redirect a /login → No hay sesión. Inicia sesión.
   - No refresca la lista → Revisa que la página use dynamic='force-dynamic'.

¡Listo!
