import { getProgress, getPracticeHistory } from "./storage";
import standardsData from "@/content/psras/standards.json";

export interface CriterionAnalytics {
  criterionId: string;
  label: string;
  mastery: number;
  questionsAnswered: number;
  correctAnswers: number;
  trend: "improving" | "declining" | "stable";
}

export interface WeakCriterion extends CriterionAnalytics {
  gap: number; // How far below target (80%)
}

export interface Recommendation {
  type: "focus" | "maintain" | "ready";
  criterionId: string;
  label: string;
  message: string;
  mastery: number;
}

/**
 * Get criteria with lowest mastery
 */
export function getWeakCriteria(limit: number = 5): WeakCriterion[] {
  const progress = getProgress();
  const weakCriteria: WeakCriterion[] = [];

  // Build criterion map from standards
  const criterionMap = new Map<string, { label: string; tags: string[] }>();
  for (const part of standardsData.parts) {
    for (const unit of part.units) {
      for (const outcome of unit.outcomes) {
        for (const criterion of outcome.criteria) {
          criterionMap.set(criterion.id, {
            label: criterion.label,
            tags: criterion.tags || [],
          });
        }
      }
    }
  }

  // Process progress data
  for (const [criterionId, criterionProgress] of Object.entries(progress.criterionProgress)) {
    const criterion = criterionMap.get(criterionId);
    if (!criterion) continue;

    const gap = Math.max(0, 80 - criterionProgress.mastery);
    if (gap > 0) {
      weakCriteria.push({
        criterionId,
        label: criterion.label,
        mastery: criterionProgress.mastery,
        questionsAnswered: criterionProgress.questionsAnswered,
        correctAnswers: criterionProgress.correctAnswers,
        trend: getCriterionTrend(criterionId),
        gap,
      });
    }
  }

  // Sort by gap (largest first), then by mastery (lowest first)
  weakCriteria.sort((a, b) => {
    if (b.gap !== a.gap) return b.gap - a.gap;
    return a.mastery - b.mastery;
  });

  return weakCriteria.slice(0, limit);
}

/**
 * Get criteria showing improvement trend
 */
export function getImprovingCriteria(): CriterionAnalytics[] {
  const progress = getProgress();
  const improving: CriterionAnalytics[] = [];

  const criterionMap = new Map<string, { label: string }>();
  for (const part of standardsData.parts) {
    for (const unit of part.units) {
      for (const outcome of unit.outcomes) {
        for (const criterion of outcome.criteria) {
          criterionMap.set(criterion.id, { label: criterion.label });
        }
      }
    }
  }

  for (const [criterionId, criterionProgress] of Object.entries(progress.criterionProgress)) {
    if (criterionProgress.questionsAnswered < 5) continue; // Need minimum data

    const trend = getCriterionTrend(criterionId);
    if (trend === "improving") {
      const criterion = criterionMap.get(criterionId);
      if (!criterion) continue;

      improving.push({
        criterionId,
        label: criterion.label,
        mastery: criterionProgress.mastery,
        questionsAnswered: criterionProgress.questionsAnswered,
        correctAnswers: criterionProgress.correctAnswers,
        trend: "improving",
      });
    }
  }

  // Sort by mastery improvement (highest first)
  improving.sort((a, b) => b.mastery - a.mastery);
  return improving.slice(0, 5);
}

/**
 * Get personalized study recommendations
 */
export function getRecommendations(): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const weakCriteria = getWeakCriteria(3);
  const improvingCriteria = getImprovingCriteria();

  // Focus recommendations (weak areas)
  weakCriteria.forEach((criterion) => {
    recommendations.push({
      type: "focus",
      criterionId: criterion.criterionId,
      label: criterion.label,
      message: `Focus on ${criterion.label} - currently at ${criterion.mastery}% mastery`,
      mastery: criterion.mastery,
    });
  });

  // Maintain recommendations (improving areas)
  improvingCriteria.slice(0, 2).forEach((criterion) => {
    recommendations.push({
      type: "maintain",
      criterionId: criterion.criterionId,
      label: criterion.label,
      message: `Keep practicing ${criterion.label} - you're improving!`,
      mastery: criterion.mastery,
    });
  });

  return recommendations;
}

/**
 * Calculate exam readiness score (0-100)
 */
