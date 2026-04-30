import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/Components/ui/card';
import {
    ChartTooltipContent,
    ChartContainer,
    ChartConfig,
} from '@/Components/ui/chart';
import {
    Bar,
    BarChart,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';

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
    const maxVal = Math.max(...data.map((d) => d.count), 1);

    return (
        <Card className="mx-4 lg:mx-6 border-none shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle>Statistik Kehadiran Mingguan</CardTitle>
                <CardDescription>
                    Total kehadiran karyawan per hari dalam 7 hari terakhir
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[220px] md:h-[300px] px-2 pb-4">
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 4, right: 8, left: -8, bottom: 0 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#f0f0f0"
                            />
                            <XAxis
                                dataKey="day"
                                stroke="#888888"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                allowDecimals={false}
                                domain={[0, maxVal + 1]}
                                tickFormatter={(value) => `${value}`}
                                width={28}
                            />
                            <Tooltip
                                content={<ChartTooltipContent hideLabel />}
                                cursor={{ fill: '#f5f5ff', radius: 4 }}
                            />
                            <Bar
                                dataKey="count"
                                fill="var(--color-count)"
                                radius={[6, 6, 0, 0]}
                                maxBarSize={48}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
