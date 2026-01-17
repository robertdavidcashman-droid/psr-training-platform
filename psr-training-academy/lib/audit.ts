import type { SupabaseClient } from '@supabase/supabase-js';

export async function logAuditEvent(
  supabase: SupabaseClient,
  actorUserId: string,
  input: {
    action: string;
    entity: string;
    entityId?: string | null;
    metadata?: Record<string, unknown>;
  },
) {
  const { action, entity, entityId, metadata } = input;
  // Best-effort: audit failures should not break the primary mutation path.
  try {
    await supabase.from('audit_events').insert({
      actor_user_id: actorUserId,
      action,
      entity,
      entity_id: entityId ?? null,
      metadata: metadata ?? {},
    });
  } catch {
    // ignore
  }
}