export function getExamReadiness(): {
  score: number;
  readyCriteria: number;
  totalCriteria: number;
  ready: boolean;
} {
  const progress = getProgress();
  let totalCriteria = 0;
  let readyCriteria = 0;

  for (const part of standardsData.parts) {
    for (const unit of part.units) {
      for (const outcome of unit.outcomes) {
        for (const criterion of outcome.criteria) {
          totalCriteria++;
          const criterionProgress = progress.criterionProgress[criterion.id];
          if (criterionProgress && criterionProgress.mastery >= 80) {
            readyCriteria++;
          }
        }
      }
    }
  }

  const score = totalCriteria > 0 ? Math.round((readyCriteria / totalCriteria) * 100) : 0;
  const ready = score >= 80; // 80% of criteria at 80%+ mastery

  return { score, readyCriteria, totalCriteria, ready };
}

/**
 * Get trend for a criterion based on recent performance
 */
function getCriterionTrend(criterionId: string): "improving" | "declining" | "stable" {
  const history = getPracticeHistory();
  
  // Get recent sessions (last 10)
  const recentSessions = history.slice(0, 10);
  
  if (recentSessions.length < 3) return "stable";

  // Simple trend: if mastery is above 70% and there's recent activity, consider improving
  // For a more sophisticated approach, we'd track criterion-level performance over time
  const progress = getProgress();
  const criterionProgress = progress.criterionProgress[criterionId];
  
  if (!criterionProgress || criterionProgress.questionsAnswered < 5) return "stable";
  
  // If mastery is increasing and above 60%, consider improving
  if (criterionProgress.mastery >= 60) return "improving";
  
  // If mastery is very low, consider declining
  if (criterionProgress.mastery < 40) return "declining";
  
  return "stable";
}

/**
 * Get criterion analytics with full details
 */
export function getCriterionAnalytics(criterionId: string): CriterionAnalytics | null {
  const progress = getProgress();
  const criterionProgress = progress.criterionProgress[criterionId];
  
  if (!criterionProgress) return null;

  // Find criterion label
  let label = criterionId;
  for (const part of standardsData.parts) {
    for (const unit of part.units) {
      for (const outcome of unit.outcomes) {
        for (const criterion of outcome.criteria) {
          if (criterion.id === criterionId) {
            label = criterion.label;
            break;
          }
        }
      }
    }
  }

  return {
    criterionId,
    label,
    mastery: criterionProgress.mastery,
    questionsAnswered: criterionProgress.questionsAnswered,
    correctAnswers: criterionProgress.correctAnswers,
    trend: getCriterionTrend(criterionId),
  };
}

/**
 * Get all criteria analytics sorted by mastery
 */
export function getAllCriterionAnalytics(): CriterionAnalytics[] {
  const allCriteria: CriterionAnalytics[] = [];
  
  for (const part of standardsData.parts) {
    for (const unit of part.units) {
      for (const outcome of unit.outcomes) {
        for (const criterion of outcome.criteria) {
          const analytics = getCriterionAnalytics(criterion.id);
          if (analytics) {
            allCriteria.push(analytics);
          } else {
            // Include criteria with no progress yet
            allCriteria.push({
              criterionId: criterion.id,
              label: criterion.label,
              mastery: 0,
              questionsAnswered: 0,
              correctAnswers: 0,
              trend: "stable",
            });
          }
        }
      }
    }
  }

  // Sort by mastery (lowest first)
  allCriteria.sort((a, b) => a.mastery - b.mastery);
  
  return allCriteria;
}

/**
 * Get performance trends over time
 */
export function getPerformanceTrends(days: number = 7): {
  date: string;
  mastery: number;
  sessions: number;
}[] {
  const history = getPracticeHistory();
  const progress = getProgress();
  
  // Calculate average mastery per day
  const trends: { date: string; mastery: number; sessions: number }[] = [];
  const dateMap = new Map<string, { masterySum: number; count: number; sessions: number }>();
  
  // Get sessions within the time period
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const recentSessions = history.filter((session) => {
    const sessionDate = new Date(session.date);
    return sessionDate >= cutoffDate;
  });

  // Group by date
  recentSessions.forEach((session) => {
    const date = session.date.split("T")[0];
    if (!dateMap.has(date)) {
      dateMap.set(date, { masterySum: 0, count: 0, sessions: 0 });
    }
    const dayData = dateMap.get(date)!;
    dayData.sessions++;
  });

  // Calculate mastery for each day (simplified - actual would need per-day criterion data)
  // For now, return overall mastery per day
  const overallMastery = Object.values(progress.topics).length > 0
    ? Math.round(
        Object.values(progress.topics).reduce((sum, t) => sum + t.mastery, 0) /
        Object.values(progress.topics).length
      )
    : 0;

  // Build trends array
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const dayData = dateMap.get(dateStr) || { masterySum: 0, count: 0, sessions: 0 };
    
    trends.push({
      date: dateStr,
      mastery: overallMastery, // Simplified - in real app would track per-day
      sessions: dayData.sessions,
    });
  }

  return trends;
}
