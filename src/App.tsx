import { useState, useCallback, useRef, useEffect } from 'react';
import type { Unit } from './data/units';
import { units as allUnits, unitCategories } from './data/units';
import { X, Download, Share2, RotateCcw, Globe, MessageSquarePlus, Copy } from 'lucide-react';
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
    generateImage: '下载图片',
    copyImage: '复制图片',
    copyImageTip: '可直接粘贴到QQ/微信/Discord',
    nickname: '输入你的昵称（可选）',
    nicknamePlaceholder: '例如：钢铁指挥官',
    shareTitle: '分享你的选择',
    shareLink: '分享链接',
    copyLink: '复制链接',

    generatedBy: 'Max Linker with Kimi',
    switchLang: 'English',
    community: '社区',

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
    generateImage: 'Download Image',
    copyImage: 'Copy Image',
    copyImageTip: 'Paste to QQ/WeChat/Discord directly',
    nickname: 'Enter your nickname (optional)',
    nicknamePlaceholder: 'e.g., MechaCommander',
    shareTitle: 'Share Your Selection',
    shareLink: 'Share Link',
    copyLink: 'Copy Link',

    generatedBy: 'Max Linker with Kimi',
    switchLang: '中文',
    community: 'Community',

    selectedList: 'Selected Units',
    author: 'Max Linker with Kimi',
  },
};



