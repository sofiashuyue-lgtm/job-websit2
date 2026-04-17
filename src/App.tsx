/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Briefcase, 
  LayoutGrid, 
  LogOut, 
  LogIn, 
  Plus, 
  Trash2, 
  ExternalLink, 
  FileText, 
  Table, 
  Upload, 
  X,
  ChevronRight,
  GraduationCap,
  Calendar,
  MapPin,
  Edit3,
  Save,
  Check,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { createClient } from '@supabase/supabase-js';

// --- Supabase Client ---
const SUPABASE_URL = "https://tduemvjrybtswpzxosig.supabase.co";
const SUPABASE_KEY = "sb_publishable_GNWYXShsl19aYtlVi7T4kA_hWf2EQxQ";
// Used for simple DB document store. Make sure you've created a table named 'resume_config' with id='main' and data column of type jsonb
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Types ---

interface Education {
  id: string;
  degree: string;
  school: string;
  major: string;
  gradDate: string;
}

interface WorkExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  desc: string;
  industry?: string;
}

interface ProjectFile {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'excel' | 'other';
}

interface Project {
  id: string;
  title: string;
  desc: string;
  files: ProjectFile[];
}

interface ResumeData {
  name: string;
  tagline: string;
  education: Education[];
  workExperience: WorkExperience[];
  projects: Project[];
  avatarUrl: string;
  keywords: string[];
}

// --- Constants ---

const PROJECT_BACKGROUNDS: Record<string, string> = {
  '1': "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop", // Peak hour/Office
  '2': "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", // Tech data analysis
  '3': "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070&auto=format&fit=crop", // City aerial
  '4': "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2072&auto=format&fit=crop", // Financial / Accounting
};

const getProjectBg = (project: Project) => {
  if (PROJECT_BACKGROUNDS[project.id]) return PROJECT_BACKGROUNDS[project.id];
  
  // Fallback by title keywords
  const title = project.title;
  if (title.includes("调研")) return PROJECT_BACKGROUNDS['1'];
  if (title.includes("研判")) return PROJECT_BACKGROUNDS['2'];
  if (title.includes("机会")) return PROJECT_BACKGROUNDS['3'];
  if (title.includes("测算") || title.includes("收益")) return PROJECT_BACKGROUNDS['4'];
  
  return `https://picsum.photos/seed/${project.id}/1000/600`;
};

const DEFAULT_DATA: ResumeData = {
  name: "何舒玥",
  tagline: "211工科背景，具备4年商务拓展研策与商业项目运营经验。具备成本测算/预算、数据分析（Excel、power bi等）、市场研策、合同谈判等能力；擅长通过数据挖掘识别增长机会，并能独立输出深度调研报告；逻辑严密，学习、执行能力强，多次完成城市实地调研并输出落地规划方案。",
  education: [
    {
      id: '1',
      degree: "工学学士",
      school: "四川农业大学 (211)",
      major: "工程造价专业",
      gradDate: "2020.06"
    }
  ],
  workExperience: [
    {
      id: '1',
      company: "成都天方荟商业管理有限公司",
      role: "招商营运部—营运专员",
      industry: "商业地产",
      period: "2023.04 - 2025.07",
      desc: "负责商户进场、履约、续费、退场全流程管理；每日/月度统计销售数据，做盈亏分析、经营诊断；定期调研区域商业竞品，输出分析报告，支撑差异化策略与客户拓展；搭建费用台账，跟进回款，处理合同变更/纠纷。"
    },
    {
      id: '2',
      company: "曲水世纪金源方圆荟商业管理有限公司四川分公司",
      role: "开发拓展部—管培生",
      industry: "商业地产",
      period: "2021.06 - 2023.04",
      desc: "开展区域市场、竞品格局、客户需求调研，输出市场机会研判报告，为业务拓展策略提供数据支撑；搭建投资回报测算模型，完成营收预测、成本分析、投资回报率评估及租金定价；分析客户画像、消费能力与需求偏好，完成客群抓取与场景定位。"
    },
    {
      id: '3',
      company: "中国建筑（东南亚）有限公司",
      role: "商务部—见习商务工程师",
      industry: "地产建筑",
      period: "2020.09 - 2021.05",
      desc: "负责集贸 271 项目变更工程的材料用量核算、行政费用核算、建立标准化数据台账；计算当月产值，跟踪项目施工生产完成情况。"
    }
  ],
  projects: [
    {
      id: '1',
      title: "商业项目调研",
      desc: "市场与客户调研，竞品格局分析。完成目标项目 3-5 公里商圈/客群分析，判断客户规模、消费力与需求，输出目标客户画像，支撑市场拓展与定位。调研竞品定位、运营模式、优劣势，输出竞争策略报告。",
      files: []
    },
    {
      id: '2',
      title: "宏观市场研判项目",
      desc: "数据体系搭建，区域发展研策，行业研策。统计城市/区域多维数据，建立宏观数据评估模型，为市场进入策略、区域优先级提供数据依据。分析县域经济发展情况，绘制消费者画像；对消费需求及潜力业态进行分析，判断市场需求及未来趋势。统计业内轻资产拓展情况，分析竞争公司产品线、运营数据、拓展策略、合作模式等。",
      files: []
    },
    {
      id: '3',
      title: "城市商业机会分析",
      desc: "目标客群与增量挖掘。结合城市定位、产业结构、人口流量、交通区位及区域规划，深度研判区域商业生态与发展潜力。分析存量项目密度、行业分布及经营状况，评估商圈饱和度与商业增量空间，锁定高价值拓展区域及核心目标项目/客户集群。",
      files: []
    },
    {
      id: '4',
      title: "项目十年期收益测算",
      desc: "项目营收与成本测算。完成项目租金分解、收益预估、投资回报测算。",
      files: []
    }
  ],
  avatarUrl: "",
  keywords: ["市场研策", "数据分析", "方案规划", "项目测算"]
};

