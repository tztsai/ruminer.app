import Head from 'next/head';
import { useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_API_BASE = 'https://api.atmaware.cn';

type SummaryStatus = 'pending' | 'generating' | 'complete' | 'failed';

interface SummaryData {
	title: string;
	article_url: string;
	github_url: string;
	status: SummaryStatus;
	summary?: string;
	last_error?: string;
	failure_count?: number;
	created_at?: string;
}

export default function SummaryPage() {
	const [summary, setSummary] = useState<SummaryData | null>(null);
	const [streamedContent, setStreamedContent] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isRetrying, setIsRetrying] = useState(false);
	const abortControllerRef = useRef<AbortController | null>(null);

	// Determine API base based on environment (same logic as config.tsx)
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
	const routerId = typeof window !== 'undefined'
		? window.location.pathname.split('/').filter(p => p).pop() || ''
		: '';
	const cacheKey = routerId;

	const streamUrl = `${apiBase}/summary/${cacheKey}/stream`;
	const dataUrl = `${apiBase}/summary/${cacheKey}`;

	// Fetch initial data
	useEffect(() => {
		if (!cacheKey) {
			setError('无效的摘要链接');
			setLoading(false);
			return;
		}

		const fetchInitialData = async () => {
			try {
				const response = await fetch(dataUrl, {
					headers: { 'Accept': 'application/json' }
				});

				if (!response.ok) {
					if (response.status === 404) {
						setError('摘要不存在或已过期');
					} else {
						setError('获取摘要失败');
					}
					setLoading(false);
					return;
				}

				const data: SummaryData = await response.json();
				setSummary(data);

				if (data.status === 'complete' && data.summary) {
					setStreamedContent(data.summary);
					setLoading(false);
				} else if (data.status === 'failed') {
					setError(data.last_error || '生成失败');
					setLoading(false);
				}
				// For pending/generating, we'll start streaming
			} catch (err) {
				console.error('Failed to fetch summary:', err);
				setError('网络错误，请重试');
				setLoading(false);
			}
		};

		fetchInitialData();
	}, [cacheKey, dataUrl]);

	// Start SSE streaming when needed
	useEffect(() => {
		// Don't stream if we have complete content or error, or if we haven't loaded initial data yet
		if (!summary || summary.status === 'complete' || summary.status === 'failed') {
			return;
		}

		// Don't start streaming if already retrying (wait for retry flag to reset)
		if (isRetrying) {
			return;
		}

		// Abort any existing request
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

		// Use fetch with ReadableStream for better control
		// Start from current streamedContent (will be empty if retrying)
		let accumulated = streamedContent;
		const abortController = new AbortController();
		abortControllerRef.current = abortController;

		const startStreaming = async () => {
			try {
				const response = await fetch(streamUrl, {
					headers: { 'Accept': 'text/event-stream' },
					signal: abortController.signal,
				});

				if (!response.ok) {
					throw new Error(`Stream request failed: ${response.status}`);
				}

				const reader = response.body?.getReader();
				if (!reader) {
					throw new Error('No reader available');
				}

				const decoder = new TextDecoder();
				setLoading(false); // Hide loading spinner once stream starts

				const read = async () => {
					try {
						const { done, value } = await reader.read();

						if (done) {
							// Stream complete
							setLoading(false);
							return;
						}

						const text = decoder.decode(value, { stream: true });
						const lines = text.split('\n');

						for (const line of lines) {
							if (!line.startsWith('data: ')) continue;

							const data = line.slice(6).trim();

							if (data === '[DONE]') {
								setLoading(false);
								return;
							}

							try {
								const json = JSON.parse(data);

								if (json.content) {
									accumulated += json.content;
									setStreamedContent(accumulated);
								}

								if (json.error) {
									setError(json.error);
									setLoading(false);
									return;
								}
							} catch (e) {
								// Ignore parse errors for non-JSON lines
							}
						}

						read();
					} catch (err) {
						if (err instanceof Error && err.name === 'AbortError') {
							// Request was aborted, ignore
							return;
						}
						setError(err instanceof Error ? err.message : '流式传输失败');
						setLoading(false);
					}
				};

				read();
			} catch (err) {
				if (err instanceof Error && err.name === 'AbortError') {
					// Request was aborted, ignore
					return;
				}
				setError(err instanceof Error ? err.message : '连接失败');
				setLoading(false);
			}
		};

		startStreaming();

		return () => {
			abortController.abort();
		};
	}, [summary, streamUrl, isRetrying]);

	// Retry handler
	const handleRetry = () => {
		setStreamedContent('');
		setError(null);
		setLoading(true);
		setIsRetrying(true);

		// Abort any existing request
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

		// Reset retry flag after a short delay to allow reconnection
		setTimeout(() => {
			setIsRetrying(false);
		}, 100);
	};

	// Format text for display (convert newlines to paragraphs)
	const formatText = (text: string) => {
		if (!text) return null;
		return text.split('\n\n')
			.filter(p => p.trim())
			.map((p, i) => (
				<p key={i} dangerouslySetInnerHTML={{
					__html: p.replace(/\n/g, '<br>')
				}} />
			));
	};

	// Format date for display
	const formatDate = (isoString?: string) => {
		if (!isoString) return '';
		try {
			const date = new Date(isoString);
			return date.toLocaleString('zh-CN', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			});
		} catch {
			return isoString;
		}
	};

	const canRetry = summary && (!summary.failure_count || summary.failure_count < 3);
	const maxRetriesReached = summary && summary.failure_count && summary.failure_count >= 3;

	return (
		<>
			<Head>
				<title>{summary?.title || '文章摘要'} - Ruminer</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>

			<style jsx global>{`
				@keyframes spin {
					to { transform: rotate(360deg); }
				}
				@keyframes blink {
					50% { opacity: 0; }
				}
			`}</style>

			<style jsx>{`
				.container {
					max-width: 680px;
					margin: 0 auto;
					background: var(--card-bg, #fff);
					border-radius: 12px;
					box-shadow: 0 2px 20px rgba(0,0,0,0.08);
					overflow: hidden;
					min-height: 100vh;
				}

				.header {
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					color: #fff;
					padding: 30px 24px;
				}

				.header h1 {
					font-size: 24px;
					font-weight: 600;
					margin: 0 0 8px 0;
				}

				.meta {
					font-size: 12px;
					opacity: 0.8;
				}

				.content {
					padding: 24px;
				}

				.summary {
					font-size: 16px;
					line-height: 1.8;
					color: #2c3e50;
					min-height: 100px;
				}

				.summary :global(p) {
					margin-bottom: 1em;
				}

				.loading {
					display: flex;
					align-items: center;
					gap: 12px;
					color: #666;
					padding: 20px 0;
				}

				.loading-spinner {
					width: 20px;
					height: 20px;
					border: 2px solid #e0e0e0;
					border-top-color: #667eea;
					border-radius: 50%;
					animation: spin 1s linear infinite;
				}

				.cursor {
					display: inline-block;
					width: 2px;
					height: 1.2em;
					background: #667eea;
					animation: blink 1s step-end infinite;
					vertical-align: text-bottom;
					margin-left: 2px;
				}

				.error {
					background: #fff5f5;
					border: 1px solid #feb2b2;
					border-radius: 8px;
					padding: 16px;
					margin-bottom: 16px;
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

				.retry-btn {
					background: #667eea;
					color: #fff;
					border: none;
					padding: 10px 20px;
					border-radius: 6px;
					font-size: 14px;
					cursor: pointer;
					margin-top: 12px;
					transition: background 0.2s;
				}

				.retry-btn:hover:not(:disabled) {
					background: #5568d3;
				}

				.retry-btn:disabled {
					background: #a0aec0;
					cursor: not-allowed;
				}

				.actions {
					margin-top: 24px;
					padding-top: 20px;
					border-top: 1px solid #eee;
					display: flex;
					gap: 12px;
				}

				.actions a {
					flex: 1;
					text-align: center;
					padding: 12px;
					border-radius: 8px;
					text-decoration: none;
					font-size: 14px;
					font-weight: 500;
					transition: all 0.2s;
				}

				.actions a:first-child {
					background: #667eea;
					color: #fff;
				}

				.actions a:first-child:hover {
					background: #5568d3;
				}

				.actions a:nth-child(2) {
					background: #f0f0f0;
					color: #333;
				}

				.actions a:nth-child(2):hover {
					background: #e0e0e0;
				}

				.footer {
					padding: 16px 24px;
					background: #f8f9fa;
					text-align: center;
					font-size: 12px;
					color: #999;
				}

				.footer a {
					color: #667eea;
					text-decoration: none;
				}

				@media (max-width: 480px) {
					.container {
						border-radius: 0;
						min-height: 100vh;
					}
					.header {
						padding: 24px 20px;
					}
					.content {
						padding: 20px;
					}
					.actions {
						flex-direction: column;
					}
				}

				@media (prefers-color-scheme: dark) {
					.container {
						background: #2d2d2d;
					}
					.summary {
						color: #e5e5e5;
					}
					.loading {
						color: #a0a0a0;
					}
					.loading-spinner {
						border-color: #444;
						border-top-color: #667eea;
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
					.actions a:nth-child(2) {
						background: #444;
						color: #e5e5e5;
					}
					.footer {
						background: #1a1a1a;
					}
				}
			`}</style>

			<div className="container">
				<div className="header">
					<h1>{summary?.title || '文章摘要'}</h1>
					<div className="meta">{formatDate(summary?.created_at)}</div>
				</div>

				<div className="content">
					{error && (
						<div className="error">
							<div className="error-title">生成失败</div>
							<div className="error-message">{error}</div>
							<button
								className="retry-btn"
								onClick={handleRetry}
								disabled={!canRetry || loading}
							>
								{maxRetriesReached ? '已达最大重试次数' : isRetrying ? '正在重试...' : '重试'}
							</button>
						</div>
					)}

					{loading && !error && !streamedContent && (
						<div className="loading">
							<div className="loading-spinner"></div>
							<span>正在生成摘要...</span>
						</div>
					)}

					{(streamedContent || (loading && !error)) && (
						<div className="summary">
							{formatText(streamedContent)}
							{loading && <span className="cursor"></span>}
						</div>
					)}

					{summary && (summary.article_url || summary.github_url) && (
						<div className="actions">
							{summary.article_url && (
								<a href={summary.article_url} target="_blank" rel="noopener">
									阅读原文
								</a>
							)}
							{summary.github_url && (
								<a href={summary.github_url} target="_blank" rel="noopener">
									查看 GitHub
								</a>
							)}
						</div>
					)}
				</div>

				<div className="footer">
					Powered by <a href="https://www.ruminer.app" target="_blank">Ruminer</a> · Made with OpenClaw
				</div>
			</div>
		</>
	);
}
