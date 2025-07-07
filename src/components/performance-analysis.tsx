'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ReferenceDot,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import {
  Upload,
  HeartPulse,
  Rabbit,
  Footprints,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  ShieldAlert,
  Zap,
  PlusCircle,
  ArrowLeftRight,
  Clock,
  BrainCircuit,
} from 'lucide-react';
import type { PastMatch, EventType, MatchEvent } from '@/types';

const gpsChartConfig = {
  heartRate: { label: 'Heart Rate', color: 'hsl(var(--destructive))' },
  speed: { label: 'Speed (km/h)', color: 'hsl(var(--chart-2))' },
};

const eventIcons: Record<EventType, React.ElementType> = {
  Penalty: ShieldAlert,
  Error: AlertTriangle,
  'Non-Decision': HelpCircle,
  Scrum: Zap,
  'Free-Kick': CheckCircle,
  'Positive HID': PlusCircle,
  Comment: MessageSquare,
  Lineout: ArrowLeftRight,
  L2M: Clock,
  HID: BrainCircuit,
};

const EventIconTooltip = ({
  event,
  children,
}: {
  event: MatchEvent;
  children: React.ReactNode;
}) => {
  return (
    <div className="relative group/icontooltip">
      {children}
      <div className="absolute bottom-full mb-2 w-48 p-2 text-xs bg-background border rounded-md shadow-lg opacity-0 group-hover/icontooltip:opacity-100 transition-opacity pointer-events-none z-10 -translate-x-1/2 left-1/2">
        <p className="font-bold">{`'${Math.floor(event.time / 60)} - ${
          event.type
        }`}</p>
        <p className="line-clamp-2">{event.description}</p>
      </div>
    </div>
  );
};

export function PerformanceAnalysis({
  match,
  onGpsUpload,
}: {
  match: PastMatch;
  onGpsUpload: (file: File) => void;
}) {
  const gpsFileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    gpsFileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onGpsUpload(file);
    }
  };

  if (!match.gpsData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Analysis</CardTitle>
          <CardDescription>
            Upload GPS data from a smartwatch to analyze physical performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted p-8 text-center">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">
              No GPS data available for this match.
            </p>
            <Button onClick={handleUploadClick}>Upload GPX/FIT File</Button>
            <input
              type="file"
              ref={gpsFileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".gpx,.fit"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = match.gpsData.map(p => ({
    ...p,
    speed: parseFloat((p.speed * 3.6).toFixed(1)),
  }));

  const avgHeartRate = Math.round(
    match.gpsData.reduce((acc, p) => acc + p.heartRate, 0) /
      match.gpsData.length
  );
  const maxSpeed = Math.max(...match.gpsData.map(p => p.speed));
  const totalDistance = 8.2; // Simulated

  const eventPositions = match.events.map(event => ({
    ...event,
    x: Math.random() * 85 + 7.5,
    y: Math.random() * 85 + 7.5,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Analysis</CardTitle>
        <CardDescription>
          Correlate match events with physical performance data from GPS.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="timeline">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timeline">Timeline Analysis</TabsTrigger>
            <TabsTrigger value="heatmap">Heatmap & Events</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-6">
                <div className="border rounded-lg p-4">
                    <Footprints className="mx-auto h-8 w-8 text-primary mb-2"/>
                    <p className="text-2xl font-bold">{totalDistance} km</p>
                    <p className="text-sm text-muted-foreground">Total Distance</p>
                </div>
                    <div className="border rounded-lg p-4">
                    <HeartPulse className="mx-auto h-8 w-8 text-destructive mb-2"/>
                    <p className="text-2xl font-bold">{avgHeartRate} bpm</p>
                    <p className="text-sm text-muted-foreground">Average Heart Rate</p>
                </div>
                    <div className="border rounded-lg p-4">
                    <Rabbit className="mx-auto h-8 w-8 text-chart-2 mb-2"/>
                    <p className="text-2xl font-bold">{(maxSpeed * 3.6).toFixed(1)} km/h</p>
                    <p className="text-sm text-muted-foreground">Max Speed</p>
                </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                Heart Rate, Speed, and Events Over Time
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                The dots on the chart represent key match events, corresponding to the timeline table below.
              </p>
              <ChartContainer
                config={gpsChartConfig}
                className="h-[400px] w-full"
              >
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 20, left: -10, bottom: 20 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="time"
                    type="number"
                    domain={['dataMin', 'dataMax']}
                    tickFormatter={value => `${Math.floor(value / 60)}'`}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    name="Time"
                  />
                  <YAxis
                    yAxisId="left"
                    domain={[100, 200]}
                    stroke="var(--color-heartRate)"
                    name="Heart Rate"
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 40]}
                    stroke="var(--color-speed)"
                    name="Speed"
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ strokeDasharray: '3 3' }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="heartRate"
                    stroke="var(--color-heartRate)"
                    strokeWidth={2}
                    dot={false}
                    name="Heart Rate"
                    unit=" bpm"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="speed"
                    stroke="var(--color-speed)"
                    strokeWidth={2}
                    dot={false}
                    name="Speed"
                    unit=" km/h"
                  />

                  {match.events.map(event => {
                     const eventDataPoint = match.gpsData?.find(p => p.time >= event.time);
                     if (!eventDataPoint) return null;

                    return (
                        <ReferenceDot
                            key={event.id}
                            x={event.time}
                            y={eventDataPoint.heartRate}
                            yAxisId="left"
                            r={6}
                            fill="hsl(var(--primary))"
                            stroke="hsl(var(--background))"
                            strokeWidth={2}
                        />
                    );
                  })}
                </LineChart>
              </ChartContainer>
            </div>
          </TabsContent>

          <TabsContent value="heatmap" className="mt-6">
            <div>
              <h4 className="font-semibold mb-2">
                Positional Heatmap with Event Locations
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Event locations are simulated on the pitch for visualization. Hover an icon for details.
              </p>
              <div className="aspect-[100/65] w-full border rounded-lg overflow-hidden relative bg-green-900/50">
                <Image
                  src="https://placehold.co/1000x650.png"
                  alt="Rugby field heatmap"
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint="rugby field heatmap"
                />
                <div className="absolute inset-0 bg-black/20" />

                {eventPositions.map(event => {
                  const Icon = eventIcons[event.type] || HelpCircle;
                  return (
                    <EventIconTooltip key={event.id} event={event}>
                      <div
                        className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 bg-background/80 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-primary cursor-pointer shadow-lg"
                        style={{ left: `${event.x}%`, top: `${event.y}%` }}
                      >
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                    </EventIconTooltip>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
