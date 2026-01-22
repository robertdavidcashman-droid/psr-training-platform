import { questions as allQuestions } from "@/content/questions";
import type { Question } from "@/lib/schemas";

// Pre-computed indices for efficient filtering
let tagIndex: Map<string, Question[]> | null = null;
let criterionIndex: Map<string, Question[]> | null = null;

function buildIndices() {
  if (tagIndex && criterionIndex) return;

  tagIndex = new Map<string, Question[]>();
  criterionIndex = new Map<string, Question[]>();

  for (const question of allQuestions) {
    // Build tag index
    for (const tag of question.tags || []) {
      if (!tagIndex.has(tag)) {
        tagIndex.set(tag, []);
      }
      tagIndex.get(tag)!.push(question as Question);
    }
  }

  // Criterion index will be built on demand when standards are available
}

/**
 * Get questions paginated
 */
export function getQuestionsPaginated(
  page: number,
  pageSize: number
): { questions: Question[]; total: number; page: number; totalPages: number } {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginated = allQuestions.slice(start, end) as Question[];
  const totalPages = Math.ceil(allQuestions.length / pageSize);

  return {
    questions: paginated,
    total: allQuestions.length,
    page,
    totalPages,
  };
}

/**
 * Get questions filtered by criterion (using standards data)
 */
export function getQuestionsByCriterion(
  criterionId: string,
  standardsData: { parts: Array<{ units: Array<{ outcomes: Array<{ criteria: Array<{ id: string; tags?: string[] }> }> }> }> }
): Question[] {
  buildIndices();

  // Find criterion tags
  let criterionTags: string[] = [];
  for (const part of standardsData.parts) {
    for (const unit of part.units) {
      for (const outcome of unit.outcomes) {
        for (const criterion of outcome.criteria) {
          if (criterion.id === criterionId) {
            criterionTags = criterion.tags || [];
            break;
          }
        }
      }
    }
  }

  // Get questions matching any of the criterion tags
  const matchingQuestions = new Set<Question>();
  for (const tag of criterionTags) {
    const taggedQuestions = tagIndex?.get(tag) || [];
    for (const q of taggedQuestions) {
      matchingQuestions.add(q);
    }
  }

  return Array.from(matchingQuestions);
}

/**
 * Get questions filtered by tag
 */
export function getQuestionsByTag(tag: string): Question[] {
  buildIndices();
  return tagIndex?.get(tag) || [];
}

/**
 * Get questions filtered by difficulty
 */
export function getQuestionsByDifficulty(difficulty: Question["difficulty"]): Question[] {
  return allQuestions.filter((q) => q.difficulty === difficulty) as Question[];
}

/**
 * Get questions filtered by type
 */
export function getQuestionsByType(type: Question["type"]): Question[] {
  return allQuestions.filter((q) => q.type === type) as Question[];
}

/**
 * Get questions filtered by topic
 */
export function getQuestionsByTopic(topicId: string): Question[] {
  return allQuestions.filter((q) => q.topicId === topicId) as Question[];
}

/**
 * Get questions with multiple filters
 */
export function getQuestionsFiltered(filters: {
  topicId?: string;
  difficulty?: Question["difficulty"];
  type?: Question["type"];
  tags?: string[];
  limit?: number;
}): Question[] {
  let filtered = allQuestions;

  if (filters.topicId) {
    filtered = filtered.filter((q) => q.topicId === filters.topicId);
  }

  if (filters.difficulty) {
    filtered = filtered.filter((q) => q.difficulty === filters.difficulty);
  }

  if (filters.type) {
    filtered = filtered.filter((q) => q.type === filters.type);
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((q) => {
      const questionTags = q.tags || [];
      return filters.tags!.some((tag) => questionTags.includes(tag));
    });
  }

  if (filters.limit) {
    filtered = filtered.slice(0, filters.limit);
  }

  return filtered as Question[];
}

/**
 * Memoized question count by tag
 */
const tagCountCache = new Map<string, number>();

export function getQuestionCountByTag(tag: string): number {
  if (tagCountCache.has(tag)) {
    return tagCountCache.get(tag)!;
  }

  buildIndices();
  const count = tagIndex?.get(tag)?.length || 0;
  tagCountCache.set(tag, count);
  return count;
}

/**
 * Clear caches (useful for testing or when questions are updated)
 */
export function clearQuestionCaches(): void {
  tagIndex = null;
  criterionIndex = null;
  tagCountCache.clear();
}
