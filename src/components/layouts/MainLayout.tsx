import { logout } from "@/lib/api/auth";
import { me } from "@/lib/api/users";
import { TokenLocalStorage, User } from "@/lib/interfaces";
import { useUserStore } from "@/store";
import { getFullName } from "@/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { Skeleton } from "primereact/skeleton";
import React, { PropsWithChildren, useEffect, useRef } from "react";
import { useLocalStorage } from "usehooks-ts";
import Logo from "../common/Logo";

interface MainLayoutProps {
    className?: string;
    auth?: boolean;
}

interface NavLink {
    url: string;
    label: string;
    disabled?: boolean;
}

const LINKS: NavLink[] = [
    {
        url: "/listings",
        label: "Listings"
    },
    {
        url: "/community",
        label: "Community"
    },
    {
        url: "/events",
        label: "Events"
    }
];


export default function MainLayout({ className, auth, children }: PropsWithChildren<MainLayoutProps>) {
    
    const router = useRouter();
    const MENU_ITEMS: MenuItem[] = [
        {
            label: "Create listing",
            icon: "pi pi-plus",
            command: () => {
                router.push("/listings/new");
            }
        },
        {
            label: "My listings",
            icon: "pi pi-list",
            command: () => {
                router.push("/listings/me");
            }
        },
        {
            label: "My vehicles",
            icon: "pi pi-car",
            command: () => {
                router.push("/vehicles/me");
            }
        },
        {
            label: "My posts",
            icon: "pi pi-envelope",
            command: () => {
                router.push("/community/posts/me");
            }
        },
        {
            label: "Logout",
            icon: "pi pi-sign-out",
            command: () => {
                mutate();
            }
        }
    ];

    const client = useQueryClient();
    const { user, storeUser, clearUser } = useUserStore();
    const [_, __, clearToken] = useLocalStorage<TokenLocalStorage>("token", null);

    const { mutate, isPending } = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            clearToken();
            client.invalidateQueries();
            clearUser();
        },
    });

    const { data, isLoading, error } = useQuery<User, AxiosError>({
        queryKey: ["me"],
        queryFn: me,
        retry: false
    });

    const menuRef = useRef<Menu>(null);

    const onAvatarClick = (event: React.MouseEvent) => {
        menuRef.current?.toggle(event);
    }

    useEffect(() => {
        if (!isLoading && auth && !data) {
            router.push("/login");
        }
    }, [data, isLoading]);

    useEffect(() => {
        if (error && error.isAxiosError && error.response?.status === 401) {
            clearUser();
        } else if (data) {
            storeUser(data);
        }
    }, [data, error]);

    return (
        <div>
            <nav className="sticky top-0 w-full p-5 border-b border-neutral-300 bg-white z-10 flex justify-between items-center">
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3">
                        <Logo className="text-primary h-10 w-10" />
                        <h1 className="text-xl font-bold">RevvedUp</h1>
                    </div>
                    <ul className="flex items-center gap-5">
                        { LINKS.map(link => (
                            <li key={link.url} className="text-neutral-600 text-sm">
                                <Link href={link.url}>
                                    {link.label}
                                </Link>
                            </li>
                        )) }
                    </ul>
                </div>
                <div>
                    { !user
                        ? isLoading
                            ? <div className="flex gap-3 items-center">
                                <Skeleton width="5rem" />
                                <Skeleton size="2rem" />
                            </div>
                            : <Button size="small" link label="Sign in" onClick={() => router.push("/login")} />
                        : <div className="flex items-center gap-3">
                            <div>
                                <p className="text-gray-900 font-bold text-sm text-right">{getFullName(user)}</p>
                                <p className="text-gray-600 text-xs text-right">@{user.username}</p>
                            </div>
                            <Avatar label={user.firstname[0].toUpperCase()} size="normal" onClick={onAvatarClick}/>
                            <Menu model={MENU_ITEMS} ref={menuRef} popup />
                        </div>
                    }
                </div>
            </nav>
            <main className={`${className ?? ""} min-h-[calc(100vh-(5rem+1px))] pb-44 relative`}>
                { 
                    !auth || data
                        ? children
                        : <></>
                }
                <footer className="absolute bottom-0 right-0 w-full p-10 flex justify-center items-center gap-16">
                    <div className="flex items-center gap-3">
                        <Logo className="text-gray-500 h-14 w-14" />
                        <h1 className="text-lg font-bold text-gray-500">RevvedUp</h1>
                    </div>
                    <div>
                        <p className="text-gray-800 text-sm text-center">Designed & developed by <strong className="text-gray-900">Webforce</strong></p>
                        <p className="text-gray-800 text-sm text-center">Contact: <span className="text-gray-600">dd201@istaben.ma</span></p>
                    </div>
                </footer>
            </main>
        </div>
    );
}