function App() {
  const [lang, setLang] = useState<Language>('zh');
  const t = translations[lang];
  
  const [selectedUnits, setSelectedUnits] = useState<SelectedUnit[]>([]);
  const [commentUnit, setCommentUnit] = useState<SelectedUnit | null>(null);
  const [commentText, setCommentText] = useState('');
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

  // 生成 canvas
  const generateCanvas = useCallback(async () => {
    if (!exportRef.current) return null;
    
    try {
      toast.info(lang === 'zh' ? '正在生成...' : 'Generating...');
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#16161d',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      return canvas;
    } catch (error) {
      console.error('Export error:', error);
      toast.error(lang === 'zh' ? '生成图片失败' : 'Failed to generate image');
      return null;
    }
  }, [lang]);

  // 导出图片（下载）
  const exportImage = useCallback(async () => {
    const canvas = await generateCanvas();
    if (!canvas) return;
    
    const link = document.createElement('a');
    const name = nickname || (lang === 'zh' ? '玩家' : 'Player');
    link.download = lang === 'zh' 
      ? `${name}的最心爱的9个钢指单位.png`
      : `${name}_9_Favorite_Units.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    toast.success(lang === 'zh' ? '图片已保存' : 'Image saved');
    setExportDialogOpen(false);
  }, [nickname, lang, t, generateCanvas]);

  // 复制图片到剪贴板
  const copyImageToClipboard = useCallback(async () => {
    const canvas = await generateCanvas();
    if (!canvas) return;
    
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error(lang === 'zh' ? '复制失败' : 'Copy failed');
          return;
        }
        
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          toast.success(lang === 'zh' ? '图片已复制到剪贴板' : 'Image copied to clipboard');
          setExportDialogOpen(false);
        } catch (err) {
          console.error('Copy error:', err);
          toast.error(lang === 'zh' ? '复制失败，请使用下载按钮' : 'Copy failed, please use download button');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Copy error:', error);
      toast.error(lang === 'zh' ? '复制失败' : 'Copy failed');
    }
  }, [lang, generateCanvas]);

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

  return (
    <div className="min-h-screen bg-[#0c0c10] text-[#f0f0f0]">
      {/* 头部 */}
      <header className="border-b border-[#2c2c36] bg-[#16161d]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white truncate">
                {t.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#5a5a6c] mt-0.5 truncate">
                by {t.author}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {/* 社区链接 - 手机端隐藏 */}
              <div className="hidden sm:flex items-center gap-2 mr-2">
                <span className="text-xs text-[#7a7a8c] mr-1">{t.community}</span>
                <a
                  href="https://store.steampowered.com/app/669330/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 flex items-center justify-center rounded bg-[#1a1a22] border border-[#2a2a35] hover:border-[#00e5ff] hover:text-[#00e5ff] transition-colors text-sm"
                  title="Steam商店"
                >
                  🎮
                </a>
                <a
                  href="https://qm.qq.com/q/226025841"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 flex items-center justify-center rounded bg-[#1a1a22] border border-[#2a2a35] hover:border-[#00e5ff] hover:text-[#00e5ff] transition-colors text-sm"
                  title="QQ交流群: 226025841"
                >
                  💬
                </a>
                <a
                  href="https://pd.qq.com/g/pd90070872"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 flex items-center justify-center rounded bg-[#1a1a22] border border-[#2a2a35] hover:border-[#00e5ff] hover:text-[#00e5ff] transition-colors text-sm"
                  title="QQ频道"
                >
                  📢
                </a>
                <a
                  href="https://api.xiaoheihe.cn/s/10019c"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 flex items-center justify-center rounded bg-[#1a1a22] border border-[#2a2a35] hover:border-[#00e5ff] hover:text-[#00e5ff] transition-colors text-sm"
                  title="小黑盒"
                >
                  📦
                </a>
              </div>
              
              <div className="hidden sm:block w-px h-6 bg-[#2c2c36]" />
              
              <div className="flex gap-1.5 sm:gap-2">
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
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-6">
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

            {/* 单位列表 - 平铺显示 */}
            <div className="tech-panel p-3 sm:p-4 max-h-[calc(100vh-220px)] overflow-y-auto">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                {allUnits.map(unit => {
                  const isSelected = selectedUnits.some(u => u.id === unit.id);
                  return (
                    <button
                      key={unit.id}
                      onClick={() => selectUnit(unit)}
                      className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                        isSelected 
                          ? 'border-[#00e5ff] bg-[#00e5ff]/10' 
                          : 'border-[#2a2a35] bg-[#1a1a22] hover:border-[#444]'
                      }`}
                      style={{ aspectRatio: '1/1' }}
                    >
                      {/* 单位图标 */}
                      {unit.icon && (
                        <img 
                          src={unit.icon}
                          alt={unit.cn}
                          className="absolute inset-0 w-full h-full object-contain p-2"
                          style={{ 
                            opacity: isSelected ? 0.5 : 0.9,
                          }}
                          onError={(e) => {
                            console.log('Icon load failed:', unit.icon);
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      
                      {/* 选择标记 */}
                      {isSelected && (
                        <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#00e5ff] text-black text-xs flex items-center justify-center z-10 font-bold">✓</span>
                      )}
                      

                      
                      {/* 单位名称 */}
                      <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/90 to-transparent z-10">
                        <div className="font-bold text-xs text-white text-center truncate" style={{ textShadow: '0 0 4px rgba(0,0,0,0.9)' }}>{lang === 'zh' ? unit.cn : unit.en}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 右侧：已选单位展示 */}
          <div>
            {/* 预览区域 */}
            <div className="tech-panel p-6">
              {/* 标题区域 - 仅显示标题，无作者名 */}
              <div className="text-center mb-6 pb-6 border-b border-[#2c2c36]">
                <h2 className="text-2xl font-black text-white">
                  {t.title}
                </h2>
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
                          
                          {/* 单位图标 */}
                          {unit.icon && (
                            <img 
                              src={unit.icon}
                              alt={unit.cn}
                              className="absolute inset-0 w-full h-full object-contain z-0"
                              style={{ 
                                opacity: 0.9,
                                transform: 'scale(0.85)',
                                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
                              }}
                              onError={(e) => {
                                console.log('Icon load failed:', unit.icon);
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          )}
                          
                          {/* 单位名称 - 悬浮在图标上方 */}
                          <div className="absolute bottom-1 left-0 right-0 z-10 flex flex-col items-center bg-gradient-to-t from-black/80 to-transparent pt-4 pb-1">
                            <div className="font-bold text-white text-center px-1 text-sm" style={{ textShadow: '0 0 8px rgba(0,0,0,0.9)' }}>
                              {lang === 'zh' ? unit.cn : unit.en}
                            </div>
                          </div>
                          
                          {/* 备注显示 */}
                          {unit.comment && (
                            <div className="absolute bottom-2 left-2 right-2 bg-[#16161d]/90 border border-[#00e5ff]/50 rounded px-1.5 py-1 z-10">
                              <p className="text-[10px] text-[#00e5ff] text-center font-medium leading-tight" style={{ textShadow: '0 0 4px rgba(0,0,0,0.9)' }}>
                                "{unit.comment}"
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
                        style={{ height: unit?.comment ? '180px' : '150px', width: '180px' }}
                      >
                        {unit ? (
                          <>
                            {/* 单位图标 */}
                            {unit.icon && (
                              <img 
                                src={unit.icon}
                                alt={unit.cn}
                                className="absolute inset-0 w-full h-full object-contain z-0"
                                style={{ 
                                  opacity: 0.85,
                                  transform: 'scale(0.8)',
                                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
                                }}
                                crossOrigin="anonymous"
                              />
                            )}
                            {/* 单位名称 - 悬浮在底部 */}
                            <div className="absolute bottom-2 left-0 right-0 z-10 flex flex-col items-center bg-gradient-to-t from-black/80 to-transparent pt-4 pb-1">
                              <div className="font-bold text-white text-base text-center px-1" style={{ textShadow: '0 0 8px rgba(0,0,0,0.9)' }}>
                                {lang === 'zh' ? unit.cn : unit.en}
                              </div>
                            </div>
                            {unit.comment && (
                              <div className="absolute bottom-2 left-2 right-2 bg-[#16161d]/90 border border-[#00e5ff]/50 rounded px-2 py-1.5 z-10">
                                <p className="text-[11px] text-[#00e5ff] text-center font-medium leading-tight" style={{ textShadow: '0 0 4px rgba(0,0,0,0.9)' }}>
                                  "{unit.comment}"
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

                {/* 底部信息 - 带二维码 */}
                <div className="mt-6 pt-6 border-t border-[#2c2c36]">
                  <div className="flex items-center justify-center gap-6">
                    {/* 二维码 */}
                    <div className="flex flex-col items-center">
                      <img 
                        src="./qr_codes/website.png"
                        alt="QR Code"
                        className="w-20 h-20 rounded-lg border border-[#2c2c36]"
                        crossOrigin="anonymous"
                      />
                    </div>
                    {/* 文字信息 */}
                    <div className="text-left">
                      <p className="text-base text-white mb-1">maxalphalinker.github.io/mechabellum-my9fav</p>
                      <p className="text-sm text-[#7a7a8c]">{lang === 'zh' ? '扫码或输入网址，制作你的钢指Top9' : 'Scan or enter URL to create your Mecha Top9'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
            
            {/* 操作按钮 */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setExportDialogOpen(false)}
                  className="flex-1 border-[#444] bg-transparent hover:bg-[#23232c]"
                >
                  {t.cancel}
                </Button>
                <Button
                  onClick={copyImageToClipboard}
                  variant="outline"
                  className="flex-1 border-[#00e5ff] text-[#00e5ff] hover:bg-[#00e5ff]/10"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  {t.copyImage}
                </Button>
                <Button
                  onClick={exportImage}
                  className="flex-1 bg-[#00e5ff] text-black hover:bg-[#00c8dd] font-bold"
                >
                  {t.generateImage}
                </Button>
              </div>
              <p className="text-xs text-[#7a7a8c] text-center">
                💡 {t.copyImageTip}
              </p>
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

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
