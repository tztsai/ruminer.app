import React from "react";

import { styled } from "../../tokens/stitches.config";
import { Box } from "../elements/LayoutPrimitives";

const HeroWrapper = styled(Box, {
  width: "100%",
  // minHeight: "90vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "160px 0 20px 0",
  position: "relative",
  overflow: "hidden",
  textAlign: "center",
});

const HeroHeadline = styled("h1", {
  fontSize: "2.7rem",
  fontWeight: 800,
  lineHeight: 1.2,
  margin: "0 0 40px 0",
  color: "#FFFFFF",
  maxWidth: "900px",
  "& span": {
    color: "$ruminerYellow",
  },
  "@mdDown": {
    fontSize: "2rem",
  },
});

const HeroSubheadline = styled("p", {
  fontSize: "1.25rem",
  lineHeight: 1.6,
  margin: "0 0 45px 0",
  color: "#9A9A9A",
  maxWidth: "800px",
  "& strong": {
    color: "$ruminerYellow",
  },
  "& i": {
    color: "#DCDCDC",
    fontWeight: 500,
  },
});

const HeroBannerContainer = styled("div", {
  width: "100%",
  maxWidth: "900px",
  margin: "40px 0",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  // Ensures the container maintains aspect ratio
  "&::before": {
    content: '""',
    display: "block",
    paddingTop: "56.25%", // 16:9 aspect ratio (506.25/900 = 0.5625)
  },

  // This is a placeholder - would be replaced with actual animation
  // '&::after': {
  //     content: '"Data Flow Animation"',
  //     position: 'absolute',
  //     top: '50%',
  //     left: '50%',
  //     transform: 'translate(-50%, -50%)',
  //     color: 'rgba(247, 194, 45, 0.3)',
  //     fontSize: '1.5rem',
  //     fontWeight: 700,
  // }
});

export function HeroSection({ lang }: { lang: "en" | "zh" }): JSX.Element {
  const dikwItems =
    lang === "zh"
      ? [
          ["<strong>D</strong>ata:", "由您拥有！"],
          ["<strong>I</strong>nformation:", "与您相关！"],
          ["<strong>K</strong>nowledge:", "为您打造！"],
          ["<strong>W</strong>isdom:", "由您体现！"],
        ]
      : [
          ["<strong>D</strong>ata :", "owned by you!"],
          ["<strong>I</strong>nformation :", "relevant to you!"],
          ["<strong>K</strong>nowledge :", "built for you!"],
          ["<strong>W</strong>isdom :", "manifested in you!"],
        ];

  return (
    <HeroWrapper>
      <HeroHeadline>
        {lang === "zh"
          ? "Ruminer 守藏师：个人记忆助理"
          : "Ruminer: a Personal Memory Assistant"}
      </HeroHeadline>
    </HeroWrapper>
  );
}