// --- Components ---

export default function App() {
  console.log('App component is rendering');
  const [activeTab, setActiveTab] = useState<'home' | 'work' | 'portfolio'>('home');
  const [isAuthorMode, setIsAuthorMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [data, setData] = useState<ResumeData>(DEFAULT_DATA);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [previewFile, setPreviewFile] = useState<ProjectFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Real-time & Initial Persistence
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: dbData, error } = await supabase
          .from('resume_config')
          .select('data')
          .eq('id', 'main')
          .single();
          
        if (dbData && dbData.data && !error) {
          setData(prev => ({ ...prev, ...dbData.data }));
        }
      } catch (err) {
        console.warn("Failed to read from Supabase on start", err);
      }
    };

    fetchData();

    // Subscribe to REALTIME changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'resume_config', filter: 'id=eq.main' },
        (payload) => {
          if (payload.new && payload.new.data) {
            setData(prev => ({ ...prev, ...payload.new.data }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const saveData = async (newData: ResumeData) => {
    setData(newData);
    localStorage.setItem('resume_data', JSON.stringify(newData));
    
    try {
      // Upsert into Supabase 
      await supabase
        .from('resume_config')
        .upsert({ id: 'main', data: newData }, { onConflict: 'id' });
    } catch (e) {
      console.error("Failed to save to Supabase", e);
    }
    
    // Show saved feedback
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Avatar Priority Probe
  useEffect(() => {
    const probe = async () => {
      if (data.avatarUrl) {
        setAvatarSrc(data.avatarUrl);
        return;
      }

      const formats = ['png', 'jpg', 'jpeg'];
      for (const ext of formats) {
        try {
          const url = `/avatar.${ext}`;
          const res = await fetch(url, { method: 'HEAD' });
          if (res.ok) {
            setAvatarSrc(url);
            return;
          }
        } catch (e) {
          // Ignore errors
        }
      }
      setAvatarSrc(null);
    };
    probe();
  }, [data.avatarUrl]);

  // Login Logic
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = formData.get('username');
    const pass = formData.get('password');

    if (user === 'heshuyue' && pass === 'heshuyue') {
      setIsAuthorMode(true);
      setShowLogin(false);
      // Feedback for login
    } else {
      alert("账号或密码错误");
    }
  };

  const formatDescription = (desc: string) => {
    if (!desc) return null;
    
    // Split by first standard full stop or manually defined first sentence
    const sentences = desc.split(/[。]/);
    const firstSentence = sentences[0] + (sentences.length > 1 ? '。' : '');
    const rest = desc.slice(firstSentence.length);
    
    const items = rest.split(/[；;]/).filter(item => item.trim());
    
    return (
      <div className="space-y-3">
        <p className="font-bold text-lg md:text-xl leading-snug">{firstSentence}</p>
        <div className="space-y-1 opacity-90">
          {items.map((item, idx) => (
            <div key={idx} className="text-sm md:text-base leading-relaxed text-left pl-1">
              {item.trim()}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const formatNumberedList = (text: string) => {
    if (!text) return null;
    const items = text.split(/[；;]/).filter(item => item.trim());
    if (items.length <= 1) return text;

    return (
      <div className="space-y-1.5">
        {items.map((item, idx) => (
          <div key={idx} className="text-base leading-relaxed text-gray-600 pl-1">
            {item.trim()}
          </div>
        ))}
      </div>
    );
  };

  const addKeyword = () => {
    if (!isAuthorMode) return;
    const word = prompt("输入新关键词");
    if (word) {
      saveData({ ...data, keywords: [...(data.keywords || []), word] });
    }
  };

  const removeKeyword = (idx: number) => {
    if (!isAuthorMode) return;
    const newKeywords = [...data.keywords];
    newKeywords.splice(idx, 1);
    saveData({ ...data, keywords: newKeywords });
  };

  // Editable Handlers
  const updateField = (path: string, value: any) => {
    if (!isAuthorMode) return;
    const newData = { ...data };
    const keys = path.split('.');
    let current: any = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    saveData(newData);
  };

  const handleAvatarChange = () => {
    if (!isAuthorMode) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        setIsUploading(true);
        setUploadStatus("正在更新头像...");
        try {
          const fileExt = file.name.split('.').pop();
          const storageKey = `avatar-${Date.now()}.${fileExt}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('resume_files')
            .upload(storageKey, file, { contentType: file.type });

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from('resume_files')
            .getPublicUrl(storageKey);

          updateField('avatarUrl', urlData.publicUrl);
          setUploadStatus("头像更新成功！");
          setTimeout(() => setUploadStatus(null), 3000);
        } catch (err: any) {
          console.error("Avatar upload failed:", err);
          setUploadStatus("头像保存失败，请检查网络");
        } finally {
          setIsUploading(false);
        }
      }
    };
    input.click();
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      degree: "新学历",
      school: "新学校",
      major: "新专业",
      gradDate: "202X-XX"
    };
    saveData({ ...data, education: [...data.education, newEdu] });
  };

  const removeEducation = (id: string) => {
    saveData({ ...data, education: data.education.filter(e => e.id !== id) });
  };

  const addWork = () => {
    const newWork: WorkExperience = {
      id: Date.now().toString(),
      company: "新公司",
      role: "新职位",
      industry: "行业类别",
      period: "20XX - 至今",
      desc: "描述工作内容..."
    };
    saveData({ ...data, workExperience: [...data.workExperience, newWork] });
  };

  const removeWork = (id: string) => {
    saveData({ ...data, workExperience: data.workExperience.filter(w => w.id !== id) });
  };

  const handleFileUpload = (projectId: string) => {
    if (!isAuthorMode) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.xlsx,.xls';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        setIsUploading(true);
        setUploadStatus("准备上传...");
        try {
          // 1. Upload to Supabase Storage
          // Use a strictly safe ASCII key for storage to avoid "Invalid key" errors with non-ASCII chars
          const fileExt = file.name.split('.').pop();
          const storageKey = `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
          
          setUploadStatus("正在推送至云存储...");
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('resume_files')
            .upload(storageKey, file, { contentType: file.type });

          if (uploadError) throw uploadError;

          // 2. Get Public URL
          setUploadStatus("获取资源链接...");
          const { data: urlData } = supabase.storage
            .from('resume_files')
            .getPublicUrl(storageKey);

          const publicUrl = urlData.publicUrl;

          // 3. Update State & DB
          setUploadStatus("正在更新个人配置...");
          const newFile: ProjectFile = {
            id: Date.now().toString(),
            name: file.name,
            url: publicUrl,
            type: file.name.endsWith('.pdf') ? 'pdf' : 'excel'
          };
          
          const newData = { ...data };
          const project = newData.projects.find(p => p.id === projectId);
          if (project) {
            project.files.push(newFile);
            await saveData(newData);
            if (selectedProject?.id === projectId) {
              setSelectedProject({ ...project });
            }
          }
          setUploadStatus("上传成功！");
          setTimeout(() => setUploadStatus(null), 3000);
        } catch (err: any) {
          console.error("Upload failed details:", err);
          setUploadStatus(`失败: ${err.message || '网络或权限错误'}`);
          // Don't auto-clear the error if it's important
        } finally {
          setIsUploading(false);
        }
      }
    };
    input.click();
  };

  const removeFile = (projectId: string, fileId: string) => {
    const newData = { ...data };
    const project = newData.projects.find(p => p.id === projectId);
    if (project) {
      project.files = project.files.filter(f => f.id !== fileId);
      saveData(newData);
      if (selectedProject?.id === projectId) {
        setSelectedProject({ ...project });
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-700 pb-20 md:pb-0">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm no-print">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => setActiveTab('home')}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-lg group-hover:rotate-12 transition-transform">
                {data.name.charAt(0)}
              </div>
              <h1 className="text-xl font-black tracking-tighter text-gray-900">
                {isAuthorMode ? (
                  <input 
                    className="bg-transparent border-none focus:ring-0 p-0 w-32"
                    value={data.name}
                    onChange={(e) => updateField('name', e.target.value)}
                  />
                ) : data.name}
              </h1>
            </div>
            
            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1 p-1 bg-gray-100/50 rounded-xl">
              {[
                { id: 'home', label: '个人主页', icon: User },
                { id: 'work', label: '工作经历', icon: Briefcase },
                { id: 'portfolio', label: '作品展示', icon: LayoutGrid },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                    activeTab === tab.id 
                      ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-100' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrint}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-2"
              title="下载 PDF 简历"
            >
              <Printer size={20} />
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest">导出 PDF</span>
            </button>
            {isAuthorMode ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-1 bg-orange-100 text-orange-600 rounded uppercase tracking-wider">作者模式</span>
                <button 
                  onClick={() => setIsAuthorMode(false)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="退出登录"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLogin(true)}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="作者登录"
              >
                <LogIn size={20} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.section
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid md:grid-cols-[1fr_300px] gap-12 items-center"
            >
              <div className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 leading-none">
                    你好，我是<br />
                    <span className="text-blue-600">{data.name}</span>
                  </h2>

                  {/* Mobile Profile Photo (shown only on mobile, placed between name and bio) */}
                  <div className="md:hidden flex flex-col items-center gap-4 py-4">
                    <div 
                      className={`relative w-48 h-48 rounded-2xl overflow-hidden bg-gray-200 border-4 border-white shadow-xl ${isAuthorMode ? 'cursor-pointer group' : ''}`}
                      onClick={handleAvatarChange}
                    >
                      {avatarSrc ? (
                        <img 
                          src={avatarSrc} 
                          alt={data.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <User size={60} strokeWidth={1} />
                        </div>
                      )}
                      {isAuthorMode && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Upload className="text-white" size={24} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-lg text-gray-500 font-medium leading-relaxed">
                    {isAuthorMode ? (
                      <textarea 
                        className="bg-transparent border-b border-gray-200 focus:border-blue-500 outline-none w-full resize-none min-h-[120px]"
                        value={data.tagline}
                        onChange={(e) => updateField('tagline', e.target.value)}
                      />
                    ) : data.tagline}
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap gap-2 items-center"
                  >
                    {(data.keywords || []).map((tag, idx) => (
                      <div 
                        key={idx}
                        className="group relative"
                      >
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg uppercase tracking-wider flex items-center gap-1">
                          {tag}
                          {isAuthorMode && (
                            <X 
                              size={12} 
                              className="cursor-pointer hover:text-red-500" 
                              onClick={() => removeKeyword(idx)}
                            />
                          )}
                        </span>
                      </div>
                    ))}
                    {isAuthorMode && (
                      <button 
                        onClick={addKeyword}
                        className="p-1 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors no-print"
                      >
                        <Plus size={16} />
                      </button>
                    )}
                  </motion.div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                    <GraduationCap className="text-blue-500" />
                    教育背景
                    {isAuthorMode && (
                      <button onClick={addEducation} className="p-1 text-blue-500 hover:bg-blue-50 rounded-full transition-colors no-print">
                        <Plus size={16} />
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {data.education.map((edu) => (
                      <div key={edu.id} className="relative group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        {isAuthorMode && (
                          <button 
                            onClick={() => removeEducation(edu.id)}
                            className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity no-print"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <div className="grid sm:grid-cols-[1fr_auto] gap-2">
                          <div className="space-y-1">
                            {isAuthorMode ? (
                              <div className="space-y-2">
                                <input 
                                  className="block w-full font-bold text-gray-900 border-b border-gray-100 focus:border-blue-500 outline-none"
                                  value={edu.school}
                                  onChange={(e) => {
                                    const newEdu = data.education.map(item => item.id === edu.id ? { ...item, school: e.target.value } : item);
                                    saveData({ ...data, education: newEdu });
                                  }}
                                />
                                <div className="flex gap-4">
                                  <input 
                                    className="text-sm text-gray-600 border-b border-gray-100 focus:border-blue-500 outline-none"
                                    value={edu.degree}
                                    onChange={(e) => {
                                      const newEdu = data.education.map(item => item.id === edu.id ? { ...item, degree: e.target.value } : item);
                                      saveData({ ...data, education: newEdu });
                                    }}
                                  />
                                  <input 
                                    className="text-sm text-gray-600 border-b border-gray-100 focus:border-blue-500 outline-none"
                                    value={edu.major}
                                    onChange={(e) => {
                                      const newEdu = data.education.map(item => item.id === edu.id ? { ...item, major: e.target.value } : item);
                                      saveData({ ...data, education: newEdu });
                                    }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <>
                                <h3 className="font-bold text-gray-900 text-lg">{edu.school}</h3>
                                <p className="text-gray-600">{edu.degree} · {edu.major}</p>
                              </>
                            )}
                          </div>
                          <div className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full h-fit">
                            {isAuthorMode ? (
                              <input 
                                className="bg-transparent border-none focus:ring-0 p-0 w-20 text-center"
                                value={edu.gradDate}
                                onChange={(e) => {
                                  const newEdu = data.education.map(item => item.id === edu.id ? { ...item, gradDate: e.target.value } : item);
                                  saveData({ ...data, education: newEdu });
                                }}
                              />
                            ) : edu.gradDate}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop Profile Photo (hidden on mobile) */}
              <div className="hidden md:flex flex-col items-center gap-6">
                <div 
                  className={`relative w-64 h-64 md:w-72 md:h-72 rounded-3xl overflow-hidden bg-gray-200 border-4 border-white shadow-2xl transition-transform hover:scale-105 ${isAuthorMode ? 'cursor-pointer group' : ''}`}
                  onClick={handleAvatarChange}
                >
                  {avatarSrc ? (
                    <img 
                      src={avatarSrc} 
                      alt={data.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <User size={80} strokeWidth={1} />
                    </div>
                  )}
                  {isAuthorMode && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="text-white" size={32} />
                    </div>
                  )}
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Available for hire</p>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === 'work' && (
            <motion.section
              key="work"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-4xl font-black tracking-tight">工作经历</h2>
                {isAuthorMode && (
                  <button 
                    onClick={addWork}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 no-print"
                  >
                    <Plus size={18} /> 添加经历
                  </button>
                )}
              </div>

              <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:ml-[160px] md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                {data.workExperience.map((work) => (
                  <div key={work.id} className="relative flex items-start group">
                    {/* Time on left (Desktop) */}
                    <div className="hidden md:flex md:w-[140px] md:pt-4 md:justify-end md:pr-8 shrink-0">
                      <div className="text-right">
                        <time className="text-sm font-black text-gray-400 uppercase tracking-tighter">
                          {isAuthorMode ? (
                            <input 
                              className="bg-transparent border-none focus:ring-0 p-0 w-full text-right"
                              value={work.period}
                              onChange={(e) => {
                                const newWork = data.workExperience.map(item => item.id === work.id ? { ...item, period: e.target.value } : item);
                                saveData({ ...data, workExperience: newWork });
                              }}
                            />
                          ) : work.period}
                        </time>
                      </div>
                    </div>

                    {/* Dot */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-500 text-white shadow-xl shadow-blue-100 shrink-0 z-10 md:mt-2">
                      <Briefcase size={16} />
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 ml-6 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative">
                      {isAuthorMode && (
                        <button 
                          onClick={() => removeWork(work.id)}
                          className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors no-print"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}

                      {/* Time for mobile */}
                      <div className="md:hidden mb-3">
                        <time className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                          {isAuthorMode ? (
                            <input 
                              className="bg-transparent border-none focus:ring-0 p-0 w-full"
                              value={work.period}
                              onChange={(e) => {
                                const newWork = data.workExperience.map(item => item.id === work.id ? { ...item, period: e.target.value } : item);
                                saveData({ ...data, workExperience: newWork });
                              }}
                            />
                          ) : work.period}
                        </time>
                      </div>

                      <div className="flex flex-col gap-2 mb-6">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-2xl font-black text-gray-900 leading-tight">
                            {isAuthorMode ? (
                              <input 
                                className="bg-transparent border-none focus:ring-0 p-0 w-full"
                                value={work.company}
                                onChange={(e) => {
                                  const newWork = data.workExperience.map(item => item.id === work.id ? { ...item, company: e.target.value } : item);
                                  saveData({ ...data, workExperience: newWork });
                                }}
                              />
                            ) : work.company}
                          </h3>
                          {isAuthorMode ? (
                            <input 
                              className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded uppercase tracking-widest border-none focus:ring-0 w-24"
                              value={work.industry || ""}
                              placeholder="行业"
                              onChange={(e) => {
                                const newWork = data.workExperience.map(item => item.id === work.id ? { ...item, industry: e.target.value } : item);
                                saveData({ ...data, workExperience: newWork });
                              }}
                            />
                          ) : work.industry && (
                            <span className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded uppercase tracking-widest">
                              {work.industry}
                            </span>
                          )}
                        </div>
                        <div className="text-base font-bold text-gray-500 italic">
                          {isAuthorMode ? (
                            <input 
                              className="bg-transparent border-none focus:ring-0 p-0 w-full"
                              value={work.role}
                              onChange={(e) => {
                                const newWork = data.workExperience.map(item => item.id === work.id ? { ...item, role: e.target.value } : item);
                                saveData({ ...data, workExperience: newWork });
                              }}
                            />
                          ) : work.role}
                        </div>
                      </div>

                      <div className="text-gray-600 leading-relaxed text-sm md:text-base">
                        {isAuthorMode ? (
                          <textarea 
                            className="bg-transparent border-none focus:ring-0 p-0 w-full resize-none min-h-[100px]"
                            value={work.desc}
                            onChange={(e) => {
                              const newWork = data.workExperience.map(item => item.id === work.id ? { ...item, desc: e.target.value } : item);
                              saveData({ ...data, workExperience: newWork });
                            }}
                          />
                        ) : formatNumberedList(work.desc)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {activeTab === 'portfolio' && (
            <motion.section
              key="portfolio"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-black tracking-tight">作品展示</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">点击下方板块查看项目详情及相关文件</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.projects.map((project, idx) => (
                  <motion.div
                    key={project.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedProject(project)}
                    className="relative aspect-video rounded-[2rem] overflow-hidden cursor-pointer group shadow-2xl"
                  >
                    {/* Background Image with Dynamic Mapping */}
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                      <img 
                        src={getProjectBg(project)} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {/* Dark gradient overlay for text protection */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                    </div>

                    <div className="relative h-full p-8 flex flex-col justify-end text-white">
                      <div className="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all">
                        <ExternalLink size={20} />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-3xl font-black tracking-tight drop-shadow-lg">{project.title}</h3>
                        <p className="text-white/80 line-clamp-2 text-sm drop-shadow-md leading-relaxed">
                          {project.desc.split(/[。]/)[0]}。
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-50 no-print">
        <div className="bg-white/90 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-2xl p-2 flex items-center justify-around">
          {[
            { id: 'home', label: '主页', icon: User },
            { id: 'work', label: '经历', icon: Briefcase },
            { id: 'portfolio', label: '作品', icon: LayoutGrid },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={20} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {isSaved && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 no-print"
          >
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <Check size={12} strokeWidth={3} />
            </div>
            <span className="text-sm font-bold tracking-wide">已成功保存到您的本地浏览器</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 no-print">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogin(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <LogIn size={32} />
                </div>
                <h3 className="text-2xl font-black tracking-tight">作者登录</h3>
                <p className="text-gray-500 text-sm">请输入您的凭据以进入编辑模式</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">账号</label>
                  <input 
                    name="username"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    placeholder="请输入账号"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">密码</label>
                  <input 
                    name="password"
                    type="password"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    placeholder="请输入密码"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98]"
                >
                  登录
                </button>
              </form>
              <button 
                onClick={() => setShowLogin(false)}
                className="w-full text-sm text-gray-400 font-medium hover:text-gray-600 transition-colors"
              >
                取消
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 no-print">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 space-y-6 overflow-y-auto">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-widest">Project Details</div>
                    <h3 className="text-3xl font-black tracking-tight">
                      {isAuthorMode ? (
                        <input 
                          className="bg-transparent border-b border-gray-100 focus:border-blue-500 outline-none w-full"
                          value={selectedProject.title}
                          onChange={(e) => {
                            const newData = { ...data };
                            const project = newData.projects.find(p => p.id === selectedProject.id);
                            if (project) {
                              project.title = e.target.value;
                              saveData(newData);
                              setSelectedProject({ ...project });
                            }
                          }}
                        />
                      ) : selectedProject.title}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="text-gray-600 leading-relaxed text-lg">
                  {isAuthorMode ? (
                    <textarea 
                      className="bg-transparent border border-gray-100 rounded-xl p-4 focus:border-blue-500 outline-none w-full resize-none min-h-[200px]"
                      value={selectedProject.desc}
                      onChange={(e) => {
                        const newData = { ...data };
                        const project = newData.projects.find(p => p.id === selectedProject.id);
                        if (project) {
                          project.desc = e.target.value;
                          saveData(newData);
                          setSelectedProject({ ...project });
                        }
                      }}
                    />
                  ) : (
                    <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100/50 text-gray-800">
                      {formatDescription(selectedProject.desc)}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-4">
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">相关文件</h4>
                      {uploadStatus && (
                        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse transition-colors ${
                          uploadStatus.startsWith('失败') ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {uploadStatus}
                        </div>
                      )}
                    </div>
                    {isAuthorMode && (
                      <button 
                        onClick={() => handleFileUpload(selectedProject.id)}
                        disabled={isUploading}
                        className={`text-xs font-bold flex items-center gap-1 transition-colors ${
                          isUploading ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-700'
                        }`}
                      >
                        {isUploading ? (
                          <>
                            <div className="w-3 h-3 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                            上传中...
                          </>
                        ) : (
                          <>
                            <Plus size={14} /> 上传文件
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  
                  {selectedProject.files.length > 0 ? (
                    <div className="grid gap-3">
                      {selectedProject.files.map((file) => (
                        <div key={file.id} className="group flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${file.type === 'pdf' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                              {file.type === 'pdf' ? <FileText size={20} /> : <Table size={20} />}
                            </div>
                            <span className="text-sm font-bold text-gray-700">{file.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setPreviewFile(file)}
                              className="px-4 py-2 bg-white text-blue-600 rounded-xl text-xs font-bold shadow-sm hover:bg-blue-600 hover:text-white transition-all ring-1 ring-blue-100"
                            >
                              在线预览
                            </button>
                            {isAuthorMode && (
                              <>
                                <a 
                                  href={file.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                  title="下载原文件"
                                >
                                  <ExternalLink size={18} />
                                </a>
                                <button 
                                  onClick={() => removeFile(selectedProject.id, file.id)}
                                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400 text-sm italic">
                      暂无相关文件
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-bold hover:bg-gray-800 transition-colors"
                >
                  关闭详情
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PDF Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 no-print">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewFile(null)}
              className="absolute inset-0 bg-gray-900/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-5xl h-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 leading-none">{previewFile.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium uppercase tracking-widest text-left">受保护的在线预览模式</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isAuthorMode && (
                    <a 
                      href={previewFile.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
                    >
                      <Upload size={14} /> 原始链接
                    </a>
                  )}
                  <button 
                    onClick={() => setPreviewFile(null)}
                    className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-gray-100 relative">
                {previewFile.type === 'pdf' ? (
                  <div className="w-full h-full relative">
                    <iframe 
                      src={`${previewFile.url}#toolbar=0&navpanes=0`} 
                      className="w-full h-full border-none"
                      title="PDF Preview"
                    />
                    {/* Fallback button for some network environments or previous files lacking content-type */}
                    <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
                       <a 
                         href={previewFile.url} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition flex items-center justify-center"
                       >
                         在新窗口中打开
                       </a>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center space-y-4">
                    <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center">
                      <Table size={40} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-gray-900">Excel 暂不支持在线直接预览</h3>
                      <p className="text-gray-500 text-sm">请联系作者获取文件访问权限</p>
                    </div>
                  </div>
                )}
                {/* Visual watermark/protection layer (optional, just makes it harder to right click) */}
                <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center opacity-[0.03]">
                  <span className="text-6xl font-black rotate-[-45deg]">{data.name} 内部作品</span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  预览模式受限 · 不提供公开下载链接
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-gray-100 no-print">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-gray-400 font-medium">
            © {new Date().getFullYear()} {data.name}. Built with Passion.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><User size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Briefcase size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><LayoutGrid size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
