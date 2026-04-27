import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';
import InputError from '@/Components/InputError';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface LoginFormProps extends React.ComponentPropsWithoutRef<'div'> {
    data: Record<string, any>;
    setData: (key: string, value: any) => void;
    errors: Record<string, string | undefined>;
    processing: boolean;
    submit: (e: React.FormEvent) => void;
    canResetPassword?: boolean;
}

export function LoginForm({
    className,
    data,
    setData,
    errors,
    processing,
    submit,
    canResetPassword,
    ...props
}: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-md">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight text-indigo-900">
                        Sikawan
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                        Masuk ke akun Anda untuk mengelola absensi
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit}>
                        <div className="flex flex-col gap-5">
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="email"
                                    className="text-gray-700"
                                >
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    className={cn(
                                        'bg-gray-50 border-gray-200',
                                        errors.email && 'border-red-500',
                                    )}
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <a
                                            href={route('password.request')}
                                            className="ml-auto inline-block text-xs text-indigo-600 hover:underline underline-offset-4"
                                        >
                                            Lupa password?
                                        </a>
                                    )}
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        className={cn(
                                            'bg-gray-50 border-gray-200 pr-10',
                                            errors.password && 'border-red-500',
                                        )}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    checked={data.remember}
                                    onCheckedChange={(checked) =>
                                        setData('remember', checked)
                                    }
                                />
                                <label
                                    htmlFor="remember"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600"
                                >
                                    Ingat saya
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 text-lg font-semibold transition-all duration-300 shadow-lg shadow-indigo-200"
                                disabled={processing}
                            >
                                {processing ? 'Memproses...' : 'Masuk'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="text-center text-xs text-gray-400">
                &copy; {new Date().getFullYear()} Sikawan Team. All rights
                reserved.
            </div>
        </div>
    );
}
