-- Estructura mínima para Admin: cursos, asignaturas, temas, preguntas
-- Crear tablas
create table if not exists public.cursos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  created_at timestamptz default now()
);

create table if not exists public.asignaturas (
  id uuid primary key default gen_random_uuid(),
  curso_id uuid not null references public.cursos(id) on delete cascade,
  nombre text not null,
  created_at timestamptz default now()
);

create table if not exists public.temas (
  id uuid primary key default gen_random_uuid(),
  asignatura_id uuid not null references public.asignaturas(id) on delete cascade,
  titulo text not null,
  created_at timestamptz default now()
);

create table if not exists public.preguntas (
  id uuid primary key default gen_random_uuid(),
  tema_id uuid not null references public.temas(id) on delete cascade,
  enunciado text not null,
  opcion_a text not null,
  opcion_b text not null,
  opcion_c text not null,
  correcta text not null check (correcta in ('A','B','C')),
  created_at timestamptz default now()
);

-- Activar RLS en todas
alter table public.cursos enable row level security;
alter table public.asignaturas enable row level security;
alter table public.temas enable row level security;
alter table public.preguntas enable row level security;

-- Políticas abiertas a usuarios autenticados (desarrollo)
drop policy if exists "cursos all for authenticated" on public.cursos;
create policy "cursos all for authenticated" on public.cursos for all to authenticated using (true) with check (true);

drop policy if exists "asignaturas all for authenticated" on public.asignaturas;
create policy "asignaturas all for authenticated" on public.asignaturas for all to authenticated using (true) with check (true);

drop policy if exists "temas all for authenticated" on public.temas;
create policy "temas all for authenticated" on public.temas for all to authenticated using (true) with check (true);

drop policy if exists "preguntas all for authenticated" on public.preguntas;
create policy "preguntas all for authenticated" on public.preguntas for all to authenticated using (true) with check (true);
