import React, { useState } from "react";
import { styled } from "../../tokens/stitches.config";
import { Box, VStack, HStack } from "../elements/LayoutPrimitives";
import { fetchEndpoint } from "../../lib/appConfig";
import { LandingHeader } from "./LandingHeader";
import { LandingFooter } from "./LandingFooter";

type DataManagementProps = {
    lang?: "en" | "zh";
};

const DataManagementWrapper = styled("div", {
    background: "linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)",
    color: "#EDEDED",
    width: "100%",
    minHeight: "100vh",
});

const MainContent = styled(Box, {
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "120px 24px 80px 24px",
    position: "relative",
    zIndex: 1,

    "@md": {
        padding: "140px 48px 80px 48px",
    },
    "@lg": {
        padding: "160px 80px 80px 80px",
    },
});

const PageTitle = styled("h1", {
    fontSize: "3rem",
    fontWeight: 900,
    lineHeight: 1.1,
    margin: "0 0 24px 0",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: "-0.02em",

    "@mdDown": {
        fontSize: "2.5rem",
    },
    "@smDown": {
        fontSize: "2rem",
    },
});

const PageDescription = styled("p", {
    fontSize: "1.2rem",
    lineHeight: 1.6,
    margin: "0 0 64px 0",
    color: "#B0B0B0",
    textAlign: "center",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",

    "@smDown": {
        fontSize: "1.1rem",
        margin: "0 0 48px 0",
    },
});

const SectionCard = styled(VStack, {
    padding: "48px",
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(20px)",
    marginBottom: "32px",
    transition: "all 0.3s ease",

    "&:hover": {
        background: "rgba(255, 255, 255, 0.05)",
        borderColor: "rgba(255, 255, 255, 0.12)",
    },

    "@mdDown": {
        padding: "36px",
    },
    "@smDown": {
        padding: "24px",
    },
});

const SectionTitle = styled("h2", {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#FFFFFF",
    margin: "0 0 16px 0",
    letterSpacing: "-0.01em",

    "@smDown": {
        fontSize: "1.5rem",
    },
});

const SectionText = styled("p", {
    fontSize: "1rem",
    lineHeight: 1.6,
    color: "#C0C0C0",
    margin: "0 0 32px 0",

    "& strong": {
        color: "#FFFFFF",
    },
});

const FormGroup = styled(VStack, {
    gap: "16px",
    width: "100%",
    marginBottom: "24px",
});

const Label = styled("label", {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#FFFFFF",
    marginBottom: "8px",
    display: "block",
});

const Input = styled("input", {
    width: "100%",
    padding: "14px 16px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    color: "#FFFFFF",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    fontFamily: "inherit",

    "&:focus": {
        outline: "none",
        borderColor: "rgba(247, 194, 45, 0.5)",
        background: "rgba(255, 255, 255, 0.08)",
        boxShadow: "0 0 0 2px rgba(247, 194, 45, 0.1)",
    },

    "&::placeholder": {
        color: "#898989",
    },
});

const Button = styled("button", {
    padding: "14px 24px",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "none",
    fontFamily: "inherit",
    position: "relative",
    overflow: "hidden",

    "&:disabled": {
        opacity: 0.6,
        cursor: "not-allowed",
        transform: "none",
    },

    variants: {
        variant: {
            primary: {
                background: "linear-gradient(135deg, #4169E1 0%, #6A7FFF 100%)",
                color: "#FFFFFF",

                "&:hover:not(:disabled)": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(65, 105, 225, 0.3)",
                },
            },
            danger: {
                background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                color: "#FFFFFF",

                "&:hover:not(:disabled)": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(239, 68, 68, 0.3)",
                },
            },
            secondary: {
                background: "rgba(255, 255, 255, 0.08)",
                color: "#FFFFFF",
                border: "1px solid rgba(255, 255, 255, 0.15)",

                "&:hover:not(:disabled)": {
                    background: "rgba(255, 255, 255, 0.12)",
                    transform: "translateY(-1px)",
                },
            },
        },
    },
});

