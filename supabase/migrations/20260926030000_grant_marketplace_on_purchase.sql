-- Full purchase of a kelas module (status 'active') grants lifetime access to
-- the marketplace module(s) of the same vertical. Trials grant nothing.
-- security definer: members can only self-insert 'trial' rows under RLS, so
-- the 'active' marketplace grant must bypass it. 'revoked' marketplace rows
-- are left alone so a purchase never silently undoes an admin revocation.

create or replace function public.grant_marketplace_on_kelas_purchase()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.modules
    where id = new.module_id and module_type = 'kelas'
  ) then
    return new;
  end if;

  insert into public.member_access (member_id, module_id, status, trial_ends_at, granted_at)
  select new.member_id, mp.id, 'active', null, now()
  from public.modules src
  join public.modules mp
    on mp.vertical = src.vertical and mp.module_type = 'marketplace'
  where src.id = new.module_id
  on conflict (member_id, module_id) do update
    set status = 'active', trial_ends_at = null, granted_at = now()
    where public.member_access.status in ('trial', 'expired', 'pending');

  return new;
end;
$$;

create trigger member_access_grant_marketplace
  after insert or update of status on public.member_access
  for each row
  when (new.status = 'active')
  execute function public.grant_marketplace_on_kelas_purchase();
