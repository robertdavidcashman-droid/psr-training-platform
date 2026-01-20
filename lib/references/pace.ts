import type { QuestionReferenceSchema } from "@/lib/schemas";
import { z } from "zod";

export type QuestionReference = z.infer<typeof QuestionReferenceSchema>;

/**
 * Curated, conservative reference suggestions by common PSR topics.
 *
 * Policy:
 * - Prefer statute sections when confident.
 * - Only include Code paragraph numbers when confident.
 * - If unsure about a paragraph number, use a "Check:" cite or a note.
 *
 * This prevents silently presenting uncertain citations as definitive.
 */
const TOPIC_REFERENCE_MAP: Record<string, QuestionReference[]> = {
  // Arrest / necessity
  "pace-s24-arrest": [
    { instrument: "PACE", cite: "PACE 1984 s.24 (powers of arrest)" },
    { instrument: "Code G", cite: "Code G (arrest) — necessity criteria (Check: paragraph)" },
  ],

  // Detention time limits / extensions / reviews
  "pace-detention-time": [
    { instrument: "PACE", cite: "PACE 1984 s.41 (detention without charge — time limits)" },
    { instrument: "PACE", cite: "PACE 1984 ss.42–44 (extensions / warrants) (Check: applicability)" },
    { instrument: "Code C", cite: "Code C (detention) — time limits and reviews (Check: paragraph)" },
  ],

  // Custody record / rights in detention
  "pace-custody-record": [
    { instrument: "Code C", cite: "Code C — custody record / rights and entitlements (Check: paragraph)" },
  ],

  // Interview preparation/attendance/interventions
  "interview-preparation": [
    { instrument: "Code C", cite: "Code C — right to legal advice and pre-interview consultation (Check: paragraph)" },
  ],
  "interview-attendance": [
    { instrument: "Code C", cite: "Code C — conduct of interviews / breaks / legal advice (Check: paragraph)" },
    { instrument: "Code D", cite: "Code D — identification procedures (only if relevant)" },
  ],
  "interview-intervention": [
    { instrument: "Code C", cite: "Code C — interview standards / fairness (Check: paragraph)" },
    { instrument: "PACE", cite: "PACE 1984 s.78 (exclusion of evidence — fairness)" },
  ],

  // Vulnerability safeguards
  "vuln-appropriate-adult": [
    { instrument: "Code C", cite: "Code C — appropriate adult safeguards (Check: paragraph)" },
  ],
  "vuln-mental-health": [
    { instrument: "Code C", cite: "Code C — fitness for interview / vulnerable suspects (Check: paragraph)" },
  ],
  "vuln-youth": [
    { instrument: "Code C", cite: "Code C — juveniles and appropriate adults (Check: paragraph)" },
    { instrument: "LASPO", cite: "LASPO 2012 (youth cautions / related provisions) (Check: section)" },
  ],

  // Evidence/admissibility
  "evidence-admissibility": [
    { instrument: "PACE", cite: "PACE 1984 s.76 (confessions: oppression/unreliability)" },
    { instrument: "PACE", cite: "PACE 1984 s.78 (general discretion to exclude unfair evidence)" },
  ],

  // Disclosure (high-level)
  "disclosure-advance": [
    { instrument: "CPIA", cite: "CPIA 1996 (disclosure framework — high level) (Check: applicability)" },
  ],
  "disclosure-strategy": [
    { instrument: "CPIA", cite: "CPIA 1996 (disclosure framework — high level) (Check: applicability)" },
  ],

  // Bail / RUI
  "bail-applications": [
    { instrument: "Bail Act", cite: "Bail Act 1976 (presumption in favour of bail) (Check: section)" },
  ],
  "bail-rui": [
    { instrument: "PACE", cite: "PACE 1984 (release without charge / investigation) (Check: provision)" },
  ],
};

const TOPIC_PRACTICE_TIPS: Record<string, string[]> = {
  "pace-s24-arrest": [
    "Ask for the arrest grounds and the necessity rationale (what exactly made arrest necessary vs VA).",
    "Ensure the necessity ground is recorded and consistent with the disclosure / custody record.",
    "If arrest appears unnecessary, note it and consider how it impacts detention/admissibility later.",
  ],
  "pace-detention-time": [
    "Identify the relevant time and track key review points and time limits.",
    "Check the custody record for reviews, rights, and any delays with reasons recorded.",
    "If time limits are approaching, prepare representations early (extensions, charging decisions, bail).",
  ],
  "vuln-appropriate-adult": [
    "Flag AA requirement early and ensure the AA is suitable (no conflict, understands role).",
    "Do not proceed with interview until the required safeguards are in place.",
    "Record concerns in the custody record (and your notes) contemporaneously.",
  ],
  "interview-intervention": [
    "Intervene promptly and politely when questions are misleading, oppressive, or assume undisclosed facts.",
    "Ask for clarification / disclosure on the record when needed.",
    "Request a break if your client needs advice before continuing.",
  ],
};

export function getReferenceSuggestions(topicId: string): QuestionReference[] {
  return TOPIC_REFERENCE_MAP[topicId] ?? [];
}

export function getPracticeTips(topicId: string): string[] {
  return TOPIC_PRACTICE_TIPS[topicId] ?? [];
}

export function isPaceCustodyTopic(topicId: string): boolean {
  return topicId.startsWith("pace-") || topicId === "vuln-appropriate-adult" || topicId === "vuln-mental-health";
}

