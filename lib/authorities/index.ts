import { z } from "zod";
import type { Question } from "@/lib/schemas";

// Authority instrument types - extended for full PSRAS coverage
export const AuthorityInstrumentSchema = z.enum([
  "PACE",
  "Code C",
  "Code D",
  "Code E",
  "Code F",
  "Code G",
  "CPIA",
  "Bail Act",
  "LASPO",
  "LAA Arrangements",
  "LAA Guidance",
  "SRA Standard",
  "CJPOA",
]);

export type AuthorityInstrument = z.infer<typeof AuthorityInstrumentSchema>;

// Full authority schema with optional URL
export const AuthoritySchema = z.object({
  instrument: AuthorityInstrumentSchema,
  cite: z.string().min(1),
  url: z.string().url().optional(),
  note: z.string().optional(),
});

export type Authority = z.infer<typeof AuthoritySchema>;

// GOV.UK PACE Code URLs for link-outs
export const PACE_CODE_URLS: Record<string, string> = {
  "Code C": "https://www.gov.uk/government/publications/pace-code-c-2023/pace-code-c-2023-accessible",
  "Code D": "https://www.gov.uk/government/publications/pace-code-d-2017/pace-code-d-2017-accessible",
  "Code E": "https://www.gov.uk/government/publications/pace-codes-e-and-f-2018/pace-code-e-2018-accessible",
  "Code F": "https://www.gov.uk/government/publications/pace-codes-e-and-f-2018/pace-code-f-2018-accessible",
  "Code G": "https://www.gov.uk/government/publications/pace-code-g-2012/pace-code-g-2012-accessible",
};

// Legislation.gov.uk base URLs
export const LEGISLATION_URLS: Record<string, string> = {
  PACE: "https://www.legislation.gov.uk/ukpga/1984/60",
  CPIA: "https://www.legislation.gov.uk/ukpga/1996/25",
  "Bail Act": "https://www.legislation.gov.uk/ukpga/1976/63",
  LASPO: "https://www.legislation.gov.uk/ukpga/2012/10",
  CJPOA: "https://www.legislation.gov.uk/ukpga/1994/33",
};

// SRA and LAA URLs
export const GUIDANCE_URLS: Record<string, string> = {
  "SRA Standard": "https://www.sra.org.uk/solicitors/standards-regulations/",
  "LAA Arrangements": "https://assets.publishing.service.gov.uk/media/68dcf841ef1c2f72bc1e4c9f/Police_Station_Register_Arrangements_2025.pdf",
  "LAA Guidance": "https://www.gov.uk/guidance/legal-aid-for-providers",
};

/**
 * Normalize authority citation to canonical form
 */
export function normalizeAuthority(instrument: string, cite: string): Authority | null {
  const normalizedInstrument = AuthorityInstrumentSchema.safeParse(instrument);
  if (!normalizedInstrument.success) return null;

  const trimmedCite = cite.trim();
  if (!trimmedCite) return null;

  return {
    instrument: normalizedInstrument.data,
    cite: trimmedCite,
    url: getAuthorityUrl(normalizedInstrument.data, trimmedCite),
  };
}

/**
 * Get URL for an authority based on instrument type
 */
export function getAuthorityUrl(instrument: AuthorityInstrument, cite: string): string | undefined {
  // PACE Codes
  if (instrument in PACE_CODE_URLS) {
    return PACE_CODE_URLS[instrument];
  }

  // Legislation
  if (instrument in LEGISLATION_URLS) {
    const baseUrl = LEGISLATION_URLS[instrument];
    // Try to extract section number for direct link
    const sectionMatch = cite.match(/s\.?\s*(\d+)/i);
    if (sectionMatch) {
      return `${baseUrl}/section/${sectionMatch[1]}`;
    }
    return baseUrl;
  }

  // Guidance
  if (instrument in GUIDANCE_URLS) {
    return GUIDANCE_URLS[instrument];
  }

  return undefined;
}

/**
 * Validate authority format based on instrument type
 */
export function validateAuthority(authority: Authority): { valid: boolean; reason?: string } {
  const { instrument, cite } = authority;

  // PACE statute should reference section
  if (instrument === "PACE") {
    if (!/s\.?\s*\d+/i.test(cite) && !/section\s*\d+/i.test(cite)) {
      return { valid: false, reason: "PACE citation should include section number (e.g., s.58)" };
    }
  }

  // Code citations should reference paragraph or Annex
  if (instrument.startsWith("Code ")) {
    if (!/para/i.test(cite) && !/annex/i.test(cite) && !/check:/i.test(cite)) {
      return { valid: false, reason: `${instrument} citation should include paragraph or Annex reference` };
    }
  }

  // Bail Act should reference section
  if (instrument === "Bail Act") {
    if (!/s\.?\s*\d+/i.test(cite) && !/section\s*\d+/i.test(cite) && !/check:/i.test(cite)) {
      return { valid: false, reason: "Bail Act citation should include section number" };
    }
  }

  // CJPOA should reference section
  if (instrument === "CJPOA") {
    if (!/s\.?\s*\d+/i.test(cite) && !/section\s*\d+/i.test(cite)) {
      return { valid: false, reason: "CJPOA citation should include section number" };
    }
  }

  return { valid: true };
}

/**
 * Check if a question requires authorities based on its tags/topic
 */
