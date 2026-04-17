import { useState } from 'react';
import { supabase } from './supabaseClient';

function Login() {
  const [email, setEmail] = useState('912789560@qq.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setMessage('登录失败：' + error.message);
    } else {
      setMessage('登录成功！正在跳转...');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '420px', margin: '80px auto', padding: '30px', textAlign: 'center', fontFamily: 'system-ui' }}>
      <h2>登录后台（仅自己使用）</h2>
      <p style={{ color: '#666', margin: '10px 0 20px' }}>使用你刚刚注册的邮箱和密码登录</p>
      
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '12px', margin: '10px 0', fontSize: '16px', borderRadius: '6px' }}
          required
        />
        <input
          type="password"
          placeholder="输入密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '12px', margin: '10px 0', fontSize: '16px', borderRadius: '6px' }}
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '14px', 
            marginTop: '15px', 
            fontSize: '16px', 
            background: '#1976d2', 
            color: 'white', 
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </form>

      {message && <p style={{ marginTop: '20px', color: message.includes('成功') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
}

export default Login;