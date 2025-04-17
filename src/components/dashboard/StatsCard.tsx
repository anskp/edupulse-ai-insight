
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  change?: number;
  className?: string;
}

const StatsCard = ({
  title,
  value,
  description,
  icon,
  change,
  className,
}: StatsCardProps) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            
            {change !== undefined && (
              <div className={cn(
                'flex items-center text-xs font-medium',
                isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-muted-foreground'
              )}>
                {isPositive ? (
                  <TrendingUp className="mr-1 h-3 w-3" />
                ) : isNegative ? (
                  <TrendingDown className="mr-1 h-3 w-3" />
                ) : null}
                <span>{Math.abs(change)}% from previous</span>
              </div>
            )}
            
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          
          {icon && (
            <div className="p-2 bg-primary/10 text-primary rounded-full">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
