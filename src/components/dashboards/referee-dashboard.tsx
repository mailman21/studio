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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Area, AreaChart } from 'recharts';
import { matchesData } from '@/types';
import { Activity, Gauge, HeartPulse, Trophy } from 'lucide-react';

const coachRatingsData = matchesData
    .filter(m => m.coachRating)
    .map(m => ({ match: m.teams, rating: m.coachRating! / 10 }))
    .slice(-5);

const chartConfigBar = {
  rating: {
    label: 'Rating',
    color: 'hsl(var(--primary))',
  },
};

const statTrendsData = matchesData.slice(-5).map(match => {
    return {
        match: match.teams,
        penalties: match.events.filter(e => e.type === 'Penalty').length,
        errors: match.events.filter(e => e.type === 'Error').length,
        scrums: match.events.filter(e => e.type === 'Scrum').length,
    }
});


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

const latestMatchWithGps = [...matchesData].reverse().find(m => m.gpsData);

const physicalChartConfig = {
  heartRate: {
    label: 'Heart Rate (bpm)',
    color: 'hsl(var(--destructive))',
  },
};

export function RefereeDashboard() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Dashboard" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Last Match Rating</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{coachRatingsData.slice(-1)[0]?.rating.toFixed(1) ?? 'N/A'} / 10</div>
                    <p className="text-xs text-muted-foreground">from coach feedback</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">8.2 km</div>
                    <p className="text-xs text-muted-foreground">in last match (simulated)</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Heart Rate</CardTitle>
                    <HeartPulse className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">145 bpm</div>
                    <p className="text-xs text-muted-foreground">in last match (simulated)</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Max Speed</CardTitle>
                    <Gauge className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">28.5 km/h</div>
                    <p className="text-xs text-muted-foreground">in last match (simulated)</p>
                </CardContent>
            </Card>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Coach Ratings</CardTitle>
              <CardDescription>
                Your performance ratings from coaches across recent matches.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfigBar} className="h-[300px] w-full">
                <BarChart accessibilityLayer data={coachRatingsData} margin={{ top: 20, right: 20, left: -10, bottom: 60 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="match"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    angle={-30}
                    textAnchor="end"
                    interval={0}
                    height={80}
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
                Key statistics trends over recent matches.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfigLine} className="h-[300px] w-full">
                <LineChart
                  accessibilityLayer
                  data={statTrendsData}
                  margin={{ top: 20, right: 20, left: -10, bottom: 60 }}
                >
                  <CartesianGrid vertical={false} />
                   <XAxis
                    dataKey="match"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    angle={-30}
                    textAnchor="end"
                    interval={0}
                    height={80}
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
        {latestMatchWithGps && latestMatchWithGps.gpsData && (
          <Card>
            <CardHeader>
              <CardTitle>Last Match Physical Performance</CardTitle>
              <CardDescription>
                Simulated heart rate data from {latestMatchWithGps.teams}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={physicalChartConfig} className="h-[200px] w-full">
                <AreaChart
                  data={latestMatchWithGps.gpsData}
                  margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="time"
                    tickFormatter={(value) => `${Math.floor(value / 60)}'`}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <YAxis domain={[100, 200]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    dataKey="heartRate"
                    type="monotone"
                    fill="var(--color-heartRate)"
                    fillOpacity={0.4}
                    stroke="var(--color-heartRate)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
