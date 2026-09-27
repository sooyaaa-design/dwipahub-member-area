-- Run the trial housekeeping hourly. Access is already enforced by
-- trial_ends_at at query time, so the schedule only affects how quickly the
-- status column catches up, not security.

create extension if not exists pg_cron;

-- cron.schedule upserts by job name, so re-running this is safe.
select cron.schedule(
  'expire-lapsed-trials',
  '0 * * * *',
  $$select public.expire_lapsed_trials()$$
);
