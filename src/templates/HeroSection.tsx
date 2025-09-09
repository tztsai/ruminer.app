import React from "react";

import { styled } from "../../tokens/stitches.config";
import { Box, VStack } from "../elements/LayoutPrimitives";

const HeroWrapper = styled(Box, {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "180px 0 180px 0",
  position: "relative",
  overflow: "hidden",
  textAlign: "center",
  background: "radial-gradient(ellipse at center, #1F1F23 0%, #0F0F11 100%)",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(65, 105, 225, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(250, 218, 94, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.05) 0%, transparent 50%)
    `,
    pointerEvents: "none",
  },

  "@md": {
    padding: "140px 24px 140px 24px",
  },
  "@smDown": {
    padding: "120px 16px 120px 16px",
  },
});

const HeroHeadline = styled("h1", {
  fontSize: "4.5rem",
  fontWeight: 900,
  lineHeight: 1.05,
  margin: "0 0 40px 0",
  color: "#FADA5E",
  maxWidth: "950px",
  letterSpacing: "-0.02em",
  textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",

  "@mdDown": {
    fontSize: "3rem",
    lineHeight: 1.1,
  },
  "@smDown": {
    fontSize: "2.25rem",
  },
});

const HeroSubheadline = styled("p", {
  fontSize: "1.6rem",
  lineHeight: 1.5,
  margin: "0 0 56px 0",
  color: "#E0E0E0",
  maxWidth: "750px",
  fontWeight: 400,
  letterSpacing: "-0.01em",

  "& strong": {
    color: "#FADA5E",
    fontWeight: 600,
    textShadow: "0 2px 10px rgba(250, 218, 94, 0.2)",
  },

  "@mdDown": {
    fontSize: "1.35rem",
    margin: "0 0 48px 0",
  },
  "@smDown": {
    fontSize: "1.2rem",
    margin: "0 0 40px 0",
  },
});

const TaglineText = styled("div", {
  fontSize: "1.2rem",
  color: "#A0A0A0",
  fontStyle: "italic",
  marginBottom: "80px",
  maxWidth: "650px",
  fontWeight: 300,
  letterSpacing: "0.01em",
  lineHeight: 1.4,
});

const CapabilitiesGrid = styled(Box, {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "40px",
  maxWidth: "1300px",
  margin: "0 auto",
  position: "relative",
  zIndex: 2,

  "@md": {
    gridTemplateColumns: "1fr 1fr",
    gap: "48px",
  },
});

const CapabilityCard = styled(VStack, {
  padding: "56px 48px",
  background: "rgba(255, 255, 255, 0.03)",
  borderRadius: "32px",
  border: "1px solid rgba(65, 105, 225, 0.15)",
  backdropFilter: "blur(20px)",
  transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #4169E1 0%, #FADA5E 100%)",
    opacity: 0,
    transition: "opacity 0.4s ease",
  },

  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "radial-gradient(circle at 50% 0%, rgba(65, 105, 225, 0.05) 0%, transparent 50%)",
    opacity: 0,
    transition: "opacity 0.4s ease",
    pointerEvents: "none",
  },

  "&:hover": {
    transform: "translateY(-12px)",
    borderColor: "rgba(65, 105, 225, 0.3)",
    background: "rgba(255, 255, 255, 0.06)",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2), 0 0 40px rgba(65, 105, 225, 0.1)",

    "&::before": {
      opacity: 1,
    },

    "&::after": {
      opacity: 1,
    },

    "& .capability-icon": {
      transform: "scale(1.15) rotate(5deg)",
      color: "#FADA5E",
      filter: "drop-shadow(0 4px 12px rgba(250, 218, 94, 0.3))",
    },
  },

  "& .capability-header": {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    width: "100%",
    marginBottom: "32px",

    "@smDown": {
      flexDirection: "column",
      gap: "16px",
      alignItems: "center",
      textAlign: "center",
    },
  },

  "& .capability-icon": {
    width: "64px",
    height: "64px",
    color: "#4169E1",
    flexShrink: 0,
    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    filter: "drop-shadow(0 2px 8px rgba(65, 105, 225, 0.2))",
  },

  "& h3": {
    fontSize: "1.9rem",
    fontWeight: 700,
    color: "#FFFFFF",
    margin: "16px 8px",
    lineHeight: 1.2,
    letterSpacing: "-0.01em",
  },

  "& .capability-description": {
    fontSize: "1.15rem",
    lineHeight: 1.6,
    color: "#D0D0D0",
    margin: "0 0 20px 0",
    fontWeight: 400,
  },

  "& .capability-features": {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "16px",
  },

  "& .feature-tag": {
    padding: "6px 12px",
    background: "rgba(65, 105, 225, 0.12)",
    borderRadius: "24px",
    color: "#FFFFFF",
    fontSize: "0.8rem",
    fontWeight: 600,
    border: "1px solid rgba(250, 218, 94, 0.25)",
    transition: "all 0.3s ease",
    letterSpacing: "0.01em",

    "&:hover": {
      background: "rgba(65, 105, 225, 0.6)",
      borderColor: "rgba(250, 218, 94, 0.4)",
      transform: "translateY(-1px)",
    },
  },

  "@mdDown": {
    padding: "48px 40px",
  },
  "@smDown": {
    padding: "40px 32px",
  },
});

// Icon components
const CaptureIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="capability-icon">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="capability-icon">
    <path d="M21 21L15 15L21 21ZM17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 7C8.34315 7 7 8.34315 7 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export function HeroSection({ lang }: { lang: "en" | "zh" }): JSX.Element {
  const content = lang === "zh" ? {
    headline: "Ruminer 守藏史",
    subheadline: "將散亂的數字記憶轉化為<strong>統一的、可搜索的智能知識庫</strong>",
    // tagline: "为思考者、阅读者和创作者而设计",
    tagline: "為思想活躍者輕鬆捕捉和整理想法及信息",
    capabilities: [
      {
        title: "轻松捕获 & 整理",
        description: "持续导入截图、书签、高亮和社交帖子内容。多模态AI从图像和文本中提取洞察。AI自动标记和连接内容。",
        features: ["智能截图识别", "自动标记", "层级组织", "思维线程"]
      },
      {
        title: "强大搜索 & 摘要",
        description: "即时关键词搜索和语义搜索。向AI提问任何问题，获得带有相关记录引用的综合答案。按日期、标签、创建者和媒体类型过滤。",
        features: ["语义搜索", "AI问答", "智能过滤", "每日摘要"]
      }
    ]
  } : {
    headline: "Ruminer 守藏史",
    subheadline: "Transform scattered digital memories into an <strong>integrated, searchable, intelligent knowledge base</strong>",
    tagline: "For active minds who catch ideas faster than they can organize",
    capabilities: [
      {
        title: "Frictionless Integration",
        description: "Continuously imports content from screenshots, bookmarks, highlights, and social posts. Multimodal AI extracts insights from images and text. AI automatically labels and connects content.",
        features: ["Screenshot OCR", "Continuous Import", "Auto-tagging", "Hierarchical Spaces", "Thought Threads"]
      },
      {
        title: "Insightful Rumination",
        description: "Instant keyword & semantic search with versatile filters. Ask AI any question and get a fact-based answer with a list of cited records. Resurface forgotten insights via daily digests and thread follow-ups.",
        features: ["AI Search Agent", "Report with Citations", "Mindmap Synthesis", "Daily Digest", "Flashcard Review"]
      }
    ]
  };

  return (
    <HeroWrapper>
      <HeroHeadline>
        {content.headline}
      </HeroHeadline>

      <HeroSubheadline
        dangerouslySetInnerHTML={{ __html: content.subheadline }}
      />

      <TaglineText>
        {content.tagline}
      </TaglineText>

      <CapabilitiesGrid>
        <CapabilityCard>
          <div className="capability-header">
            <CaptureIcon />
            <h3>{content.capabilities[0].title}</h3>
          </div>
          <div className="capability-description">
            {content.capabilities[0].description}
          </div>
          <div className="capability-features">
            {content.capabilities[0].features.map((feature, index) => (
              <span key={index} className="feature-tag">{feature}</span>
            ))}
          </div>
        </CapabilityCard>

        <CapabilityCard>
          <div className="capability-header">
            <SearchIcon />
            <h3>{content.capabilities[1].title}</h3>
          </div>
          <div className="capability-description">
            {content.capabilities[1].description}
          </div>
          <div className="capability-features">
            {content.capabilities[1].features.map((feature, index) => (
              <span key={index} className="feature-tag">{feature}</span>
            ))}
          </div>
        </CapabilityCard>
      </CapabilitiesGrid>
    </HeroWrapper>
  );
}
