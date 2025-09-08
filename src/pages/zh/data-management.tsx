import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { LoadingView } from "../../patterns/LoadingView";
import { PageMetaData } from "../../patterns/PageMetaData";
import { DataManagement } from "../../templates/DataManagement";

export default function DataManagementPageZh(): JSX.Element {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <PageMetaData
        title="数据管理 - Ruminer"
        path="/zh/data-management"
        description="管理您的个人数据和账户设置。"
      />

      {!mounted || !router.isReady ? (
        <LoadingView bgColor="#1A1A1A" />
      ) : (
        <DataManagement lang="zh" />
      )}
    </>
  );
}