export function requiresAuthorities(question: Partial<Question>): boolean {
  const custodyTags = [
    "custody", "detention", "arrest", "pace", "code-c", "code-d", "code-e", "code-f", "code-g",
    "interview", "legal-advice", "appropriate-adult", "vulnerability", "bail", "s58", "s76", "s78",
    "disclosure", "caution", "fitness-for-interview", "time-limits", "extensions", "reviews",
  ];

  const tags = question.tags ?? [];
  const topicId = question.topicId ?? "";

  // Check if topic is custody-related
  if (topicId.startsWith("pace-") || topicId.startsWith("vuln-") || topicId.startsWith("interview-") ||
      topicId.startsWith("bail-") || topicId.startsWith("disclosure-")) {
    return true;
  }

  // Check if any tag indicates custody/PACE content
  return tags.some((tag) => custodyTags.includes(tag.toLowerCase()));
}

/**
 * Check if citation is marked as needing verification
 */
export function isCheckCitation(cite: string): boolean {
  const lower = cite.toLowerCase();
  return lower.startsWith("check:") || lower.includes("(check:");
}

/**
 * Add URLs to authorities that are missing them
 */
export function enrichAuthorities(authorities: Question["references"]): Authority[] {
  return authorities.map((ref) => ({
    instrument: ref.instrument as AuthorityInstrument,
    cite: ref.cite,
    url: getAuthorityUrl(ref.instrument as AuthorityInstrument, ref.cite),
    note: ref.note,
  }));
}

/**
 * Standards spine types for loading from standards.json
 */
export interface Criterion {
  id: string;
  label: string;
  summary: string;
  expectedAuthorities: Authority[];
  tags: string[];
}

export interface Outcome {
  id: string;
  title: string;
  criteria: Criterion[];
}

export interface Unit {
  id: string;
  title: string;
  outcomes: Outcome[];
}

export interface Part {
  id: string;
  title: string;
  units: Unit[];
}

export interface StandardsSpine {
  version: string;
  sourceUrls: Record<string, string>;
  parts: Part[];
}

// Cache for loaded standards
let cachedStandards: StandardsSpine | null = null;

/**
 * Load standards from JSON file (server-side only)
 * Note: For client-side use, import the JSON directly
 */
export function loadStandards(): StandardsSpine | null {
  if (cachedStandards) return cachedStandards;

  // For server-side usage in API routes, we can import directly
  // This function is primarily for backwards compatibility
  // Client components should import the JSON directly
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const data = require("@/content/psras/standards.json") as StandardsSpine;
    cachedStandards = data;
    return cachedStandards;
  } catch {
    return null;
  }
}

/**
 * Get all criteria from standards
 */
export function getAllCriteria(): Criterion[] {
  const standards = loadStandards();
  if (!standards) return [];

  const criteria: Criterion[] = [];
  for (const part of standards.parts) {
    for (const unit of part.units) {
      for (const outcome of unit.outcomes) {
        criteria.push(...outcome.criteria);
      }
    }
  }
  return criteria;
}

/**
 * Get expected authorities for a criterion
 */
export function getExpectedAuthoritiesForCriterion(criterionId: string): Authority[] {
  const criteria = getAllCriteria();
  const criterion = criteria.find((c) => c.id === criterionId);
  return criterion?.expectedAuthorities ?? [];
}

/**
 * Get expected authorities for tags (find matching criteria)
 */
export function getExpectedAuthoritiesForTags(tags: string[]): Authority[] {
  if (!tags.length) return [];

  const criteria = getAllCriteria();
  const authorities: Authority[] = [];
  const seen = new Set<string>();

  for (const criterion of criteria) {
    const criterionTags = criterion.tags ?? [];
    const hasMatch = tags.some((t) => criterionTags.includes(t));
    
    if (hasMatch) {
      for (const auth of criterion.expectedAuthorities) {
        const key = `${auth.instrument}:${auth.cite}`;
        if (!seen.has(key)) {
          seen.add(key);
          authorities.push(auth);
        }
      }
    }
  }

  return authorities;
}

/**
 * Attach expected authorities to a question that's missing them
 */
export function attachExpectedAuthorities(question: Question): Question {
  // If already has authorities, return as-is
  if (question.references && question.references.length > 0) {
    return question;
  }

  // Try to find authorities from tags
  const tags = question.tags ?? [];
  const expectedAuthorities = getExpectedAuthoritiesForTags(tags);

  if (expectedAuthorities.length > 0) {
    return {
      ...question,
      references: expectedAuthorities.map((a) => ({
        instrument: a.instrument as Question["references"][number]["instrument"],
        cite: a.cite,
        note: a.note ?? "Auto-attached from standards spine",
      })),
    };
  }

  return question;
}

/**
 * Validate that a question has required authorities
 */
export function validateQuestionAuthorities(question: Question): {
  valid: boolean;
  requiresReview: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const needsAuthorities = requiresAuthorities(question);

  if (needsAuthorities && (!question.references || question.references.length === 0)) {
    issues.push("Question on custody/PACE topic requires at least one authority");
    return { valid: false, requiresReview: true, issues };
  }

  // Validate each authority
  for (const ref of question.references ?? []) {
    const auth = normalizeAuthority(ref.instrument, ref.cite);
    if (!auth) {
      issues.push(`Invalid authority: ${ref.instrument} - ${ref.cite}`);
      continue;
    }

    const validation = validateAuthority(auth);
    if (!validation.valid) {
      // Don't fail for "Check:" citations - they're explicitly marked as needing verification
      if (!isCheckCitation(ref.cite)) {
        issues.push(validation.reason ?? "Invalid authority format");
      }
    }
  }

  return {
    valid: issues.length === 0,
    requiresReview: issues.length > 0 && needsAuthorities,
    issues,
  };
}
