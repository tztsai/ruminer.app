import React, { useState } from "react";
import Link from "next/link";

import { styled } from "../../tokens/stitches.config";
import { fetchEndpoint } from "../../lib/appConfig";
import { RuminerFullLogo } from "../elements/icons/RuminerFullLogo";
import { TwitterIcon } from "../elements/icons/TwitterIcon";
import { GitHubIcon } from "../elements/icons/GitHubIcon";
import { DiscordIcon } from "../elements/icons/DiscordIcon";
import { Box, HStack, VStack } from "../elements/LayoutPrimitives";
const FooterWrapper = styled(Box, {
  width: "100%",
  padding: "80px 24px 60px 24px",
  background: "linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 50%, #161616 100%)",
  borderTop: "1px solid rgba(247, 194, 45, 0.15)",
  position: "relative",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "1px",
    background: "linear-gradient(90deg, transparent 0%, rgba(247, 194, 45, 0.3) 50%, transparent 100%)",
  },

  "@md": {
    padding: "80px 48px 60px 48px",
  },
  "@lg": {
    padding: "100px 80px 60px 80px",
  },
});

const FooterContent = styled(Box, {
  maxWidth: "1440px",
  margin: "0 auto",
});

const FooterColumns = styled(Box, {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: "48px",
  alignItems: "start",
  marginBottom: "60px",

  "@sm": {
    gridTemplateColumns: "1fr auto",
    gap: "40px",
  },

  "@md": {
    gridTemplateColumns: "1fr auto",
    gap: "80px",
  },
});

const FooterColumn = styled(VStack, {
  gap: "16px",
  alignItems: "flex-start",

  "& h3": {
    fontSize: "1.125rem",
    fontWeight: 700,
    color: "$ruminerYellow",
    margin: "0 0 12px 0",
    letterSpacing: "-0.02em",
  },
});

const FooterDescription = styled("p", {
  color: "#B0B0B0",
  fontSize: "1rem",
  lineHeight: 1.7,
  margin: "16px",
  fontWeight: 400,
});

const LogoSocialContainer = styled("div", {
  display: "flex",
  flexDirection: "row",
  gap: "32px",
  width: "100%",
  alignItems: "center",

  "@sm": {
    gap: "40px",
  },

  "@md": {
    gap: "48px",
  },

  "@smDown": {
    flexDirection: "column",
    gap: "16px",
  },
});

const SocialLinks = styled(HStack, {
  gap: "20px",
  width: "fit-content",
  margin: "0",
});

const SocialLink = styled(Link, {
  color: "#898989",
  transition: "all 0.3s ease",
  padding: "8px",
  borderRadius: "8px",
  background: "rgba(255, 255, 255, 0.02)",
  border: "1px solid rgba(255, 255, 255, 0.05)",

  "&:hover": {
    color: "$ruminerYellow",
    background: "rgba(247, 194, 45, 0.1)",
    border: "1px solid rgba(247, 194, 45, 0.2)",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(247, 194, 45, 0.15)",
  },

  "& svg": {
    width: "24px",
    height: "24px",
    display: "block",
  },
});

const NewsletterForm = styled("form", {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  width: "100%",
  marginTop: "10px",

  "@md": {
    maxWidth: "400px",
  },
});

const EmailInput = styled("input", {
  padding: "14px 16px",
  background: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "8px",
  color: "#FFFFFF",
  fontSize: "0.9rem",
  transition: "all 0.3s ease",
  fontFamily: "inherit",

  "&:focus": {
    outline: "none",
    borderColor: "rgba(247, 194, 45, 0.5)",
    background: "rgba(255, 255, 255, 0.05)",
    boxShadow: "0 0 0 2px rgba(247, 194, 45, 0.1)",
  },

  "&::placeholder": {
    color: "#898989",
  },
});

const SubscribeButton = styled("button", {
  padding: "14px 20px",
  background: "linear-gradient(135deg, $ruminerYellow 0%, #E0B129 100%)",
  border: "none",
  borderRadius: "8px",
  color: "#1A1A1A",
  fontSize: "0.9rem",
  fontWeight: 700,
  cursor: "pointer",
  transition: "all 0.3s ease",
  fontFamily: "inherit",
  position: "relative",
  overflow: "hidden",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
    transition: "left 0.5s ease",
  },

  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: "0 6px 20px rgba(247, 194, 45, 0.3)",

    "&::before": {
      left: "100%",
    },
  },

  "&:active": {
    transform: "translateY(0)",
  },

  "&:disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
    transform: "none",

    "&:hover": {
      transform: "none",
      boxShadow: "none",
    },
  },
});

