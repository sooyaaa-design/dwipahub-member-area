-- Housekeeping only: access checks already treat a lapsed trial as expired
-- via trial_ends_at, so this just keeps the status column truthful.
-- trial_ends_at is preserved so the UI can still tell it was a trial.

create or replace function public.expire_lapsed_trials()
returns integer
language sql
set search_path = ''
as $$
  with expired as (
    update public.member_access
    set status = 'expired'
    where status = 'trial' and trial_ends_at < now()
    returning 1
  )
  select count(*)::integer from expired;
$$;

-- Functions in public are exposed as PostgREST RPCs; keep this one
-- callable only by privileged roles (postgres / pg_cron / service_role).
revoke execute on function public.expire_lapsed_trials() from public, anon, authenticated;
