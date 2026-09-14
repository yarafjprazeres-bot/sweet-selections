REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
REVOKE ALL ON FUNCTION public.grant_laco_admin_for_verified_email() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.grant_laco_admin_for_verified_email() TO service_role;