import type { MDXComponents } from 'mdx/types'
 
const components: MDXComponents = {
  // Custom wrapper for the entire page
  wrapper: ({ children }) => (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem 1.5rem',
      lineHeight: '1.7',
      backgroundColor: '#ffffff',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {children}
    </div>
  ),
  
  // Custom heading styles
  h1: ({ children }) => (
    <h1 style={{
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginBottom: '1.5rem',
      borderBottom: '2px solid #e5e5e5',
      paddingBottom: '1rem',
      marginTop: '0'
    }}>
      {children}
    </h1>
  ),
  
  h2: ({ children }) => (
    <h2 style={{
      fontSize: '1.75rem',
      fontWeight: '600',
      color: '#2a2a2a',
      marginTop: '2.5rem',
      marginBottom: '1rem'
    }}>
      {children}
    </h2>
  ),
  
  h3: ({ children }) => (
    <h3 style={{
      fontSize: '1.25rem',
      fontWeight: '500',
      color: '#3a3a3a',
      marginTop: '2rem',
      marginBottom: '0.75rem'
    }}>
      {children}
    </h3>
  ),
  
  // Custom paragraph styling
  p: ({ children }) => (
    <p style={{
      color: '#4a4a4a',
      lineHeight: '1.7',
      marginBottom: '1rem'
    }}>
      {children}
    </p>
  ),
  
  // Custom list styling
  ul: ({ children }) => (
    <ul style={{
      listStyleType: 'disc',
      paddingLeft: '1.5rem',
      marginBottom: '1rem',
      color: '#4a4a4a'
    }}>
      {children}
    </ul>
  ),
  
  li: ({ children }) => (
    <li style={{
      marginBottom: '0.5rem'
    }}>
      {children}
    </li>
  ),
  
  // Custom emphasis (italic text like dates)
  em: ({ children }) => (
    <em style={{
      color: '#6a6a6a',
      fontSize: '0.9rem'
    }}>
      {children}
    </em>
  ),
  
  // Custom strong text
  strong: ({ children }) => (
    <strong style={{
      fontWeight: '600',
      color: '#2a2a2a'
    }}>
      {children}
    </strong>
  ),
}
 
export function useMDXComponents(): MDXComponents {
  return components
}