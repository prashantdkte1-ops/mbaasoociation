export const slugify = (value='') => value.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const publicImageUrl = (path, bucket='member-photos') => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const client = window.__supabaseClient;
  return client ? client.storage.from(bucket).getPublicUrl(path).data.publicUrl : '';
};
export const friendlyError = (error) => error?.message || 'Something went wrong. Please try again.';
