
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";

interface Badge {
  id: string;
  name: string;
  description: string;
  achieved_at: string;
}

interface AchievementsListProps {
  badges: Badge[];
  onInsertSampleData: () => void;
}

export const AchievementsList = ({ badges, onInsertSampleData }: AchievementsListProps) => {
  if (badges.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Award className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Achievements Yet</h3>
          <p className="text-center text-muted-foreground mb-4">
            You haven't earned any badges or achievements yet. Continue working hard to unlock achievements!
          </p>
          <Button onClick={onInsertSampleData}>Load Sample Achievements</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {badges.map((badge) => (
        <Card key={badge.id}>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-1">{badge.name}</h3>
            <p className="text-center text-muted-foreground mb-4">
              {badge.description}
            </p>
            <p className="text-xs text-muted-foreground">
              Earned on {new Date(badge.achieved_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
