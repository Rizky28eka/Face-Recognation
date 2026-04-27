import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ChartTooltipContent } from '@/Components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartConfig } from '@/Components/ui/chart';

interface Props {
    data: { day: string; count: number }[];
}

const chartConfig = {
    count: {
        label: 'Kehadiran',
        color: '#6366f1',
    },
} satisfies ChartConfig;

export default function AttendanceChart({ data }: Props) {
    return (
        <Card className="mx-4 lg:mx-6 border-none shadow-sm">
            <CardHeader>
                <CardTitle>Statistik Kehadiran Mingguan</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <BarChart data={data}>
                        <XAxis
                            dataKey="day"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip content={<ChartTooltipContent hideLabel />} />
                        <Bar
                            dataKey="count"
                            fill="var(--color-count)"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
