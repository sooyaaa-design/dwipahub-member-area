-- Marketplace grant fires on any UPDATE (not just UPDATE OF status) and
-- overrides whatever status an existing marketplace row has.

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
    set status = 'active', trial_ends_at = null, granted_at = now();

  return new;
end;
$$;

drop trigger if exists member_access_grant_marketplace on public.member_access;
create trigger member_access_grant_marketplace
  after insert or update on public.member_access
  for each row
  when (new.status = 'active')
  execute function public.grant_marketplace_on_kelas_purchase();

insert into public.modules (nama, kategori, vertical, skill_area, module_type, min_tier, trial_days)
select 'Paket Umroh Siap Jual', 'umroh', 'umroh', 'penjualan', 'marketplace', 'pengantar', 0
where not exists (select 1 from public.modules where nama = 'Paket Umroh Siap Jual');
