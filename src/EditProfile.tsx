import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

interface Profile {
  id?: number;
  name: string;
  title: string;
  bio: string;
  education: string;
  experience: string;
  skills: string;
  avatar_url: string;
}

function EditProfile() {
  const [profile, setProfile] = useState<Profile>({
    name: '',
    title: '',
    bio: '',
    education: '',
    experience: '',
    skills: '',
    avatar_url: ''
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .limit(1)
      .single();

    if (data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    const { error } = await supabase
      .from('profile')
      .upsert({ 
        id: 1,
        ...profile,
        updated_at: new Date().toISOString()
      });

    if (error) {
      setMessage('保存失败：' + error.message);
      console.error(error);
    } else {
      setMessage('✅ 保存成功！');
    }
    setSaving(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>加载中...</div>;

  return (
    <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>编辑简历内容</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label>姓名：</label>
        <input 
          name="name" 
          value={profile.name} 
          onChange={handleChange} 
          style={{ width: '100%', padding: '10px', marginTop: '5px' }} 
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>标题（如前端工程师）：</label>
        <input 
          name="title" 
          value={profile.title} 
          onChange={handleChange} 
          style={{ width: '100%', padding: '10px', marginTop: '5px' }} 
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>自我介绍 (Bio)：</label>
        <textarea 
          name="bio" 
          value={profile.bio} 
          onChange={handleChange} 
          rows={5} 
          style={{ width: '100%', padding: '10px', marginTop: '5px' }} 
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>教育背景：</label>
        <textarea 
          name="education" 
          value={profile.education} 
          onChange={handleChange} 
          rows={4} 
          style={{ width: '100%', padding: '10px', marginTop: '5px' }} 
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>工作经历：</label>
        <textarea 
          name="experience" 
          value={profile.experience} 
          onChange={handleChange} 
          rows={4} 
          style={{ width: '100%', padding: '10px', marginTop: '5px' }} 
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>技能：</label>
        <textarea 
          name="skills" 
          value={profile.skills} 
          onChange={handleChange} 
          rows={3} 
          style={{ width: '100%', padding: '10px', marginTop: '5px' }} 
        />
      </div>

      <button 
        onClick={handleSave}
        disabled={saving}
        style={{ 
          padding: '14px 32px', 
          fontSize: '16px', 
          background: '#1976d2', 
          color: 'white', 
          border: 'none', 
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        {saving ? '保存中...' : '保存修改'}
      </button>

      {message && (
        <p style={{ 
          marginTop: '20px', 
          fontWeight: 'bold', 
          color: message.includes('成功') ? 'green' : 'red' 
        }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default EditProfile;