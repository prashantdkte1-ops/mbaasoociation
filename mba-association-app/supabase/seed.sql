insert into public.clubs(name,slug,short_name,discipline,description,objectives,display_order)
values
 ('NEXUS','nexus','NEXUS','Human Resources','People, culture, talent and workplace learning.','{"Talent acquisition","Employee engagement","Learning and development"}',1),
 ('VERTEX','vertex','VERTEX','Finance','Financial literacy, analysis and decision-making.','{"Financial analysis","Financial modelling","Markets and literacy"}',2),
 ('PULSE','pulse','PULSE','Marketing','Brand strategy, consumer insights and campaigns.','{"Brand strategy","Digital marketing","Consumer behaviour"}',3)
on conflict(slug) do nothing;

insert into public.site_content(content_key,content_value) values
 ('hero_heading','{"text":"Learn. Participate. Lead. Grow."}'),
 ('hero_description','{"text":"A student-driven professional ecosystem designed to transform classroom knowledge into practical experience."}'),
 ('association_intro','{"text":"The Association connects specialised clubs under one shared organisation."}'),
 ('membership_info','{"general_fee_inr":150,"office_bearer_contribution_inr":500,"approval_status":"draft_pending_college_approval"}'),
 ('rules','{"items":["Follow college and department rules.","Maintain professional and respectful conduct.","Do not misuse Association positions or resources.","Maintain financial transparency.","Protect confidential information.","Academic responsibilities remain a priority."]}')
on conflict(content_key) do nothing;
-- Create the first administrator manually in Supabase Auth, then insert their UUID into admin_roles using the SQL editor:
-- insert into public.admin_roles(user_id, role) values ('AUTH_USER_UUID_HERE','admin');
