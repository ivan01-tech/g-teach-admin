"use client"

import { initUsersListener } from "@/app/dashboard/users/redux/users-thunks";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { listenToProfiles } from "@/app/dashboard/profiles/profiles-thunks";


export default function Bootstrap() {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const unsubscribes: (() => void)[] = [];

        const init = async () => {
            const resultAction = await dispatch(initUsersListener());
            if (initUsersListener.fulfilled.match(resultAction)) {
                unsubscribes.push(resultAction.payload as unknown as () => void);
            }

            const resultAction2 = await dispatch(listenToProfiles());
            if (listenToProfiles.fulfilled.match(resultAction2)) {
                unsubscribes.push(resultAction2.payload as unknown as () => void);
            }
        };

        init();

        return () => {
            unsubscribes.forEach(unsub => unsub());
        };
    }, [dispatch])


    return null;
}