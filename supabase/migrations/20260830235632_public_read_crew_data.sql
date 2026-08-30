-- The app queries crews/crew_members/time_entries/hours_breakdown with the
-- anon (publishable) key and no Supabase Auth session. Existing SELECT
-- policies on these tables all require auth.uid(), so anonymous reads were
-- silently filtered to zero rows. Restore public read access to match how
-- the client actually queries the database.
CREATE POLICY "Public read access for demo" ON public.crews FOR SELECT TO public USING (true);
CREATE POLICY "Public read access for demo" ON public.crew_members FOR SELECT TO public USING (true);
CREATE POLICY "Public read access for demo" ON public.time_entries FOR SELECT TO public USING (true);
CREATE POLICY "Public read access for demo" ON public.hours_breakdown FOR SELECT TO public USING (true);
