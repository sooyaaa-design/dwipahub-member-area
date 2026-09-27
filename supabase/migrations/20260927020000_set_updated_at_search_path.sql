-- Pin search_path (advisor: function_search_path_mutable). The body only calls
-- now(), which lives in pg_catalog and is always resolvable.
alter function public.set_updated_at() set search_path = '';
