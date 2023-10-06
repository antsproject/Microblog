import { useEffect } from "react";
// import Router from "next/router";
import useSWR from "swr";

export default function useUser() {
    // const fetcher = (...args) => fetch(...args).then(res => res.json());
    const { data, error, isLoading } = useSWR("/api/user");
    const user = data ? data.user : null;
    // console.log('SWR', user);
    useEffect(() => {
        if (!user)  return;
    }, [user]);
    return { user };
}
