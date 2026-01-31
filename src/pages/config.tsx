import Head from 'next/head';
import { useEffect, useState, useCallback } from 'react';

const API_BASE = 'https://api.ruminer.app';

interface ConfigData {
  platform?: string;
  github_repo?: string;
  github_path?: string;
}

interface SetupData {
  status: string;
  githubInstallUrl?: string;
  repoFullName?: string;
  error?: string;
}

export default function ConfigPage(): JSX.Element {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'setup' | 'config' | 'processing' | 'success' | 'error'>('loading');
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [setup, setSetup] = useState<SetupData | null>(null);

  // Form states
  const [githubToken, setGithubToken] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [githubPath, setGithubPath] = useState('');
  const [configGithubToken, setConfigGithubToken] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const checkStatus = useCallback(async (currentToken: string) => {
    try {
      // First try setup status (for GitHub App flow)
      const setupRes = await fetch(`${API_BASE}/setup/status?token=${currentToken}`);

      if (setupRes.ok) {
        const setupData: SetupData = await setupRes.json();
        handleSetupStatus(setupData, currentToken);
        return;
      }

      // Fall back to config API
      const configRes = await fetch(`${API_BASE}/config`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });

      if (configRes.ok) {
        const configData: ConfigData = await configRes.json();
        handleConfigStatus(configData);
      } else if (configRes.status === 401) {
        setError('链接已过期，请从微信重新获取');
        setStatus('error');
      } else {
        // New user, show setup
        setStatus('setup');
      }
    } catch {
      setError('网络错误，请重试');
      setStatus('error');
    }
  }, []);

  const handleSetupStatus = (data: SetupData, currentToken: string) => {
    setSetup(data);

    switch (data.status) {
      case 'pending':
        setStatus('setup');
        break;
      case 'authorizing':
      case 'provisioning':
        setStatus('processing');
        break;
      case 'completed':
        setStatus('success');
        break;
      case 'failed':
        setError(data.error || '设置失败，请重试');
        setStatus('error');
        break;
      default:
        // Not a setup session, check config
        checkConfigOnly(currentToken);
    }
  };

  const checkConfigOnly = async (currentToken: string) => {
    try {
      const res = await fetch(`${API_BASE}/config`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });

      if (res.ok) {
        const data: ConfigData = await res.json();
        handleConfigStatus(data);
      } else {
        setStatus('setup');
      }
    } catch {
      setStatus('setup');
    }
  };

  const handleConfigStatus = (data: ConfigData) => {
    setConfig(data);
    if (data.github_repo) {
      setGithubRepo(data.github_repo);
      setGithubPath(data.github_path || '');
      setStatus('config');
    } else {
      setStatus('setup');
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');

    if (!t) {
      setError('配置链接无效，请从微信重新获取');
      setStatus('error');
      return;
    }

    setToken(t);
    checkStatus(t);

    // Poll for status changes if in processing state
    const interval = setInterval(() => {
      if (status === 'processing') {
        checkStatus(t);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [checkStatus, status]);

  const saveConfig = async (e: React.FormEvent, isSetup: boolean) => {
    e.preventDefault();
    if (!token) return;

    const tokenValue = isSetup ? githubToken : configGithubToken;
    const repoValue = isSetup ? githubRepo : githubRepo;
    const pathValue = isSetup ? githubPath : githubPath;

    const data: Record<string, string> = {
      github_repo: repoValue.trim(),
      github_path: pathValue.trim() || 'articles/'
    };

    if (tokenValue.trim()) {
      data.github_token = tokenValue.trim();
    } else if (isSetup) {
      alert('请填写 GitHub Token');
      return;
    }

    if (!data.github_repo) {
      alert('请填写仓库地址');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`${API_BASE}/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        if (isSetup) {
          setStatus('success');
        } else {
          setMessage({ text: '配置已保存！', type: 'success' });
        }
      } else {
        const err = await res.json();
        alert(err.error || '保存失败，请重试');
      }
    } catch {
      alert('网络错误，请重试');
    } finally {
      setSaving(false);
    }
  };

  const getProcessingText = () => {
    if (setup?.status === 'authorizing') {
      return { title: '正在验证授权...', message: '正在获取 GitHub 访问权限' };
    }
    return {
      title: '正在配置...',
      message: setup?.repoFullName ? `正在设置仓库: ${setup.repoFullName}` : '正在完成配置'
    };
  };

  const processingText = getProcessingText();

  return (
    <>
      <Head>
        <title>Ruminer - 配置</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <style jsx global>{`
        :root {
          --bg: #f5f5f5;
          --card-bg: #fff;
          --text: #333;
          --text-secondary: #666;
          --border: #e1e8ed;
          --accent: #667eea;
          --accent-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --step-bg: #f8f9fa;
          --error-bg: #f8d7da;
          --error-text: #721c24;
          --success-bg: #d4edda;
          --success-text: #155724;
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --bg: #1a1a1a;
            --card-bg: #2d2d2d;
            --text: #e5e5e5;
            --text-secondary: #a0a0a0;
            --border: #444;
            --step-bg: #333;
            --error-bg: #4a2020;
            --error-text: #f8a0a0;
            --success-bg: #1a3a1a;
            --success-text: #90d090;
          }
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: var(--bg);
          min-height: 100vh;
          padding: 20px;
          margin: 0;
        }
      `}</style>

      <div className="container">
        <div className="header">
          <h1>守藏史 Ruminer</h1>
          <p>配置您的知识库（建议点击"在浏览器中打开"）</p>
        </div>

        {/* Loading State */}
        {status === 'loading' && (
          <div className="status">
            <div className="spinner"></div>
            <p>加载中...</p>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="content">
            <div className="message error">{error}</div>
            <a href="https://www.ruminer.app" className="btn btn-primary">返回首页</a>
          </div>
        )}

        {/* Setup State */}
        {status === 'setup' && (
          <div className="content">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>创建 GitHub 仓库（可选）</h3>
                <p>首先，（需要先注册一个 GitHub 账号）创建一个 GitHub 仓库作为您的知识库（输入仓库名称并将可见性/Visibility 设为私有/Private即可提交）。您的收藏内容将自动保存于此并由您的守藏史进行搜索、阅览、编辑、整理、汇报等工作。</p>
                <p style={{ marginTop: '8px' }}>
                  <a href="https://github.com/new" target="_blank" rel="noopener noreferrer">点击创建新仓库 &rarr;</a>
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>授权守藏史 Ruminer 访问</h3>
                <p>点击下方按钮，授权您的守藏史访问并管理您的个人知识库。选择只安装于部分仓库，并在仓库选项列表中搜索您刚才创建的仓库，点击添加之后即可安装。</p>
              </div>
            </div>

            {setup?.githubInstallUrl && (
              <a href={setup.githubInstallUrl} className="btn btn-secondary">
                <GitHubIcon />
                授权 GitHub 访问
              </a>
            )}

            <div className="divider">或手动配置</div>

            <form onSubmit={(e) => saveConfig(e, true)}>
              <div className="form-group">
                <label htmlFor="githubToken">GitHub Personal Access Token</label>
                <input
                  type="password"
                  id="githubToken"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxx"
                />
                <small>需要 repo 权限</small>
              </div>
              <div className="form-group">
                <label htmlFor="githubRepo">仓库 (owner/repo)</label>
                <input
                  type="text"
                  id="githubRepo"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  placeholder="username/articles"
                />
              </div>
              <div className="form-group">
                <label htmlFor="githubPath">路径前缀 (可选)</label>
                <input
                  type="text"
                  id="githubPath"
                  value={githubPath}
                  onChange={(e) => setGithubPath(e.target.value)}
                  placeholder="articles/"
                />
                <small>例如: articles/ 或 wechat/</small>
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? '保存中...' : '保存配置'}
              </button>
            </form>
          </div>
        )}

        {/* Config State */}
        {status === 'config' && config && (
          <div className="content">
            {message && (
              <div className={`message ${message.type}`}>{message.text}</div>
            )}

            <div className="repo-info">
              <h3>当前仓库</h3>
              <a href={`https://github.com/${config.github_repo}`} target="_blank" rel="noopener noreferrer">
                {config.github_repo}
              </a>
            </div>

            <form onSubmit={(e) => saveConfig(e, false)}>
              <div className="form-group">
                <label htmlFor="configGithubToken">更换 GitHub Token (可选)</label>
                <input
                  type="password"
                  id="configGithubToken"
                  value={configGithubToken}
                  onChange={(e) => setConfigGithubToken(e.target.value)}
                  placeholder="留空保持不变"
                />
                <small>如需更换 Token，请填写新的</small>
              </div>
              <div className="form-group">
                <label htmlFor="configGithubRepo">仓库 (owner/repo)</label>
                <input
                  type="text"
                  id="configGithubRepo"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  placeholder="username/articles"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="configGithubPath">路径前缀</label>
                <input
                  type="text"
                  id="configGithubPath"
                  value={githubPath}
                  onChange={(e) => setGithubPath(e.target.value)}
                  placeholder="articles/"
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? '保存中...' : '保存配置'}
              </button>
            </form>

            {setup?.githubInstallUrl && (
              <a href={setup.githubInstallUrl} className="btn btn-secondary">
                <GitHubIcon />
                重新授权 GitHub
              </a>
            )}
          </div>
        )}

        {/* Processing State */}
        {status === 'processing' && (
          <div className="status">
            <div className="spinner"></div>
            <h2>{processingText.title}</h2>
            <p>{processingText.message}</p>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className="status">
            <div className="status-icon">&#127881;</div>
            <h2>设置完成！</h2>
            <p>您的知识库已配置成功</p>
            {setup?.repoFullName && (
              <p style={{ marginTop: '8px', color: 'var(--accent)' }}>{`仓库: ${setup.repoFullName}`}</p>
            )}
            <div style={{ marginTop: '24px' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>现在可以返回微信，开始保存文章了！</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 500px;
          margin: 0 auto;
          background: var(--card-bg);
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: var(--accent-gradient);
          color: white;
          padding: 24px;
          text-align: center;
        }
        .header h1 { font-size: 24px; margin-bottom: 8px; }
        .header p { opacity: 0.9; font-size: 14px; }
        .content { padding: 24px; }
        .step {
          display: flex;
          align-items: flex-start;
          margin-bottom: 20px;
          padding: 16px;
          background: var(--step-bg);
          border-radius: 12px;
        }
        .step-number {
          width: 32px;
          height: 32px;
          background: var(--accent-gradient);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          flex-shrink: 0;
          margin-right: 16px;
        }
        .step-content { flex: 1; }
        .step-content h3 { font-size: 16px; margin-bottom: 8px; color: var(--text); }
        .step-content p { font-size: 14px; color: var(--text-secondary); line-height: 1.5; }
        .step-content a { color: var(--accent); text-decoration: none; }
        .step-content a:hover { text-decoration: underline; }
        .form-group { margin-bottom: 20px; }
        .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text);
          font-size: 14px;
        }
        .form-group input {
          width: 100%;
          padding: 12px;
          border: 2px solid var(--border);
          border-radius: 8px;
          font-size: 14px;
          background: var(--card-bg);
          color: var(--text);
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .form-group input:focus {
          outline: none;
          border-color: var(--accent);
        }
        .form-group small {
          display: block;
          margin-top: 6px;
          color: var(--text-secondary);
          font-size: 12px;
        }
        .btn {
          display: block;
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .btn-primary {
          background: var(--accent-gradient);
          color: white;
        }
        .btn-primary:hover { opacity: 0.9; }
        .btn-secondary {
          background: #24292e;
          color: white;
          margin-top: 16px;
        }
        .btn-secondary:hover { opacity: 0.9; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .message {
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
        }
        .message.success { background: var(--success-bg); color: var(--success-text); }
        .message.error { background: var(--error-bg); color: var(--error-text); }
        .status {
          text-align: center;
          padding: 32px 24px;
        }
        .status-icon { font-size: 48px; margin-bottom: 16px; }
        .status h2 { font-size: 20px; margin-bottom: 8px; color: var(--text); }
        .status p { font-size: 14px; color: var(--text-secondary); }
        .spinner {
          border: 3px solid var(--border);
          border-top: 3px solid var(--accent);
          border-radius: 50%;
          width: 48px;
          height: 48px;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .divider {
          display: flex;
          align-items: center;
          margin: 24px 0;
          color: var(--text-secondary);
          font-size: 14px;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }
        .divider::before { margin-right: 16px; }
        .divider::after { margin-left: 16px; }
        .repo-info {
          background: var(--step-bg);
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .repo-info h3 { font-size: 14px; color: var(--text-secondary); margin-bottom: 8px; }
        .repo-info a { color: var(--accent); font-size: 16px; word-break: break-all; }
      `}</style>
    </>
  );
}

function GitHubIcon() {
  return (
    <svg className="github-icon" viewBox="0 0 16 16" fill="currentColor" style={{ width: '20px', height: '20px', verticalAlign: 'middle', marginRight: '8px' }}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
    </svg>
  );
}
