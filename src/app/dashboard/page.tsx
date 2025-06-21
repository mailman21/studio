'use client';

import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from 'recharts';

const coachRatingsData = [
  { match: 'Match 1', rating: 8.5 },
  { match: 'Match 2', rating: 7.8 },
  { match: 'Match 3', rating: 9.0 },
  { match: 'Match 4', rating: 8.2 },
  { match: 'Match 5', rating: 8.8 },
];

const chartConfigBar = {
  rating: {
    label: 'Rating',
    color: 'hsl(var(--primary))',
  },
};

const statTrendsData = [
  { match: 'Match 1', penalties: 8, errors: 3, scrums: 12 },
  { match: 'Match 2', penalties: 6, errors: 2, scrums: 10 },
  { match: 'Match 3', penalties: 5, errors: 1, scrums: 15 },
  { match: 'Match 4', penalties: 7, errors: 4, scrums: 11 },
  { match: 'Match 5', penalties: 4, errors: 2, scrums: 13 },
];

const chartConfigLine = {
  penalties: {
    label: 'Penalties',
    color: 'hsl(var(--chart-1))',
  },
  errors: {
    label: 'Errors',
    color: 'hsl(var(--chart-2))',
  },
  scrums: {
    label: 'Scrums',
    color: 'hsl(var(--chart-3))',
  },
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Dashboard" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Coach Ratings</CardTitle>
              <CardDescription>
                Your performance ratings from coaches over the last 5 matches.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfigBar} className="h-[250px] w-full">
                <BarChart accessibilityLayer data={coachRatingsData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="match"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis domain={[0, 10]} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="rating" fill="var(--color-rating)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Referee Stat Trends</CardTitle>
              <CardDescription>
                Key statistics trends over the last 5 matches.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfigLine} className="h-[250px] w-full">
                <LineChart
                  accessibilityLayer
                  data={statTrendsData}
                  margin={{ top: 20, right: 20, left: -10, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="match"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Line
                    dataKey="penalties"
                    type="monotone"
                    stroke="var(--color-penalties)"
                    strokeWidth={2}
                    dot={true}
                  />
                  <Line
                    dataKey="errors"
                    type="monotone"
                    stroke="var(--color-errors)"
                    strokeWidth={2}
                    dot={true}
                  />
                   <Line
                    dataKey="scrums"
                    type="monotone"
                    stroke="var(--color-scrums)"
                    strokeWidth={2}
                    dot={true}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
