-- Public preview: modules become a public marketing catalog (anonymous
-- visitors can see the card, not the content), members can self-provision
-- their own row on signup, and members can self-serve a trial access row.
-- Trial access also needs to unlock classes while the trial is still valid.

drop policy if exists modules_select_authenticated on modules;
create policy modules_select_public on modules
  for select using (true);

create policy members_insert_own on members
  for insert
  with check (id = auth.uid());

create policy member_access_insert_own_trial on member_access
  for insert
  with check (member_id = auth.uid() and status = 'trial');

drop policy if exists classes_select_if_unlocked on classes;
create policy classes_select_if_unlocked on classes
  for select using (
    exists (
      select 1
      from modules m
      join members me on me.id = auth.uid()
      where m.id = classes.module_id
        and me.tier >= m.min_tier
    )
    or exists (
      select 1
      from member_access ma
      where ma.module_id = classes.module_id
        and ma.member_id = auth.uid()
        and (
          ma.status = 'active'
          or (ma.status = 'trial' and ma.trial_ends_at > now())
        )
    )
  );
