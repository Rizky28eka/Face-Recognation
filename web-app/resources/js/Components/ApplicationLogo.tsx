import { ShieldCheck } from 'lucide-react';
import { SVGAttributes } from 'react';

export default function ApplicationLogo(_props: SVGAttributes<SVGElement>) {
    return (
        <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
                <ShieldCheck className="w-6 h-6 text-white" />
            </div>
        </div>
    );
}
