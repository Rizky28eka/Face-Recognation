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

const colorVariants = [
    {
        bg: 'bg-indigo-50',
        icon: 'text-indigo-600',
        border: 'border-indigo-100',
    },
    {
        bg: 'bg-emerald-50',
        icon: 'text-emerald-600',
        border: 'border-emerald-100',
    },
    { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-100' },
    { bg: 'bg-rose-50', icon: 'text-rose-600', border: 'border-rose-100' },
];

export default function StatCards({ stats }: Props) {
    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 px-4 lg:px-6">
            {stats.map((stat, index) => {
                // @ts-ignore - dynamic icon access
                const Icon = LucideIcons[stat.icon] || LucideIcons.HelpCircle;
                const color = colorVariants[index % colorVariants.length];
                return (
                    <Card
                        key={index}
                        className={`border ${color.border} shadow-sm hover:shadow-md transition-all duration-200`}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
                            <CardTitle className="text-xs font-medium text-muted-foreground leading-tight">
                                {stat.label}
                            </CardTitle>
                            <div
                                className={`${color.bg} p-1.5 rounded-lg shrink-0`}
                            >
                                <Icon className={`h-4 w-4 ${color.icon}`} />
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                            <div className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                                {stat.value}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
