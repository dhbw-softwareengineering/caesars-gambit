"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useRouter} from "next/navigation";
import { useGetCurrentUser } from "@/components/api/getCurrentUser";

import { Item, ItemContent, ItemTitle, ItemDescription, ItemHeader } from "@/components/ui/item";

export default function SettingsPage() {
    const router = useRouter();
    const [name, setName] = useState("");

    const currentUser = useGetCurrentUser();

    useEffect(() => {
        if (currentUser?.username) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setName(currentUser.username);
        }
    }, [currentUser]);

    return (
        <main className="min-h-screen flex items-center justify-center bg-background p-6">
            <Item variant="outline" className="w-full max-w-lg bg-card shadow-xl p-6 flex flex-col gap-8">
                <ItemHeader className="border-b pb-4">
                    <h1 className="text-2xl font-bold tracking-tight">Einstellungen</h1>
                </ItemHeader>

                <div className="flex flex-col gap-6">
                    <section>
                        <ItemTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">Profil</ItemTitle>
                        <div className="flex gap-2">
                            <Input label="Anmelde- und Ingamename" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} placeholder="Dein Name" aria-label="Spielername" />
                            <Button variant="primary" type="button" className="w-auto px-6 self-end h-10">Speichern</Button>
                        </div>
                    </section>

                    <section>
                        <ItemTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">Spielerfarbe</ItemTitle>
                        <div className="flex items-center gap-3 p-1">
                            {['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500'].map((color) => (
                                <button 
                                    key={color}
                                    className={`${color} w-10 h-10 rounded-full shadow-sm hover:scale-110 transition-transform cursor-pointer ring-offset-2 focus:ring-2 focus:ring-primary`} 
                                    aria-label={color} 
                                />
                            ))}
                        </div>
                    </section>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="ghost" type="button" className="w-auto px-6 border-none" onClick={() => router.back()}>Abbrechen</Button>
                    <Button variant="destructive" type="button" className="w-auto px-6" onClick={async () => router.push("/mainmenu")}>Speichern & Schließen</Button>
                </div>
            </Item>
        </main>
    );
}