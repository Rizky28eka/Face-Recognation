export interface Tenant {
    id: number;
    name: string;
    slug: string;
    address?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: 'superadmin' | 'owner' | 'karyawan';
    tenant_id?: number;
    tenant?: Tenant;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
