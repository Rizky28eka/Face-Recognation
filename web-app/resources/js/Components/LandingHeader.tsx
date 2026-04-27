import ApplicationLogo from '@/Components/ApplicationLogo';
import { Button } from '@/Components/ui/button';
import { Link, usePage } from '@inertiajs/react';

interface LandingHeaderProps {
    canLogin?: boolean;
    canRegister?: boolean;
}

export function LandingHeader({ canLogin, canRegister }: LandingHeaderProps) {
    const auth = usePage().props.auth;
    const user = auth?.user;

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between mx-auto px-4 lg:px-8">
                <Link href="/" className="flex items-center space-x-2">
                    <ApplicationLogo className="w-auto h-8" />
                </Link>

                <nav className="flex items-center gap-4">
                    {user ? (
                        <Link href={route('dashboard')}>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 font-medium">
                                Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <>
                            {canLogin && (
                                <Link href={route('login')}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="font-medium"
                                    >
                                        Masuk
                                    </Button>
                                </Link>
                            )}
                            {canRegister && (
                                <Link href={route('register')}>
                                    <Button
                                        size="sm"
                                        className="bg-indigo-600 hover:bg-indigo-700 font-medium"
                                    >
                                        Daftar Sekarang
                                    </Button>
                                </Link>
                            )}
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
