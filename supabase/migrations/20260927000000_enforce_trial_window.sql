-- member_access_insert_own_trial lets a member insert their own 'trial' row,
-- but the client chooses trial_ends_at. Without this, anyone logged in could
-- POST a trial ending in 2099, or trial a module with trial_days = 0.
-- The database is now the only authority on the trial window.

create or replace function public.enforce_trial_window()
returns trigger
language plpgsql
-- Definer so the trial_days lookup never depends on the caller's modules RLS.
security definer
set search_path = ''
as $$
declare
  v_trial_days integer;
begin
  select m.trial_days into v_trial_days
  from public.modules m
  where m.id = new.module_id;

  if coalesce(v_trial_days, 0) <= 0 then
    raise exception 'Modul ini tidak menyediakan trial'
      using errcode = 'check_violation';
  end if;

  -- Whatever the client sent is ignored.
  new.trial_ends_at := now() + make_interval(days => v_trial_days);
  return new;
end;
$$;

create trigger member_access_enforce_trial_window
before insert on public.member_access
for each row
when (new.status = 'trial')
execute function public.enforce_trial_window();

-- Trigger functions can't be invoked via RPC anyway, but keep them off the
-- exposed API surface (also clears the security-definer advisor warnings).
revoke execute on function public.enforce_trial_window() from public, anon, authenticated;
revoke execute on function public.grant_marketplace_on_kelas_purchase() from public, anon, authenticated;
