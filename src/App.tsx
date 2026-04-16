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
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
}

// --- Constants ---

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
      period: "2023.04 - 2025.07",
      desc: "负责商户进场、履约、续费、退场全流程管理；每日/月度统计销售数据，做盈亏分析、经营诊断；定期调研区域商业竞品，输出分析报告，支撑差异化策略与客户拓展；搭建费用台账，跟进回款，处理合同变更/纠纷。"
    },
    {
      id: '2',
      company: "曲水世纪金源方圆荟商业管理有限公司四川分公司",
      role: "开发拓展部—管培生",
      period: "2021.06 - 2023.04",
      desc: "开展区域市场、竞品格局、客户需求调研，输出市场机会研判报告，为业务拓展策略提供数据支撑；搭建投资回报测算模型，完成营收预测、成本分析、投资回报率评估及租金定价；分析客户画像、消费能力与需求偏好，完成客群抓取与场景定位。"
    },
    {
      id: '3',
      company: "中国建筑（东南亚）有限公司",
      role: "商务部—见习商务工程师",
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
  avatarUrl: ""
};

// --- Components ---

export default function App() {
  console.log('App component is rendering');
  const [activeTab, setActiveTab] = useState<'home' | 'work' | 'portfolio'>('home');
  const [isAuthorMode, setIsAuthorMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [data, setData] = useState<ResumeData>(DEFAULT_DATA);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

  // Persistence
  useEffect(() => {
    const savedData = localStorage.getItem('resume_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed && typeof parsed === 'object') {
          setData(parsed);
        }
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  const saveData = (newData: ResumeData) => {
    setData(newData);
    localStorage.setItem('resume_data', JSON.stringify(newData));
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
    } else {
      alert("账号或密码错误");
    }
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
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          updateField('avatarUrl', re.target?.result as string);
        };
        reader.readAsDataURL(file);
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
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Url = event.target?.result as string;
          const newFile: ProjectFile = {
            id: Date.now().toString(),
            name: file.name,
            url: base64Url, // Store as base64 string
            type: file.name.endsWith('.pdf') ? 'pdf' : 'excel'
          };
          const newData = { ...data };
          const project = newData.projects.find(p => p.id === projectId);
          if (project) {
            project.files.push(newFile);
            saveData(newData);
            if (selectedProject?.id === projectId) {
              setSelectedProject({ ...project });
            }
          }
        };
        reader.readAsDataURL(file);
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* Header with Name */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 
            className="text-2xl font-bold tracking-tight text-gray-900 cursor-pointer"
            onClick={() => setActiveTab('home')}
          >
            {isAuthorMode ? (
              <input 
                className="bg-transparent border-none focus:ring-0 p-0 w-48 text-2xl font-bold"
                value={data.name}
                onChange={(e) => updateField('name', e.target.value)}
              />
            ) : data.name}
          </h1>
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <LayoutGrid size={24} />}
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
      </header>

      {/* Navigation Tabs */}
      <nav className="sticky top-0 z-50 bg-white border-b-2 border-gray-200 shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-14 space-x-1">
            {
              [
                { id: 'home', label: '个人主页', icon: User },
                { id: 'work', label: '工作经历', icon: Briefcase },
                { id: 'portfolio', label: '作品展示', icon: LayoutGrid },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 h-full px-4 py-3 text-base font-medium transition-all flex items-center justify-center gap-2 ${
                    activeTab === tab.id 
                      ? 'bg-blue-600 text-white border-b-4 border-yellow-400' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))
            }
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              <div className="px-4 py-3 space-y-2">
                {
                  [
                    { id: 'home', label: '个人主页', icon: User },
                    { id: 'work', label: '工作经历', icon: Briefcase },
                    { id: 'portfolio', label: '作品展示', icon: LayoutGrid },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${
                        activeTab === tab.id 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <tab.icon size={18} />
                      {tab.label}
                    </button>
                  ))
                }
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
                <div className="space-y-4">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-widest"
                  >
                    Welcome to my space
                  </motion.div>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 leading-none">
                    你好，我是<br />
                    <span className="text-blue-600">{data.name}</span>
                  </h2>
                  <div className="text-lg text-gray-500 font-medium leading-relaxed">
                    {isAuthorMode ? (
                      <textarea 
                        className="bg-transparent border-b border-gray-200 focus:border-blue-500 outline-none w-full resize-none min-h-[120px]"
                        value={data.tagline}
                        onChange={(e) => updateField('tagline', e.target.value)}
                      />
                    ) : data.tagline}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                    <GraduationCap className="text-blue-500" />
                    教育背景
                    {isAuthorMode && (
                      <button onClick={addEducation} className="p-1 text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
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
                            className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
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

              <div className="flex flex-col items-center gap-6">
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
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                  >
                    <Plus size={18} /> 添加经历
                  </button>
                )}
              </div>

              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                {data.workExperience.map((work, index) => (
                  <div key={work.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    {/* Dot */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <Briefcase size={16} />
                    </div>
                    {/* Content */}
                    <div className="w-[calc(100%-4rem)] md:w-[45%] p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                      {isAuthorMode && (
                        <button 
                          onClick={() => removeWork(work.id)}
                          className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      <div className="flex flex-col gap-1 mb-4">
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
                        <div className="text-xl font-black text-gray-900">
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
                        </div>
                        <div className="text-sm font-semibold text-gray-500">
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
                      <div className="text-gray-600 leading-relaxed">
                        {isAuthorMode ? (
                          <textarea 
                            className="bg-transparent border-none focus:ring-0 p-0 w-full resize-none min-h-[80px]"
                            value={work.desc}
                            onChange={(e) => {
                              const newWork = data.workExperience.map(item => item.id === work.id ? { ...item, desc: e.target.value } : item);
                              saveData({ ...data, workExperience: newWork });
                            }}
                          />
                        ) : (
                          <ol className="list-decimal list-inside space-y-1">
                            {work.desc.split('；').filter(item => item.trim() !== '').map((item, index) => (
                              <li key={index}>{item.trim()}</li>
                            ))}
                          </ol>
                        )}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.projects.map((project, idx) => (
                  <motion.div
                    key={project.id}
                    whileHover={{ y: -8 }}
                    onClick={() => setSelectedProject(project)}
                    className={`relative aspect-video rounded-3xl p-8 flex flex-col justify-end cursor-pointer overflow-hidden group shadow-lg ${
                      idx === 0 ? 'bg-blue-600 text-white' : 
                      idx === 1 ? 'bg-emerald-500 text-white' : 
                      idx === 2 ? 'bg-orange-500 text-white' : 
                      'bg-purple-600 text-white'
                    }`}
                  >
                    <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-100 transition-opacity">
                      <ExternalLink size={24} />
                    </div>
                    <div className="space-y-2 relative z-10">
                      <h3 className="text-2xl font-black tracking-tight">{project.title}</h3>
                      <p className="text-white/80 line-clamp-2 text-sm leading-relaxed">{project.desc}</p>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
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
                      className="bg-transparent border border-gray-100 rounded-xl p-4 focus:border-blue-500 outline-none w-full resize-none min-h-[120px]"
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
                  ) : selectedProject.desc}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">相关文件</h4>
                    {isAuthorMode && (
                      <button 
                        onClick={() => handleFileUpload(selectedProject.id)}
                        className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:text-blue-700"
                      >
                        <Plus size={14} /> 上传文件
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
                            <a 
                              href={file.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <ExternalLink size={18} />
                            </a>
                            {isAuthorMode && (
                              <button 
                                onClick={() => removeFile(selectedProject.id, file.id)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
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

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-gray-100">
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
