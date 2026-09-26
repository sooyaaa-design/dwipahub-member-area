alter table modules
  add column if not exists vertical text not null default 'umroh',
  add column if not exists skill_area text not null default 'operasional',
  add column if not exists module_type text not null default 'kelas'
    check (module_type in ('kelas', 'marketplace', 'tool', 'app'));

update modules set vertical = 'umroh', skill_area = 'operasional'
  where nama = 'Dasar Bisnis Travel Umroh';
update modules set vertical = 'umroh', skill_area = 'legal-dokumen'
  where nama = 'Manajemen Visa & Dokumen Jamaah';
update modules set vertical = 'umroh', skill_area = 'marketing'
  where nama = 'Digital Marketing untuk Travel Umroh';
