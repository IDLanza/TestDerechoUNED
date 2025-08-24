# Quiz Next.js + Supabase — Starter

## 1) Requisitos
- Node 18+
- Cuenta Supabase (gratis)
- Vercel (opcional para deploy)

## 2) Setup
1. Crea un proyecto Supabase y ejecuta el `schema.sql` que te pasé (tablas + RLS).
2. Copia `.env.example` a `.env.local` y rellena:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (para llamadas server-side)
3. Instala dependencias y arranca:
   ```bash
   npm install
   npm run dev
   ```

## 3) Flujo
- `/` lista asignaturas visibles.
- `/subject/[id]` → eliges nº preguntas, temas, etiquetas → `POST /api/attempt/start`
- `/attempt/[id]/q/[n]` → 1 pregunta por página → `POST /api/attempt/[id]/answer`
- Al final → `GET /api/attempt/[id]/finish` → `/attempt/[id]/results`

> Nota: La autenticación está esbozada. Habrá que conectar Supabase Auth (alias + contraseña) y usar el `auth.user()` en las rutas API para sustituir el `user_id` placeholder.

## 4) Publicidad y CMP
- Usa `NEXT_PUBLIC_SHOW_ADS=true` para ver los `AdSlot`.
- Integra tu red de anuncios y CMP antes de activar en producción.

## 5) Pendiente/Próximo
- Conectar Supabase Auth y proteger rutas.
- Panel `/admin` (CRUD de cursos/asignaturas/temas/etiquetas/preguntas + importador CSV/JSON).
- Mejorar algoritmo determinista (seed) y orden de opciones.
- Estadísticas del usuario por tema/etiqueta y dashboard.