const Copyright = styled("p", {
  color: "#898989",
  fontSize: "0.8rem",
  textAlign: "center",
  margin: "60px 0 0 0",
  padding: "24px 0 0 0",
  borderTop: "1px solid rgba(255, 255, 255, 0.05)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",

  "@sm": {
    flexDirection: "row",
    justifyContent: "center",
    gap: "80px",
  },
});

const LegalLink = styled(Link, {
  color: "#898989",
  textDecoration: "none",
  fontSize: "0.8rem",
  transition: "color 0.3s ease",

  "&:hover": {
    color: "$ruminerYellow",
  },
});

const StatusMessage = styled("div", {
  fontSize: "0.85rem",
  padding: "8px 12px",
  borderRadius: "6px",
  marginTop: "8px",

  variants: {
    type: {
      success: {
        color: "#10B981",
        background: "rgba(16, 185, 129, 0.1)",
        border: "1px solid rgba(16, 185, 129, 0.2)",
      },
      error: {
        color: "#EF4444",
        background: "rgba(239, 68, 68, 0.1)",
        border: "1px solid rgba(239, 68, 68, 0.2)",
      },
    },
  },
});

export function LandingFooter({ lang }: { lang: "en" | "zh" }): JSX.Element {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Send the data to our API endpoint
      const response = await fetch(`${fetchEndpoint}/waitlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          feedback: feedback.trim(),
          date: new Date().toISOString().split("T")[0],
          language: lang,
        }),
      });

      console.log("Waitlist API response:", response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to join waitlist");
      }

      setIsSubmitted(true);
      setEmail("");
      setFeedback("");
    } catch (err) {
      console.error("Waitlist submission error:", err);
      setError(
        lang === "zh"
          ? "提交失败，请稍后再试。"
          : "Submission failed. Please try again later.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = (
    <SocialLinks>
      <SocialLink href="https://twitter.com/ruminer_app" aria-label="Twitter">
        <TwitterIcon />
      </SocialLink>
      {/* <SocialLink href="https://github.com/atmaware" aria-label="GitHub"> */}
      <SocialLink href="#github" aria-label="GitHub">
        <GitHubIcon />
      </SocialLink>
      <SocialLink href="#discord" aria-label="Discord">
        <DiscordIcon />
      </SocialLink>
    </SocialLinks>
  );

  return (
    <FooterWrapper>
      <FooterContent>
        <FooterColumns>
          <FooterColumn>
            <LogoSocialContainer>
              <RuminerFullLogo href="/" />
              {socialLinks}
            </LogoSocialContainer>
            <FooterDescription>
              {lang === "zh"
                ? "Ruminer（守藏师）是您的数字记忆助理。"
                : "Ruminer is your cyber memory assistant."}
            </FooterDescription>
          </FooterColumn>

          <NewsletterForm onSubmit={handleSubmit}>
            <EmailInput
              type="email"
              placeholder={lang === 'zh' ? '您的电子邮件地址' : 'Your email address'}
              aria-label={lang === 'zh' ? '电子邮件' : 'Email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <SubscribeButton
              type="submit"
              disabled={isSubmitting || !email.trim()}
            >
              {isSubmitting
                ? (lang === 'zh' ? '提交中...' : 'Submitting...')
                : (lang === 'zh' ? '订阅邮件推送' : 'Subscribe to Newsletter')
              }
            </SubscribeButton>

            {isSubmitted && (
              <StatusMessage type="success">
                {lang === "zh"
                  ? "感谢您的订阅！我们会及时向您发送更新。"
                  : "Thanks for subscribing! We'll keep you updated."
                }
              </StatusMessage>
            )}

            {error && (
              <StatusMessage type="error">
                {error}
              </StatusMessage>
            )}
          </NewsletterForm>
        </FooterColumns>

        <Copyright>
          <span>
            © Atmaware 2025 |{" "}
            {lang === "zh" ? "版权所有" : "All Rights Reserved"}
          </span>
          <span>
            <LegalLink href="/terms">
              {lang === "zh" ? "服务条款" : "Terms of Service"}
            </LegalLink>
            {" • "}
            <LegalLink href="/privacy">
              {lang === "zh" ? "隐私政策" : "Privacy Policy"}
            </LegalLink>
          </span>
        </Copyright>
      </FooterContent>
    </FooterWrapper>
  );
}
