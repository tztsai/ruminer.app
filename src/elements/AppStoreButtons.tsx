import React from "react";
import { styled } from "../../tokens/stitches.config";
import { HStack } from "./LayoutPrimitives";

const AppStoreButtonWrapper = styled("a", {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  padding: "10px 20px",
  borderRadius: "8px",
  textDecoration: "none",
  transition: "all 0.2s ease",
  cursor: "pointer",
  width: "180px",
  height: "56px",

  "& img": {
    height: "32px",
    width: "32px",
    flexShrink: 0,
  },

  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
});

const AppleButton = styled(AppStoreButtonWrapper, {
  background: "#000000",
  border: "1px solid #000000",
  color: "#FFFFFF",
});

const GoogleButton = styled(AppStoreButtonWrapper, {
  background: "#FFFFFF",
  border: "1px solid #E0E0E0",
  color: "#000000",
});

const ButtonText = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  "& .subtitle": {
    fontSize: "10px",
    lineHeight: 1,
  },
  "& .title": {
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: 1.2,
  },
});

export function AppleAppStoreButton() {
  return (
    <AppleButton
      href="https://apps.apple.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src="https://upload.wikimedia.org/wikipedia/commons/4/46/Apple_Store_logo.svg" alt="Apple Logo" />
      <ButtonText>
        <span className="subtitle">Download on the</span>
        <span className="title">App Store</span>
      </ButtonText>
    </AppleButton>
  );
}

export function GooglePlayStoreButton() {
  return (
    <GoogleButton
      href="https://play.google.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_Play_2022_icon.svg" alt="Google Play Logo" />
      <ButtonText>
        <span className="subtitle">GET IT ON</span>
        <span className="title">Google Play</span>
      </ButtonText>
    </GoogleButton>
  );
}
