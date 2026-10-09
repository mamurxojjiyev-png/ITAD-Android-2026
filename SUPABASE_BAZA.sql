-- Supabase SQL Editor ichida bir marta ishga tushiring.
create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 full_name text not null default 'Talaba',
 role text not null default 'student' check (role in ('student','teacher'))
);
create table if not exists public.progress (
 user_id uuid primary key references public.profiles(id) on delete cascade,
 progress jsonb not null default '{}'::jsonb,
 updated_at timestamptz not null default now()
);
create table if not exists public.teacher_grades (
 id bigint generated always as identity primary key,
 user_id uuid not null references public.profiles(id) on delete cascade,
 teacher_id uuid not null default auth.uid() references public.profiles(id),
 score integer not null check(score between 0 and 100),
 note text not null default '',
 created_at timestamptz not null default now()
);
create or replace function public.new_account_profile()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
 insert into public.profiles(id,full_name,role)
 values(new.id,coalesce(nullif(left(new.raw_user_meta_data->>'full_name',150),''),'Talaba'),'student')
 on conflict (id) do nothing;
 return new;
end; $$;
drop trigger if exists on_auth_user_created_itad on auth.users;
create trigger on_auth_user_created_itad after insert on auth.users
for each row execute procedure public.new_account_profile();
-- Avval ro‘yxatdan o‘tgan foydalanuvchilar uchun
insert into public.profiles(id,full_name,role)
select id,coalesce(nullif(left(raw_user_meta_data->>'full_name',150),''),'Talaba'),'student' from auth.users
on conflict(id) do nothing;
create or replace function public.is_itad_teacher()
returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='teacher');
$$;
revoke all on function public.is_itad_teacher() from public;
grant execute on function public.is_itad_teacher() to authenticated;
alter table public.profiles enable row level security;
alter table public.progress enable row level security;
alter table public.teacher_grades enable row level security;
drop policy if exists itad_profile_read on public.profiles;
create policy itad_profile_read on public.profiles for select to authenticated using(id=auth.uid() or public.is_itad_teacher());
drop policy if exists itad_progress_select on public.progress;
create policy itad_progress_select on public.progress for select to authenticated using(user_id=auth.uid() or public.is_itad_teacher());
drop policy if exists itad_progress_insert on public.progress;
create policy itad_progress_insert on public.progress for insert to authenticated with check(user_id=auth.uid());
drop policy if exists itad_progress_update on public.progress;
create policy itad_progress_update on public.progress for update to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
drop policy if exists itad_grades_select on public.teacher_grades;
create policy itad_grades_select on public.teacher_grades for select to authenticated using(user_id=auth.uid() or public.is_itad_teacher());
drop policy if exists itad_grades_insert on public.teacher_grades;
create policy itad_grades_insert on public.teacher_grades for insert to authenticated with check(public.is_itad_teacher() and teacher_id=auth.uid());
-- O‘qituvchini faqat loyiha egasi SQL Editor orqali tayinlaydi:
-- update public.profiles set role='teacher' where id=(select id from auth.users where email='oqituvchi@example.com');
