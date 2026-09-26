-- Public-preview / trial access support.
-- 'trial' is added to the existing access_status enum rather than
-- converting member_access.status to plain text, to avoid a destructive
-- type change; pending/revoked remain valid for other (admin) flows.

alter type access_status add value if not exists 'trial';

alter table modules
  add column if not exists trial_days integer not null default 0;

alter table member_access
  add column if not exists trial_ends_at timestamptz;

alter table member_access
  alter column status set default 'active';
