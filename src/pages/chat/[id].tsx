import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const DEFAULT_API_BASE = 'https://api.atmaware.cn';

type MessageRole = 'user' | 'assistant';

interface ChatMessage {
	role: MessageRole;
	content: string;
}

interface ConversationData {
	id: string;
	userId?: string;
	messages: ChatMessage[];
	lastMessage?: string;
	expiresAt: number;
	createdAt: number;
}

export default function ChatPage() {
	const [conversation, setConversation] = useState<ConversationData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [continuing, setContinuing] = useState(false);
	const [continueResponse, setContinueResponse] = useState<string | null>(null);
	const [continueError, setContinueError] = useState<string | null>(null);

	// Determine API base based on environment
	const apiBase = useMemo(() => {
		const configured = process.env.NEXT_PUBLIC_API_BASE;
		if (configured) return configured;
		if (typeof window !== 'undefined') {
			const host = window.location.hostname;
			if (host === 'localhost' || host === '127.0.0.1') {
				return 'http://localhost:8080';
			}
		}
		return DEFAULT_API_BASE;
	}, []);

	const conversationId = typeof window !== 'undefined'
		? window.location.pathname.split('/').filter(p => p).pop() || ''
		: '';

	const dataUrl = `${apiBase}/chat/${conversationId}`;
	const continueUrl = `${apiBase}/chat/${conversationId}/continue`;

	// Fetch conversation data
	useEffect(() => {
		if (!conversationId) {
			setError('无效的对话链接');
			setLoading(false);
			return;
		}

		const fetchConversation = async () => {
			try {
				const response = await fetch(dataUrl, {
					headers: { 'Accept': 'application/json' }
				});

				if (!response.ok) {
					if (response.status === 404) {
						setError('对话已过期或不存在');
					} else {
						setError('获取对话失败');
					}
					setLoading(false);
					return;
				}

				const data: ConversationData = await response.json();
				setConversation(data);
				setLoading(false);
			} catch (err) {
				console.error('Failed to fetch conversation:', err);
				setError('网络错误，请重试');
				setLoading(false);
			}
		};

		fetchConversation();
	}, [conversationId, dataUrl]);

	// Handle continue button click
	const handleContinue = async () => {
		setContinuing(true);
		setContinueError(null);
		setContinueResponse(null);

		try {
			const response = await fetch(continueUrl, {
				method: 'POST',
				headers: { 'Accept': 'application/json' }
			});

			if (!response.ok) {
				throw new Error(`Continue failed: ${response.status}`);
			}

			const data = await response.json();
			if (data.error) {
				setContinueError(data.error);
			} else if (data.response) {
				setContinueResponse(data.response);
			}
		} catch (err) {
			console.error('Failed to continue:', err);
			setContinueError(err instanceof Error ? err.message : '继续对话失败');
		} finally {
			setContinuing(false);
		}
	};

	// Format time for display
	const formatTime = (timestamp: number) => {
		try {
			const date = new Date(timestamp);
			return date.toLocaleString('zh-CN', {
				hour: '2-digit',
				minute: '2-digit',
			});
		} catch {
			return '';
		}
	};

	// Format expiry time
	const formatExpiryTime = (timestamp: number) => {
		try {
			const date = new Date(timestamp);
			return date.toLocaleTimeString('zh-CN', {
				hour: '2-digit',
				minute: '2-digit',
			});
		} catch {
			return '';
		}
	};

	// Check if expired
	const isExpired = conversation ? Date.now() > conversation.expiresAt : false;

	// Component for rendering markdown content in messages
	const MarkdownMessage = ({ content, isIncoming = false }: { content: string; isIncoming?: boolean }) => (
		<div className={isIncoming ? 'markdown-message-incoming' : 'markdown-message-outgoing'}>
			<ReactMarkdown remarkPlugins={[remarkGfm]}>
				{content}
			</ReactMarkdown>
		</div>
	);

	return (
		<>
			<Head>
				<title>对话记录 - Ruminer</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>

			<style jsx global>{`
				@keyframes spin {
					to { transform: rotate(360deg); }
				}
			`}</style>

			<style jsx>{`
				.container {
					max-width: 600px;
					margin: 0 auto;
					background: var(--card-bg, #fff);
					border-radius: 12px;
					box-shadow: 0 2px 20px rgba(0,0,0,0.08);
					overflow: hidden;
					min-height: 100vh;
					display: flex;
					flex-direction: column;
				}

				.header {
					background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
					color: #fff;
					padding: 24px;
				}

				.header h1 {
					font-size: 20px;
					font-weight: 600;
					margin: 0 0 8px 0;
					display: flex;
					align-items: center;
					gap: 8px;
				}

				.notice {
					font-size: 13px;
					background: rgba(255,255,255,0.2);
					padding: 8px 12px;
					border-radius: 6px;
				}

				.notice.expired {
					background: rgba(255,152,0,0.3);
				}

				.messages {
					flex: 1;
					padding: 20px;
					display: flex;
					flex-direction: column;
					gap: 16px;
				}

				.message {
					display: flex;
					flex-direction: column;
					gap: 4px;
				}

				.message-role {
					font-size: 12px;
					color: #666;
					padding: 0 4px;
				}

				.message-content {
					padding: 12px 16px;
					border-radius: 12px;
					word-wrap: break-word;
					line-height: 1.6;
					font-size: 15px;
				}

				.user-message .message-content {
					background: #007AFF;
					color: white;
					align-self: flex-end;
					margin-left: 40px;
				}

				.user-message .message-role {
					text-align: right;
				}

				.assistant-message .message-content {
					background: #f0f0f0;
					color: #333;
					align-self: flex-start;
					margin-right: 40px;
				}

				/* Markdown styles for chat messages */
				.markdown-message-incoming :global(p),
				.markdown-message-outgoing :global(p) {
					margin: 0;
				}

				.markdown-message-incoming :global(p:not(:last-child)),
				.markdown-message-outgoing :global(p:not(:last-child)) {
					margin-bottom: 0.5em;
				}

				.markdown-message-incoming :global(ul),
				.markdown-message-incoming :global(ol),
				.markdown-message-outgoing :global(ul),
				.markdown-message-outgoing :global(ol) {
					margin: 0.5em 0;
					padding-left: 1.2em;
				}

				.markdown-message-incoming :global(li),
				.markdown-message-outgoing :global(li) {
					margin-bottom: 0.2em;
				}

				.markdown-message-incoming :global(code) {
					background: rgba(0, 0, 0, 0.08);
					padding: 2px 6px;
					border-radius: 3px;
					font-size: 0.9em;
					font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
				}

				.markdown-message-outgoing :global(code) {
					background: rgba(255, 255, 255, 0.2);
					padding: 2px 6px;
					border-radius: 3px;
					font-size: 0.9em;
					font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
				}

				.markdown-message-incoming :global(pre) {
					background: rgba(0, 0, 0, 0.06);
					padding: 10px;
					border-radius: 6px;
					overflow-x: auto;
					margin: 0.5em 0;
				}

				.markdown-message-incoming :global(pre code) {
					background: transparent;
					padding: 0;
				}

				.markdown-message-outgoing :global(pre) {
					background: rgba(255, 255, 255, 0.15);
					padding: 10px;
					border-radius: 6px;
					overflow-x: auto;
					margin: 0.5em 0;
				}

				.markdown-message-outgoing :global(pre code) {
					background: transparent;
					padding: 0;
				}

				.markdown-message-incoming :global(h1),
				.markdown-message-incoming :global(h2),
				.markdown-message-incoming :global(h3),
				.markdown-message-outgoing :global(h1),
				.markdown-message-outgoing :global(h2),
				.markdown-message-outgoing :global(h3) {
					font-weight: 600;
					margin-top: 0.5em;
					margin-bottom: 0.25em;
				}

				.markdown-message-incoming :global(h1) { font-size: 1.2em; }
				.markdown-message-incoming :global(h2) { font-size: 1.1em; }
				.markdown-message-incoming :global(h3) { font-size: 1em; }
				.markdown-message-outgoing :global(h1) { font-size: 1.2em; }
				.markdown-message-outgoing :global(h2) { font-size: 1.1em; }
				.markdown-message-outgoing :global(h3) { font-size: 1em; }

				.markdown-message-incoming :global(blockquote) {
					border-left: 3px solid #ccc;
					padding-left: 0.8em;
					font-style: italic;
					margin: 0.5em 0;
					opacity: 0.8;
				}

				.markdown-message-outgoing :global(blockquote) {
					border-left: 3px solid rgba(255, 255, 255, 0.4);
					padding-left: 0.8em;
					font-style: italic;
					margin: 0.5em 0;
					opacity: 0.9;
				}

				.markdown-message-incoming :global(a) {
					color: #4CAF50;
					text-decoration: none;
				}

				.markdown-message-outgoing :global(a) {
					color: #fff;
					text-decoration: underline;
				}

				.loading {
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 12px;
					color: #666;
					padding: 40px;
				}

				.loading-spinner {
					width: 24px;
					height: 24px;
					border: 2px solid #e0e0e0;
					border-top-color: #4CAF50;
					border-radius: 50%;
					animation: spin 1s linear infinite;
				}

				.error {
					background: #fff5f5;
					border: 1px solid #feb2b2;
					border-radius: 8px;
					padding: 20px;
					margin: 20px;
					text-align: center;
				}

				.error-icon {
					font-size: 40px;
					margin-bottom: 12px;
				}

				.error-title {
					color: #c53030;
					font-weight: 500;
					margin-bottom: 8px;
				}

				.error-message {
					color: #742a2a;
					font-size: 14px;
				}

				.continue-section {
					padding: 16px 20px;
					border-top: 1px solid #eee;
					background: #f8f9fa;
				}

				.continue-btn {
					width: 100%;
					background: #4CAF50;
					color: #fff;
					border: none;
					padding: 14px;
					border-radius: 8px;
					font-size: 15px;
					font-weight: 500;
					cursor: pointer;
					transition: background 0.2s;
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 8px;
				}

				.continue-btn:hover:not(:disabled) {
					background: #45a049;
				}

				.continue-btn:disabled {
					background: #a0aec0;
					cursor: not-allowed;
				}

				.continue-response {
					background: #e8f5e9;
					border: 1px solid #81c784;
					border-radius: 8px;
					padding: 16px;
					margin-top: 12px;
					white-space: pre-wrap;
					word-wrap: break-word;
					line-height: 1.6;
				}

				.continue-error {
					background: #ffebee;
					border: 1px solid #e57373;
					border-radius: 8px;
					padding: 12px;
					margin-top: 12px;
					color: #c62828;
					font-size: 14px;
				}

				.footer {
					padding: 16px;
					text-align: center;
					font-size: 12px;
					color: #999;
					border-top: 1px solid #eee;
				}

				.footer a {
					color: #4CAF50;
					text-decoration: none;
				}

				@media (max-width: 480px) {
					.container {
						border-radius: 0;
						min-height: 100vh;
					}
					.header {
						padding: 20px;
					}
					.messages {
						padding: 16px;
					}
					.user-message .message-content,
					.assistant-message .message-content {
						margin-left: 0;
						margin-right: 0;
					}
				}

				@media (prefers-color-scheme: dark) {
					.container {
						background: #2d2d2d;
					}
					.assistant-message .message-content {
						background: #3a3a3a;
						color: #e5e5e5;
					}
					.markdown-message-incoming :global(code) {
						background: rgba(255, 255, 255, 0.1);
						color: #e5e5e5;
					}
					.markdown-message-incoming :global(pre) {
						background: rgba(255, 255, 255, 0.08);
					}
					.markdown-message-incoming :global(blockquote) {
						border-left-color: #555;
						opacity: 0.8;
					}
					.markdown-message-incoming :global(a) {
						color: #81c784;
					}
					.loading {
						color: #a0a0a0;
					}
					.loading-spinner {
						border-color: #444;
						border-top-color: #4CAF50;
					}
					.error {
						background: #4a2020;
						border-color: #742a2a;
					}
					.error-title {
						color: #f8a0a0;
					}
					.error-message {
						color: #f8d7d7;
					}
					.continue-section {
						background: #1a1a1a;
						border-top-color: #444;
					}
					.footer {
						border-top-color: #444;
					}
				}
			`}</style>

			<div className="container">
				<div className="header">
					<h1>💬 对话记录</h1>
					{!loading && conversation && !isExpired && (
						<div className="notice">
							此对话将于 {formatExpiryTime(conversation.expiresAt)} 过期
						</div>
					)}
				</div>

				{loading && (
					<div className="loading">
						<div className="loading-spinner"></div>
						<span>加载中...</span>
					</div>
				)}

				{error && (
					<div className="error">
						<div className="error-icon">⚠️</div>
						<div className="error-title">对话已过期</div>
						<div className="error-message">{error}</div>
					</div>
				)}

				{conversation && !isExpired && (
					<>
						<div className="messages">
							{conversation.messages.map((msg, index) => (
								<div key={index} className={`message ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}>
									<div className="message-role">
										{msg.role === 'user' ? '你' : 'AI 助手'}
									</div>
									<div className="message-content">
										<MarkdownMessage content={msg.content} isIncoming={msg.role === 'assistant'} />
									</div>
								</div>
							))}

							{continueResponse && (
								<div className="message assistant-message">
									<div className="message-role">AI 助手 (新回复)</div>
									<div className="message-content">
										<MarkdownMessage content={continueResponse} isIncoming={true} />
									</div>
								</div>
							)}
						</div>

						<div className="continue-section">
							<button
								className="continue-btn"
								onClick={handleContinue}
								disabled={continuing}
							>
								{continuing ? (
									<>
										<div className="loading-spinner" style={{ width: 16, height: 16 }}></div>
										<span>生成中...</span>
									</>
								) : (
									<>
										<span>🔄</span>
										<span>继续对话</span>
									</>
								)}
							</button>
							{continueError && (
								<div className="continue-error">{continueError}</div>
							)}
						</div>
					</>
				)}

				<div className="footer">
					返回微信发送消息可继续对话 · Powered by <a href="https://www.ruminer.app" target="_blank">Ruminer</a>
				</div>
			</div>
		</>
	);
}
