import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import * as LucideIcons from 'lucide-react';

interface Stat {
    label: string;
    value: string | number;
    icon: string;
}

interface Props {
    stats: Stat[];
}

export default function StatCards({ stats }: Props) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
            {stats.map((stat, index) => {
                // @ts-ignore - dynamic icon access
                const Icon = LucideIcons[stat.icon] || LucideIcons.HelpCircle;
                return (
                    <Card
                        key={index}
                        className="border-none shadow-sm bg-white/50 backdrop-blur-sm hover:shadow-md transition-all"
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.label}
                            </CardTitle>
                            <Icon className="h-4 w-4 text-indigo-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stat.value}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
