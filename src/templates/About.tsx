import React from "react";

import { styled } from "../../tokens/stitches.config";
import { VStack } from "../elements/LayoutPrimitives";
import { HeroSection } from "./HeroSection";
import { LandingFooter } from "./LandingFooter";
import { LandingHeader } from "./LandingHeader";

type LandingPageProps = {
  lang?: "en" | "zh";
};

const LandingPageWrapper = styled("div", {
  background: "linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)", // Gradient background
  color: "#EDEDED", // Light text
  width: "100%",
  minHeight: "100vh",
});

export function About({ lang = "en" }: LandingPageProps): JSX.Element {
  return (
    <LandingPageWrapper>
      <LandingHeader lang={lang} />
      <HeroSection lang={lang} />
      <LandingFooter lang={lang} />
    </LandingPageWrapper>
  );
}
