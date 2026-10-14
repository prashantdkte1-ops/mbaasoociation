import { requireSupabase } from '../lib/supabase';
export async function listPublicMembers({ academicYearId, clubId, search='' } = {}) {
  const db = requireSupabase();
  let q = db.from('members').select('id,full_name,slug,designation,member_type,club_id,academic_year_id,class_year,division,bio,specialisations,linkedin_url,photo_path,display_order,clubs(name,slug,short_name),academic_years(label)').eq('is_published',true).eq('is_active',true).order('display_order').order('full_name');
  if (academicYearId) q=q.eq('academic_year_id',academicYearId);
  if (clubId) q=q.eq('club_id',clubId);
  if (search.trim()) q=q.ilike('full_name',`%${search.trim()}%`);
  const {data,error}=await q;
  if(error) throw error;
  return data || [];
}
export async function saveMember(values, id) {
  const db=requireSupabase();
  const payload={...values, updated_at:new Date().toISOString()};
  if (!payload.slug) payload.slug=payload.full_name.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const result=id ? await db.from('members').update(payload).eq('id',id).select().single() : await db.from('members').insert(payload).select().single();
  if(result.error) throw result.error;
  return result.data;
}
export async function uploadMemberPhoto(file, memberId) {
  const db=requireSupabase();
  const allowed=['image/jpeg','image/png','image/webp'];
  if(!allowed.includes(file.type)) throw new Error('Choose a JPG, PNG, or WebP image.');
  if(file.size>5*1024*1024) throw new Error('Image must be 5 MB or smaller.');
  const ext=file.type==='image/jpeg'?'jpg':file.type.split('/')[1];
  const path=`${memberId}/${crypto.randomUUID()}.${ext}`;
  const {error}=await db.storage.from('member-photos').upload(path,file,{upsert:false,contentType:file.type});
  if(error) throw error;
  return path;
}
export async function deleteMember(id) {
  const db=requireSupabase();
  const {error}=await db.from('members').delete().eq('id',id);
  if(error) throw error;
}
