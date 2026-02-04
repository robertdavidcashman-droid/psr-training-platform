import { redirect } from "next/navigation";

export const metadata = {
  title: "PSR Training Academy - Police Station Representative Accreditation Training",
  description: "Master the skills and knowledge for PSR accreditation. Practice questions, mock exams, and scenario-based training aligned to SRA PSRAS standards.",
};

export default async function HomePage() {
  // No authentication required - redirect straight to dashboard
  redirect("/dashboard");
}
