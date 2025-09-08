import React from "react";

import { styled } from "../../tokens/stitches.config";
import { VStack } from "../elements/LayoutPrimitives";
import { HeroSection } from "./HeroSection";
import { LandingFooter } from "./LandingFooter";
import { LandingHeader } from "./LandingHeader";
import { SolutionSection } from "./SolutionSection";

type LandingPageProps = {
  lang?: "en" | "zh";
};

const LandingPageWrapper = styled("div", {
  background: "#1A1A1A", // Dark background
  color: "#EDEDED", // Light text
  width: "100%",
  minHeight: "100vh",
});

// TODO implement scroll snap
const LandingContainer = styled(VStack, {
  width: "100%",
  maxWidth: "1440px",
  margin: "0 auto",
  padding: "0 24px",
  "@md": {
    padding: "0 48px",
  },
  "@lg": {
    padding: "0 80px",
  },
});

export function About({ lang = "en" }: LandingPageProps): JSX.Element {
  return (
    <LandingPageWrapper>
      <LandingHeader lang={lang} />

      <LandingContainer>
        <HeroSection lang={lang} />
        <SolutionSection lang={lang} />
      </LandingContainer>

      <LandingFooter lang={lang} />
    </LandingPageWrapper>
  );
}
