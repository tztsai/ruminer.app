import { PageMetaData } from "../../patterns/PageMetaData";
import { About } from "../../templates/About";

export default function LandingPage(): JSX.Element {
  return (
    <>
      <PageMetaData
        title="Ruminer"
        path="/"
        ogImage="/static/images/og-homepage.png"
        description="Ruminer是您个人收藏内容的AI管理员"
      />

      <About lang="zh" />
    </>
  );
}
