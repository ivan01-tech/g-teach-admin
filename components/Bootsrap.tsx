"use client"

import { initUsersListener } from "@/app/dashboard/users/redux/users-thunks";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { listenToProfiles } from "@/app/dashboard/profiles/profiles-thunks";


export default function Bootstrap() {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const init = async () => {
            const resultAction = await dispatch(initUsersListener());
            if (initUsersListener.fulfilled.match(resultAction)) {
                unsubscribe = resultAction.payload as unknown as () => void;
            }

            const resultAction2 = await dispatch(listenToProfiles());
            if (listenToProfiles.fulfilled.match(resultAction2)) {
                unsubscribe = resultAction2.payload as unknown as () => void;
            }
        };

        init();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [dispatch])


    return null;
}