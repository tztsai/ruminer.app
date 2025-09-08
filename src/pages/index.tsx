import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { LoadingView } from "../patterns/LoadingView";
import { PageMetaData } from "../patterns/PageMetaData";
import { About } from "../templates/About";

export default function LandingPage(): JSX.Element {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <PageMetaData
        title="Ruminer"
        path="/"
        ogImage="/static/images/og-homepage.png"
        description="Ruminer is an AI librarian of your personal collections."
      />

      {!mounted || !router.isReady ? (
        <LoadingView bgColor="#FEFCF5" />
      ) : (
        <About lang="en" />
      )}
    </>
  );
}
