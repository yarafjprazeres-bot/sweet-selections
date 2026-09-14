REVOKE ALL ON FUNCTION public.check_guest_name(uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_rsvp_on_list() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_guest_name(uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.set_rsvp_on_list() TO service_role;