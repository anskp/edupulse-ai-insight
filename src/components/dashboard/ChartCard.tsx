
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface ChartData {
  name: string;
  [key: string]: string | number;
}

interface ChartCardProps {
  title: string;
  description?: string;
  data: ChartData[];
  type?: 'bar' | 'line';
  series: {
    name: string;
    dataKey: string;
    color: string;
  }[];
  height?: number;
}

const ChartCard = ({
  title,
  description,
  data,
  type = 'bar',
  series,
  height = 300,
}: ChartCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="w-full" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            {type === 'bar' ? (
              <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {series.map((item) => (
                  <Bar 
                    key={item.name}
                    name={item.name}
                    dataKey={item.dataKey}
                    fill={item.color}
                  />
                ))}
              </BarChart>
            ) : (
              <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {series.map((item) => (
                  <Line
                    key={item.name}
                    name={item.name}
                    type="monotone"
                    dataKey={item.dataKey}
                    stroke={item.color}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
