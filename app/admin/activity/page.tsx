import { ActivityBoardClient } from "./ActivityBoardClient";

export const metadata = {
  title: "Activity Board | PSR Training Academy",
  description: "View user activity and session information",
};

export default function ActivityBoardPage() {
  return <ActivityBoardClient />;
}
