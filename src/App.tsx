import { useState, useCallback, useRef, useEffect } from 'react';
import type { Unit } from './data/units';
import { units as allUnits, unitCategories } from './data/units';
import { X, Download, Share2, RotateCcw, ChevronDown, ChevronUp, ExternalLink, Globe, MessageSquarePlus, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

interface SelectedUnit extends Unit {
  comment?: string;
}

type Language = 'zh' | 'en';

// 翻译文本
const translations = {
  zh: {
    title: '我最心爱的9个钢指单位',
    titleSuffix: '',
    subtitle: '选择你最心爱的9个钢铁指挥官单位',
    reset: '重置',
    share: '分享',
    export: '导出',
    preview: '预览',
    selected: '已选择',
    of9: '/9 个单位',
    complete: '✓ 选择完成！点击导出生成分享图',
    need9: '请选择满9个单位后再导出',
    max9: '最多只能选择9个单位',
    addComment: '添加备注',
    editComment: '编辑备注',
    commentPlaceholder: '输入你对这个单位的评价...',
    cancel: '取消',
    save: '保存',
    generateImage: '生成图片',
    nickname: '输入你的昵称（可选）',
    nicknamePlaceholder: '例如：钢铁指挥官',
    shareTitle: '分享你的选择',
    shareLink: '分享链接',
    copyLink: '复制链接',
    joinCommunity: '加入钢铁指挥官社区',
    steamStore: 'Steam商店',
    qqGroup: 'QQ交流群',
    qqChannel: 'QQ频道',
    xiaoheihe: '小黑盒',
    scanToVisit: '扫码制作你的分享图',
    generatedBy: 'Max Linker with Kimi',
    switchLang: 'English',
    lightUnits: '轻型单位',
    mediumUnits: '中型单位',
    heavyUnits: '重型/超重型单位',
    selectedList: '已选单位列表',
    author: 'Max Linker with Kimi',
  },
  en: {
    title: 'My 9 Favorite Mechabellum Units',
    titleSuffix: '',
    subtitle: 'Choose your 9 favorite Mechabellum units',
    reset: 'Reset',
    share: 'Share',
    export: 'Export',
    preview: 'Preview',
    selected: 'Selected',
    of9: '/9 units',
    complete: '✓ Complete! Click Export to generate image',
    need9: 'Please select 9 units before exporting',
    max9: 'Maximum 9 units allowed',
    addComment: 'Add Note',
    editComment: 'Edit Note',
    commentPlaceholder: 'Enter your thoughts on this unit...',
    cancel: 'Cancel',
    save: 'Save',
    generateImage: 'Generate Image',
    nickname: 'Enter your nickname (optional)',
    nicknamePlaceholder: 'e.g., MechaCommander',
    shareTitle: 'Share Your Selection',
    shareLink: 'Share Link',
    copyLink: 'Copy Link',
    joinCommunity: 'Join Mechabellum Community',
    steamStore: 'Steam Store',
    qqGroup: 'QQ Group',
    qqChannel: 'QQ Channel',
    xiaoheihe: 'Xiaoheihe',
    scanToVisit: 'Scan to create your share image',
    generatedBy: 'Max Linker with Kimi',
    switchLang: '中文',
    lightUnits: 'Light Units',
    mediumUnits: 'Medium Units',
    heavyUnits: 'Heavy/Super Heavy Units',
    selectedList: 'Selected Units',
    author: 'Max Linker with Kimi',
  },
};

// 社区链接配置
const communityLinks = [
  { name: 'Steam商店', nameEn: 'Steam Store', url: 'https://store.steampowered.com/app/669330/', icon: '🎮' },
  { name: 'QQ交流群', nameEn: 'QQ Group', url: 'https://qm.qq.com/q/226025841', icon: '💬' },
  { name: 'QQ频道', nameEn: 'QQ Channel', url: 'https://pd.qq.com/g/pd90070872', icon: '📢' },
  { name: '小黑盒', nameEn: 'Xiaoheihe', url: 'https://api.xiaoheihe.cn/s/10019c', icon: '📦' },
];

function App() {
  const [lang, setLang] = useState<Language>('zh');
  const t = translations[lang];
  
  const [selectedUnits, setSelectedUnits] = useState<SelectedUnit[]>([]);
  const [commentUnit, setCommentUnit] = useState<SelectedUnit | null>(null);
  const [commentText, setCommentText] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['light', 'medium', 'heavy']));
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [nickname, setNickname] = useState('');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const exportRef = useRef<HTMLDivElement>(null);

  // 切换语言
  const toggleLang = useCallback(() => {
    setLang(prev => prev === 'zh' ? 'en' : 'zh');
  }, []);

  // 按类别分组
  const unitsByCategory = allUnits.reduce((acc, unit) => {
    if (!acc[unit.category]) acc[unit.category] = [];
    acc[unit.category].push(unit);
    return acc;
  }, {} as Record<string, Unit[]>);

  // 选择单位
  const selectUnit = useCallback((unit: Unit) => {
    setSelectedUnits(prev => {
      if (prev.find(u => u.id === unit.id)) {
        return prev.filter(u => u.id !== unit.id);
      }
      if (prev.length >= 9) {
        toast.error(translations[lang].max9);
        return prev;
      }
      return [...prev, unit];
    });
  }, [lang]);

  // 移除单位
  const removeUnit = useCallback((unitId: string) => {
    setSelectedUnits(prev => prev.filter(u => u.id !== unitId));
  }, []);

  // 打开评论对话框
  const openComment = useCallback((unit: SelectedUnit, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCommentUnit(unit);
    setCommentText(unit.comment || '');
  }, []);

  // 保存评论
  const saveComment = useCallback(() => {
    if (commentUnit) {
      setSelectedUnits(prev =>
        prev.map(u => (u.id === commentUnit.id ? { ...u, comment: commentText } : u))
      );
      setCommentUnit(null);
    }
  }, [commentUnit, commentText]);

  // 生成分享数据
  const generateShareData = useCallback(() => {
    const data = selectedUnits.map(u => ({
      id: u.id,
      c: u.comment,
    }));
    const json = JSON.stringify(data);
    const base64 = btoa(encodeURIComponent(json));
    return base64;
  }, [selectedUnits]);

  // 打开导出对话框（检查是否选满9个）
  const openExportDialog = useCallback(async () => {
    if (selectedUnits.length !== 9) {
      toast.error(t.need9);
      return;
    }
    setExportDialogOpen(true);
    // 生成预览
    setTimeout(async () => {
      if (exportRef.current) {
        try {
          const canvas = await html2canvas(exportRef.current, {
            backgroundColor: '#16161d',
            scale: 1,
            useCORS: true,
            allowTaint: true,
            logging: false,
          });
          setPreviewImage(canvas.toDataURL('image/png'));
        } catch (error) {
          console.error('Preview error:', error);
        }
      }
    }, 100);
  }, [selectedUnits.length, t]);

  // 导出图片
  const exportImage = useCallback(async () => {
    if (!exportRef.current) return;
    
    try {
      toast.info(lang === 'zh' ? '正在生成...' : 'Generating...');
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#16161d',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      
      const link = document.createElement('a');
      const name = nickname || (lang === 'zh' ? '玩家' : 'Player');
      link.download = lang === 'zh' 
        ? `${name}的最心爱的9个钢指单位.png`
        : `${name}_9_Favorite_Units.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success(lang === 'zh' ? '图片已保存' : 'Image saved');
      setExportDialogOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error(lang === 'zh' ? '生成图片失败' : 'Failed to generate image');
    }
  }, [nickname, lang, t]);

  // 打开分享对话框
  const openShareDialog = useCallback(() => {
    try {
      const base64 = generateShareData();
      const url = `${window.location.origin}${window.location.pathname}?s=${base64}`;
      setShareUrl(url);
      setShareDialogOpen(true);
    } catch (error) {
      toast.error(lang === 'zh' ? '生成分享链接失败' : 'Failed to generate share link');
    }
  }, [generateShareData, lang]);

  // 复制分享链接
  const copyShareLink = useCallback(() => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success(lang === 'zh' ? '分享链接已复制' : 'Share link copied');
    }).catch(() => {
      toast.error(lang === 'zh' ? '复制失败' : 'Copy failed');
    });
  }, [shareUrl, lang]);

  // 重置
  const reset = useCallback(() => {
    setSelectedUnits([]);
    setNickname('');
    setPreviewImage('');
    toast.info(lang === 'zh' ? '已重置选择' : 'Selection reset');
  }, [lang]);

  // 切换类别展开
  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  // 从URL加载分享数据
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareData = params.get('s');
    if (shareData) {
      try {
        const json = decodeURIComponent(atob(shareData));
        const data = JSON.parse(json) as { id: string; c?: string }[];
        const loadedUnits: SelectedUnit[] = [];
        for (const d of data) {
          const unit = allUnits.find(u => u.id === d.id);
          if (unit) {
            loadedUnits.push({ ...unit, comment: d.c });
          }
        }
        setSelectedUnits(loadedUnits);
        toast.success(lang === 'zh' ? '已加载分享的数据' : 'Shared data loaded');
        window.history.replaceState({}, '', window.location.pathname);
      } catch (error) {
        console.error('Parse error:', error);
        toast.error(lang === 'zh' ? '分享链接无效' : 'Invalid share link');
      }
    }
  }, [lang]);

  // 获取类别名称
  const getCategoryName = (id: string) => {
    if (id === 'light') return t.lightUnits;
    if (id === 'medium') return t.mediumUnits;
    return t.heavyUnits;
  };

  // 获取当前域名
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div className="min-h-screen bg-[#0c0c10] text-[#f0f0f0]">
      {/* 头部 */}
      <header className="border-b border-[#2c2c36] bg-[#16161d]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                {t.title}
              </h1>
              <p className="text-sm text-[#7a7a8c] mt-1">{t.subtitle}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLang}
                className="border-[#444] bg-[#23232c] hover:bg-[#333340] text-white"
              >
                <Globe className="w-4 h-4 mr-1" />
                {t.switchLang}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={reset}
                className="border-[#444] bg-[#23232c] hover:bg-[#333340] text-white"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                {t.reset}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={openShareDialog}
                disabled={selectedUnits.length === 0}
                className="border-[#444] bg-[#23232c] hover:bg-[#333340] text-white disabled:opacity-50"
              >
                <Share2 className="w-4 h-4 mr-1" />
                {t.share}
              </Button>
              <Button
                size="sm"
                onClick={openExportDialog}
                disabled={selectedUnits.length !== 9}
                className="bg-[#00e5ff] text-black hover:bg-[#00c8dd] font-bold disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-1" />
                {t.export}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：单位选择 */}
          <div className="space-y-4">
            {/* 提示 */}
            <div className="bg-[#1a1a22] border border-[#2a2a35] rounded-lg p-3 text-sm text-[#7a7a8c]">
              <p>💡 {lang === 'zh' ? '点击单位添加到右侧，点击已选单位上的' : 'Click units to add, click '}
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#2979ff] text-white text-xs mx-1">
                  <MessageSquarePlus className="w-3 h-3" />
                </span>
                {lang === 'zh' ? '添加备注' : 'on selected units to add notes'}
              </p>
            </div>

            {/* 单位列表 */}
            <div className="tech-panel p-4 space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto">
              {unitCategories.map(category => {
                const categoryUnits = unitsByCategory[category.id] || [];
                const isExpanded = expandedCategories.has(category.id);
                
                return (
                  <div key={category.id} className="border border-[#2a2a35] rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between p-3 bg-[#1a1a22] hover:bg-[#22222a] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ background: category.color }}
                        />
                        <span className="font-bold">{getCategoryName(category.id)}</span>
                        <span className="text-xs text-[#7a7a8c]">({categoryUnits.length})</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#7a7a8c]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#7a7a8c]" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="p-2 grid grid-cols-3 gap-2">
                        {categoryUnits.map(unit => {
                          const isSelected = selectedUnits.some(u => u.id === unit.id);
                          return (
                            <button
                              key={unit.id}
                              onClick={() => selectUnit(unit)}
                              className={`unit-card p-2 text-left ${isSelected ? 'selected' : ''}`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span
                                  className="text-xs font-bold px-1.5 py-0.5 rounded"
                                  style={{
                                    background: `${category.color}20`,
                                    color: category.color,
                                  }}
                                >
                                  {unit.s}
                                </span>
                                {isSelected && (
                                  <span className="text-[#00e5ff] text-xs">✓</span>
                                )}
                              </div>
                              <div className="font-bold text-sm truncate">{lang === 'zh' ? unit.cn : unit.en}</div>
                              <div className="text-xs text-[#7a7a8c] truncate">{lang === 'zh' ? unit.en : unit.cn}</div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 右侧：已选单位展示 */}
          <div>
            {/* 预览区域 */}
            <div className="tech-panel p-6">
              {/* 标题区域 */}
              <div className="text-center mb-6 pb-6 border-b border-[#2c2c36]">
                <h2 className="text-2xl font-black text-white">
                  {t.title}
                </h2>
                <p className="text-sm text-[#7a7a8c] mt-2">
                  {t.author}
                </p>
              </div>

              {/* 9宫格 */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {Array.from({ length: 9 }).map((_, index) => {
                  const unit = selectedUnits[index];
                  return (
                    <div
                      key={index}
                      className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center relative overflow-hidden ${
                        unit
                          ? 'border-[#00e5ff] bg-[#0a1620]'
                          : 'border-dashed border-[#2c2c36] bg-[#121217]'
                      }`}
                    >
                      {unit ? (
                        <>
                          {/* 删除按钮 */}
                          <button
                            onClick={() => removeUnit(unit.id)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#ff3d00]/80 hover:bg-[#ff3d00] text-white flex items-center justify-center text-xs z-20"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          
                          {/* 备注按钮 */}
                          <button
                            onClick={(e) => openComment(unit, e)}
                            className={`absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center text-xs z-20 transition-all ${
                              unit.comment 
                                ? 'bg-[#00e5ff] text-black' 
                                : 'bg-[#2979ff]/80 hover:bg-[#2979ff] text-white'
                            }`}
                            title={unit.comment ? t.editComment : t.addComment}
                          >
                            {unit.comment ? '✎' : <MessageSquarePlus className="w-3.5 h-3.5" />}
                          </button>
                          
                          {/* 单位图标 - 使用img标签 */}
                          {unit.icon && (
                            <img 
                              src={unit.icon}
                              alt={unit.cn}
                              className="absolute inset-0 w-full h-full object-contain opacity-50 z-0 p-2"
                              style={{ transform: 'scale(0.85)' }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          )}
                          
                          {/* 单位信息 */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div
                              className="text-2xl font-black mb-1"
                              style={{
                                color: unitCategories.find(c => c.id === unit.category)?.color,
                                textShadow: '0 0 10px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.9)',
                              }}
                            >
                              {unit.s}
                            </div>
                            <div className="font-bold text-white text-center px-1 text-sm" style={{ textShadow: '0 0 8px rgba(0,0,0,0.9)' }}>
                              {lang === 'zh' ? unit.cn : unit.en}
                            </div>
                            <div className="text-xs text-[#a0a0b0] text-center px-1" style={{ textShadow: '0 0 6px rgba(0,0,0,0.9)' }}>
                              {lang === 'zh' ? unit.en : unit.cn}
                            </div>
                          </div>
                          
                          {/* 备注显示 */}
                          {unit.comment && (
                            <div className="absolute bottom-0 left-0 right-0 bg-[#00e5ff]/40 px-1 py-0.5 z-10">
                              <p className="text-[10px] text-white text-center truncate font-bold" style={{ textShadow: '0 0 4px rgba(0,0,0,0.9)' }}>
                                {unit.comment}
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-[#444] text-2xl font-bold">{index + 1}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 底部信息 */}
              <div className="text-center text-xs text-[#7a7a8c]">
                <p>{t.selected} {selectedUnits.length}{t.of9}</p>
                {selectedUnits.length === 9 && (
                  <p className="text-[#00e5ff] mt-1">{t.complete}</p>
                )}
              </div>
            </div>

            {/* 导出用隐藏区域 */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
              <div ref={exportRef} className="tech-panel p-8" style={{ width: '600px', background: '#16161d' }}>
                {/* 标题区域 */}
                <div className="text-center mb-6 pb-6 border-b border-[#2c2c36]">
                  <h2 className="text-3xl font-black text-white">
                    {nickname 
                      ? (lang === 'zh' ? `${nickname}的最心爱的9个钢指单位` : `${nickname}'s 9 Favorite Mechabellum Units`)
                      : (lang === 'zh' ? '我最心爱的9个钢指单位' : 'My 9 Favorite Mechabellum Units')
                    }
                  </h2>
                  <p className="text-base text-[#7a7a8c] mt-2">{t.author}</p>
                </div>

                {/* 9宫格 */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {Array.from({ length: 9 }).map((_, index) => {
                    const unit = selectedUnits[index];
                    return (
                      <div
                        key={index}
                        className={`rounded-lg border-2 flex flex-col items-center justify-center relative overflow-hidden ${
                          unit
                            ? 'border-[#00e5ff] bg-[#0a1620]'
                            : 'border-dashed border-[#2c2c36] bg-[#121217]'
                        }`}
                        style={{ height: '150px', width: '180px' }}
                      >
                        {unit ? (
                          <>
                            {/* 单位图标 */}
                            {unit.icon && (
                              <img 
                                src={`${baseUrl}${unit.icon}`}
                                alt={unit.cn}
                                className="absolute inset-0 w-full h-full object-contain opacity-60 z-0 p-2"
                                crossOrigin="anonymous"
                              />
                            )}
                            <div className="relative z-10 flex flex-col items-center">
                              <div
                                className="text-4xl font-black mb-1"
                                style={{
                                  color: unitCategories.find(c => c.id === unit.category)?.color,
                                  textShadow: '0 0 10px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.9)',
                                }}
                              >
                                {unit.s}
                              </div>
                              <div className="font-bold text-white text-base text-center px-2" style={{ textShadow: '0 0 8px rgba(0,0,0,0.9)' }}>
                                {lang === 'zh' ? unit.cn : unit.en}
                              </div>
                              <div className="text-xs text-[#a0a0b0] text-center px-2" style={{ textShadow: '0 0 6px rgba(0,0,0,0.9)' }}>
                                {lang === 'zh' ? unit.en : unit.cn}
                              </div>
                            </div>
                            {unit.comment && (
                              <div className="absolute bottom-0 left-0 right-0 bg-[#00e5ff]/40 px-2 py-1 z-10">
                                <p className="text-xs text-white text-center truncate font-bold" style={{ textShadow: '0 0 4px rgba(0,0,0,0.9)' }}>
                                  {unit.comment}
                                </p>
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-[#444] text-3xl font-bold">{index + 1}</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 简化底部信息 - 只保留网页二维码和链接 */}
                <div className="mt-8 pt-6 border-t border-[#2c2c36]">
                  <div className="flex items-center justify-center gap-6">
                    {/* 左侧二维码 */}
                    <div className="text-center flex-shrink-0">
                      <img 
                        src={`${baseUrl}/qr_codes/website.png`}
                        alt="QR" 
                        style={{ width: '80px', height: '80px', borderRadius: '8px' }}
                        crossOrigin="anonymous"
                      />
                      <p className="text-xs text-[#7a7a8c] mt-1">{t.scanToVisit}</p>
                    </div>
                    
                    {/* 中间链接 */}
                    <div className="text-center">
                      <p className="text-base text-white mb-1">maxalphalinker.github.io/mechabellum-my9</p>
                      <p className="text-sm text-[#7a7a8c]">{t.author}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 已选列表 */}
            {selectedUnits.length > 0 && (
              <div className="mt-4 tech-panel p-4">
                <h3 className="font-bold text-white mb-3">{t.selectedList}</h3>
                <div className="space-y-2">
                  {selectedUnits.map((unit, index) => {
                    const category = unitCategories.find(c => c.id === unit.category);
                    return (
                      <div
                        key={unit.id}
                        className="flex items-center gap-3 p-2 bg-[#1a1a22] rounded-lg"
                      >
                        <span className="text-[#7a7a8c] text-sm w-6">{index + 1}</span>
                        <span
                          className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
                          style={{
                            background: `${category?.color}20`,
                            color: category?.color,
                          }}
                        >
                          {unit.s}
                        </span>
                        <div className="flex-1">
                          <div className="font-bold text-sm">{lang === 'zh' ? unit.cn : unit.en}</div>
                          <div className="text-xs text-[#7a7a8c]">{lang === 'zh' ? unit.en : unit.cn}</div>
                        </div>
                        {unit.comment && (
                          <span className="text-xs text-[#00e5ff] truncate max-w-[100px]">
                            {unit.comment}
                          </span>
                        )}
                        <button
                          onClick={() => removeUnit(unit.id)}
                          className="text-[#7a7a8c] hover:text-[#ff3d00] transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 网页底部社区链接 */}
        <div className="mt-12 pt-8 border-t border-[#2c2c36]">
          <h3 className="text-center text-lg font-bold text-white mb-6">{t.joinCommunity}</h3>
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            {communityLinks.map(link => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-4 bg-[#16161d] rounded-lg border border-[#2a2a35] hover:border-[#00e5ff] transition-colors group"
              >
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{link.icon}</span>
                <span className="text-sm text-white font-medium">{lang === 'zh' ? link.name : link.nameEn}</span>
              </a>
            ))}
          </div>
        </div>
      </main>

      {/* 评论对话框 */}
      <Dialog open={!!commentUnit} onOpenChange={() => setCommentUnit(null)}>
        <DialogContent className="bg-[#16161d] border-[#2c2c36] text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {commentUnit?.comment ? t.editComment : t.addComment} - {lang === 'zh' ? commentUnit?.cn : commentUnit?.en}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder={t.commentPlaceholder}
              className="tech-input min-h-[100px] resize-none"
              maxLength={50}
            />
            <p className="text-xs text-[#7a7a8c] text-right">{commentText.length}/50</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCommentUnit(null)}
                className="flex-1 border-[#444] bg-transparent hover:bg-[#23232c]"
              >
                {t.cancel}
              </Button>
              <Button
                onClick={saveComment}
                className="flex-1 bg-[#00e5ff] text-black hover:bg-[#00c8dd] font-bold"
              >
                {t.save}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 导出/预览对话框 */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="bg-[#16161d] border-[#2c2c36] text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">{t.export}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {/* 昵称输入 */}
            <div>
              <label className="text-sm text-[#7a7a8c] mb-2 block">{t.nickname}</label>
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder={t.nicknamePlaceholder}
                className="tech-input w-full"
                maxLength={20}
              />
            </div>
            
            {/* 预览图 */}
            {previewImage && (
              <div className="bg-[#0c0c10] p-4 rounded-lg">
                <p className="text-sm text-[#7a7a8c] mb-2">{t.preview}</p>
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="w-full rounded-lg border border-[#2c2c36]"
                />
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setExportDialogOpen(false)}
                className="flex-1 border-[#444] bg-transparent hover:bg-[#23232c]"
              >
                {t.cancel}
              </Button>
              <Button
                onClick={exportImage}
                className="flex-1 bg-[#00e5ff] text-black hover:bg-[#00c8dd] font-bold"
              >
                {t.generateImage}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 分享对话框 */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="bg-[#16161d] border-[#2c2c36] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">{t.shareTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="p-3 bg-[#1a1a22] rounded-lg border border-[#2a2a35]">
              <p className="text-xs text-[#7a7a8c] mb-2">{t.shareLink}</p>
              <p className="text-sm text-white break-all">{shareUrl}</p>
            </div>
            <Button
              onClick={copyShareLink}
              className="w-full bg-[#00e5ff] text-black hover:bg-[#00c8dd] font-bold"
            >
              {t.copyLink}
            </Button>
            
            {/* 社区链接 */}
            <div className="pt-4 border-t border-[#2c2c36]">
              <p className="text-sm text-[#7a7a8c] mb-3">{t.joinCommunity}</p>
              <div className="space-y-2">
                {communityLinks.map(link => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-[#1a1a22] rounded-lg border border-[#2a2a35] hover:border-[#00e5ff] transition-colors"
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span className="text-sm text-white flex-1">{lang === 'zh' ? link.name : link.nameEn}</span>
                    <ExternalLink className="w-4 h-4 text-[#7a7a8c]" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