const StatusMessage = styled("div", {
    fontSize: "0.9rem",
    padding: "12px 16px",
    borderRadius: "8px",
    marginTop: "16px",

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
            warning: {
                color: "#F59E0B",
                background: "rgba(245, 158, 11, 0.1)",
                border: "1px solid rgba(245, 158, 11, 0.2)",
            },
        },
    },
});

const ButtonGroup = styled(HStack, {
    gap: "16px",
    width: "100%",

    "@smDown": {
        flexDirection: "column",
    },
});

const WarningBox = styled(Box, {
    padding: "20px",
    background: "rgba(245, 158, 11, 0.1)",
    border: "1px solid rgba(245, 158, 11, 0.2)",
    borderRadius: "12px",
    marginBottom: "24px",

    "& p": {
        margin: "0",
        color: "#F59E0B",
        fontSize: "0.95rem",
        lineHeight: 1.5,
    },

    "& strong": {
        color: "#FBBF24",
    },
});

export function DataManagement({ lang = "en" }: DataManagementProps): JSX.Element {
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error" | "warning"; text: string } | null>(null);
    const [step, setStep] = useState<"initial" | "confirm" | "processing">("initial");

    const content = lang === "zh" ? {
        title: "数据管理",
        description: "管理您的个人数据和账户设置",
        dataExport: {
            title: "导出数据",
            description: "下载您存储在Ruminer中的所有个人数据的副本。",
            buttonText: "请求数据导出",
            successMessage: "数据导出请求已提交。我们将在24小时内将下载链接发送到您的邮箱。",
        },
        dataDelete: {
            title: "删除数据",
            description: "永久删除您在Ruminer中的所有个人数据。**此操作无法撤销。**",
            warningText: "**警告：**此操作将永久删除您的所有数据，包括保存的内容、标签、搜索历史和偏好设置。此操作无法撤销。",
            emailLabel: "请输入您的邮箱以确认删除",
            confirmEmailLabel: "再次输入您的邮箱",
            buttonText: "删除我的数据",
            successMessage: "数据删除请求已提交。您的所有数据将在72小时内被永久删除。",
        },
        accountDelete: {
            title: "删除账户",
            description: "永久删除您的Ruminer账户和所有相关数据。**此操作无法撤销。**",
            warningText: "**警告：**此操作将永久删除您的账户和所有相关数据。您将无法恢复对Ruminer服务的访问。",
            buttonText: "删除我的账户",
            successMessage: "账户删除请求已提交。您的账户和所有数据将在72小时内被永久删除。",
        },
        confirmStep: {
            title: "确认删除",
            description: "请仔细阅读并确认您要继续此操作。",
            confirmButton: "确认删除",
            cancelButton: "取消",
        },
        emailMismatch: "邮箱地址不匹配",
        invalidEmail: "请输入有效的邮箱地址",
        requestFailed: "请求失败，请稍后再试",
    } : {
        title: "Data Management",
        description: "Manage your personal data and account settings",
        dataExport: {
            title: "Export Your Data",
            description: "Download a copy of all your personal data stored in Ruminer.",
            buttonText: "Request Data Export",
            successMessage: "Data export request submitted. We'll send a download link to your email within 24 hours.",
        },
        dataDelete: {
            title: "Delete Your Data",
            description: "Permanently delete all your personal data from Ruminer. **This action cannot be undone.**",
            warningText: "**Warning:** This will permanently delete all your data including saved content, tags, search history, and preferences. This action cannot be undone.",
            emailLabel: "Enter your email to confirm data deletion",
            confirmEmailLabel: "Confirm your email",
            buttonText: "Delete My Data",
            successMessage: "Data deletion request submitted. All your data will be permanently deleted within 72 hours.",
        },
        accountDelete: {
            title: "Delete Your Account",
            description: "Permanently delete your Ruminer account and all associated data. **This action cannot be undone.**",
            warningText: "**Warning:** This will permanently delete your account and all associated data. You will lose access to Ruminer services forever.",
            buttonText: "Delete My Account",
            successMessage: "Account deletion request submitted. Your account and all data will be permanently deleted within 72 hours.",
        },
        confirmStep: {
            title: "Confirm Deletion",
            description: "Please read carefully and confirm you want to proceed with this action.",
            confirmButton: "Confirm Deletion",
            cancelButton: "Cancel",
        },
        emailMismatch: "Email addresses do not match",
        invalidEmail: "Please enter a valid email address",
        requestFailed: "Request failed. Please try again later.",
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleExportData = async () => {
        if (!email || !validateEmail(email)) {
            setMessage({ type: "error", text: content.invalidEmail });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch(`${fetchEndpoint}/data-management/export`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    language: lang,
                }),
            });

            if (!response.ok) {
                throw new Error("Export request failed");
            }

            setMessage({ type: "success", text: content.dataExport.successMessage });
            setEmail("");
        } catch (error) {
            console.error("Data export error:", error);
            setMessage({ type: "error", text: content.requestFailed });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteData = async () => {
        if (!email || !confirmEmail) {
            setMessage({ type: "error", text: content.invalidEmail });
            return;
        }

        if (!validateEmail(email)) {
            setMessage({ type: "error", text: content.invalidEmail });
            return;
        }

        if (email !== confirmEmail) {
            setMessage({ type: "error", text: content.emailMismatch });
            return;
        }

        if (step === "initial") {
            setStep("confirm");
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch(`${fetchEndpoint}/data-management/delete-data`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    language: lang,
                }),
            });

            if (!response.ok) {
                throw new Error("Delete request failed");
            }

            setMessage({ type: "success", text: content.dataDelete.successMessage });
            setEmail("");
            setConfirmEmail("");
            setStep("initial");
        } catch (error) {
            console.error("Data deletion error:", error);
            setMessage({ type: "error", text: content.requestFailed });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!email || !confirmEmail) {
            setMessage({ type: "error", text: content.invalidEmail });
            return;
        }

        if (!validateEmail(email)) {
            setMessage({ type: "error", text: content.invalidEmail });
            return;
        }

        if (email !== confirmEmail) {
            setMessage({ type: "error", text: content.emailMismatch });
            return;
        }

        if (step === "initial") {
            setStep("confirm");
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch(`${fetchEndpoint}/data-management/delete-account`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    language: lang,
                }),
            });

            if (!response.ok) {
                throw new Error("Account deletion request failed");
            }

            setMessage({ type: "success", text: content.accountDelete.successMessage });
            setEmail("");
            setConfirmEmail("");
            setStep("initial");
        } catch (error) {
            console.error("Account deletion error:", error);
            setMessage({ type: "error", text: content.requestFailed });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setStep("initial");
        setMessage(null);
        setEmail("");
        setConfirmEmail("");
    };

    return (
        <DataManagementWrapper>
            <LandingHeader lang={lang} />

            <MainContent>
                <PageTitle>{content.title}</PageTitle>
                <PageDescription>{content.description}</PageDescription>

                {/* Data Export Section */}
                <SectionCard>
                    <SectionTitle>{content.dataExport.title}</SectionTitle>
                    <SectionText>{content.dataExport.description}</SectionText>

                    <FormGroup>
                        <Label htmlFor="export-email">Email Address</Label>
                        <Input
                            id="export-email"
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormGroup>

                    <Button
                        variant="primary"
                        onClick={handleExportData}
                        disabled={loading}
                    >
                        {loading ? (lang === "zh" ? "处理中..." : "Processing...") : content.dataExport.buttonText}
                    </Button>
                </SectionCard>

                {/* Data Deletion Section */}
                <SectionCard>
                    <SectionTitle>{content.dataDelete.title}</SectionTitle>
                    <SectionText dangerouslySetInnerHTML={{ __html: content.dataDelete.description }} />

                    {step !== "confirm" && (
                        <WarningBox>
                            <p dangerouslySetInnerHTML={{ __html: content.dataDelete.warningText }} />
                        </WarningBox>
                    )}

                    {step === "confirm" ? (
                        <VStack css={{ gap: "24px" }}>
                            <SectionTitle>{content.confirmStep.title}</SectionTitle>
                            <SectionText>{content.confirmStep.description}</SectionText>
                            <ButtonGroup>
                                <Button variant="danger" onClick={handleDeleteData} disabled={loading}>
                                    {loading ? (lang === "zh" ? "处理中..." : "Processing...") : content.confirmStep.confirmButton}
                                </Button>
                                <Button variant="secondary" onClick={resetForm}>
                                    {content.confirmStep.cancelButton}
                                </Button>
                            </ButtonGroup>
                        </VStack>
                    ) : (
                        <VStack css={{ gap: "16px" }}>
                            <FormGroup>
                                <Label htmlFor="delete-email">{content.dataDelete.emailLabel}</Label>
                                <Input
                                    id="delete-email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="confirm-delete-email">{content.dataDelete.confirmEmailLabel}</Label>
                                <Input
                                    id="confirm-delete-email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={confirmEmail}
                                    onChange={(e) => setConfirmEmail(e.target.value)}
                                />
                            </FormGroup>

                            <Button
                                variant="danger"
                                onClick={handleDeleteData}
                                disabled={loading || !email || !confirmEmail}
                            >
                                {loading ? (lang === "zh" ? "处理中..." : "Processing...") : content.dataDelete.buttonText}
                            </Button>
                        </VStack>
                    )}
                </SectionCard>

                {/* Account Deletion Section */}
                <SectionCard>
                    <SectionTitle>{content.accountDelete.title}</SectionTitle>
                    <SectionText dangerouslySetInnerHTML={{ __html: content.accountDelete.description }} />

                    {step !== "confirm" && (
                        <WarningBox>
                            <p dangerouslySetInnerHTML={{ __html: content.accountDelete.warningText }} />
                        </WarningBox>
                    )}

                    {step === "confirm" ? (
                        <VStack css={{ gap: "24px" }}>
                            <SectionTitle>{content.confirmStep.title}</SectionTitle>
                            <SectionText>{content.confirmStep.description}</SectionText>
                            <ButtonGroup>
                                <Button variant="danger" onClick={handleDeleteAccount} disabled={loading}>
                                    {loading ? (lang === "zh" ? "处理中..." : "Processing...") : content.confirmStep.confirmButton}
                                </Button>
                                <Button variant="secondary" onClick={resetForm}>
                                    {content.confirmStep.cancelButton}
                                </Button>
                            </ButtonGroup>
                        </VStack>
                    ) : (
                        <VStack css={{ gap: "16px" }}>
                            <FormGroup>
                                <Label htmlFor="account-delete-email">{content.dataDelete.emailLabel}</Label>
                                <Input
                                    id="account-delete-email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="confirm-account-delete-email">{content.dataDelete.confirmEmailLabel}</Label>
                                <Input
                                    id="confirm-account-delete-email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={confirmEmail}
                                    onChange={(e) => setConfirmEmail(e.target.value)}
                                />
                            </FormGroup>

                            <Button
                                variant="danger"
                                onClick={handleDeleteAccount}
                                disabled={loading || !email || !confirmEmail}
                            >
                                {loading ? (lang === "zh" ? "处理中..." : "Processing...") : content.accountDelete.buttonText}
                            </Button>
                        </VStack>
                    )}
                </SectionCard>

                {message && (
                    <StatusMessage type={message.type}>
                        {message.text}
                    </StatusMessage>
                )}
            </MainContent>

            <LandingFooter lang={lang} />
        </DataManagementWrapper>
    );
}
