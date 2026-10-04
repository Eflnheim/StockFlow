import { Link } from '@inertiajs/react';
import {
    ChartNoAxesCombined,
    ClipboardList,
    Database,
    LayoutDashboard,
    Warehouse,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutDashboard,
    },
    {
        title: 'Master Data',
        href: '#',
        icon: Database,
        items: [
            {
                title: 'Ingredients',
                href: '/ingredients',
            },
            {
                title: 'Categories',
                href: '/ingredient-categories',
            },
            {
                title: 'Units',
                href: '/units',
            },
            {
                title: 'Suppliers',
                href: '/suppliers',
            },
        ],
    },
    {
        title: 'Inventory',
        href: '#',
        icon: Warehouse,
        items: [
            {
                title: 'Overview',
                href: '/inventory',
            },
            {
                title: 'Stock Movements',
                href: '/inventory/movements',
            },
        ],
    },
    {
        title: 'Operations',
        href: '#',
        icon: ClipboardList,
        items: [
            {
                title: 'Purchases',
                href: '/purchase-orders',
            },
            {
                title: 'Recipes',
                href: '/recipes',
            },
            {
                title: 'Sales',
                href: '/sales',
            },
        ],
    },
    {
        title: 'Reports',
        href: '/reports',
        icon: ChartNoAxesCombined,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}