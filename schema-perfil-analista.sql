-- Rodar no SQL Editor do Supabase do GBS (projeto ndwivbhqglpnfyqwjbzu).
-- Libera o novo perfil "analista" na constraint de usuarios_portal.

-- 1) Conferir o nome exato da constraint atual (ajuste o nome abaixo se for diferente)
select conname, pg_get_constraintdef(oid)
from pg_constraint
where conrelid = 'usuarios_portal'::regclass and contype = 'c';

-- 2) Recriar a constraint incluindo "analista"
alter table usuarios_portal drop constraint usuarios_portal_perfil_check;
alter table usuarios_portal add constraint usuarios_portal_perfil_check
  check (perfil in ('gestor','gestor1','supervisor_geral','supervisor','auxiliar','analista','tst_passos','tst_pouso_alegre'));
