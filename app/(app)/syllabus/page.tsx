"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  ExternalLink,
  Search,
  ChevronRight,
  Play,
} from "lucide-react";
import { getProgress, type UserProgress } from "@/lib/storage";
import topicsData from "@/content/topics.json";

export default function SyllabusPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const filteredTopics = topicsData.topics.filter(
    (topic) =>
      topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedTopics = topicsData.categories.map((category) => ({
    ...category,
    topics: filteredTopics.filter((t) => t.category === category.id),
  }));

  const getTopicMastery = (topicId: string): number => {
    return progress?.topics[topicId]?.mastery || 0;
  };

  const getCategoryMastery = (categoryId: string): number => {
    const categoryTopics = topicsData.topics.filter(
      (t) => t.category === categoryId
    );
    if (categoryTopics.length === 0) return 0;
    const total = categoryTopics.reduce(
      (sum, t) => sum + getTopicMastery(t.id),
      0
    );
    return Math.round(total / categoryTopics.length);
  };

  return (
    <div data-testid="syllabus-page">
      <PageHeader
        title="Syllabus Map"
        description="Explore topics aligned to PSR accreditation standards and track your mastery."
      />

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="topic-search"
        />
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {groupedTopics.map((category) => {
          const isExpanded = expandedCategory === category.id || searchQuery.length > 0;
          const categoryMastery = getCategoryMastery(category.id);

          if (category.topics.length === 0 && searchQuery) return null;

          return (
            <Card key={category.id} data-testid={`category-${category.id}`}>
              <CardHeader
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() =>
                  setExpandedCategory(
                    expandedCategory === category.id ? null : category.id
                  )
                }
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-lg truncate">{category.name}</CardTitle>
                      <p className="text-base text-muted-foreground mt-1 line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden md:block w-28 lg:w-32">
                      <div className="flex justify-between text-base mb-1 text-muted-foreground">
                        <span>{categoryMastery}% mastery</span>
                      </div>
                      <Progress value={categoryMastery} className="h-1.5" />
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {category.topics.length} topics
                    </Badge>
                    <ChevronRight
                      className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="space-y-3 border-t pt-4">
                    {category.topics.map((topic) => {
                      const mastery = getTopicMastery(topic.id);
                      return (
                        <div
                          key={topic.id}
                          className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          data-testid={`topic-${topic.id}`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{topic.name}</h3>
                              <Badge
                                variant={
                                  mastery >= 80
                                    ? "success"
                                    : mastery >= 50
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {mastery}%
                              </Badge>
                            </div>
                            <p className="text-base text-muted-foreground mb-2">
                              {topic.description}
                            </p>
                            {topic.subtopics && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {topic.subtopics.map((sub) => (
                                  <Badge
                                    key={sub}
                                    variant="outline"
                                  >
                                    {sub}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            {topic.officialResources && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {topic.officialResources.map((resource) => (
                                  <a
                                    key={resource.url}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-base text-primary hover:underline flex items-center gap-1"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    {resource.title}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                          <Link href={`/practice?topic=${topic.id}`}>
                            <Button variant="outline" size="sm" className="gap-1">
                              <Play className="h-3 w-3" />
                              Practice
                            </Button>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {filteredTopics.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium">No topics found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms.
          </p>
        </div>
      )}
    </div>
  );
}
