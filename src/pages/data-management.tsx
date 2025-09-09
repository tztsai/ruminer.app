import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { LoadingView } from "../patterns/LoadingView";
import { PageMetaData } from "../patterns/PageMetaData";
import { DataManagement } from "../templates/DataManagement";

export default function DataManagementPage(): JSX.Element {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            <PageMetaData
                title="Data Management - Ruminer"
                path="/data-management"
                description="Manage your personal data and account settings."
            />

            {!mounted || !router.isReady ? (
                <LoadingView bgColor="#1A1A1A" />
            ) : (
                <DataManagement lang="en" />
            )}
        </>
    );
}
