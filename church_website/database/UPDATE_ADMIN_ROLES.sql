UPDATE public.admin_profiles SET role = 'parish_it_officer', display_name = 'Robert Brevin', updated_at = now() WHERE lower(email) = 'robertbrevin@gmail.com' RETURNING email, role, display_name;

UPDATE public.admin_profiles SET role = 'parish_it_officer_2', display_name = 'Calmax Kipkoech', updated_at = now() WHERE lower(email) = 'calmaxkipkoech@gmail.com' RETURNING email, role, display_name;

UPDATE public.admin_profiles SET role = 'parish_secretary', display_name = 'Sarah Keino', updated_at = now() WHERE lower(email) = 'keinosarah46@gmail.com' RETURNING email, role, display_name;

UPDATE public.admin_profiles SET role = 'parish_priest', display_name = 'Rev. Dr Fr Richard Kimeli', updated_at = now() WHERE lower(email) = 'kimelirlolyo@gmail.com' RETURNING email, role, display_name;

UPDATE public.admin_profiles SET role = 'treasurer', display_name = 'Moindi Hillary', updated_at = now() WHERE lower(email) = 'moindihillary@gmail.com' RETURNING email, role, display_name;

UPDATE public.admin_profiles SET role = 'father_2', display_name = 'Fr Songok Myke', updated_at = now() WHERE lower(email) = 'songokmyke@gmail.com' RETURNING email, role, display_name;

SELECT email, role, display_name FROM public.admin_profiles ORDER BY email;
