import { useState, useCallback, useRef, useEffect } from 'react';
import type { Unit } from './data/units';
import { units as allUnits, unitCategories } from './data/units';
import { Search, X, Download, Share2, RotateCcw, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

interface SelectedUnit extends Unit {
  comment?: string;
}

// 社区链接配置
const communityLinks = [
  { name: 'Steam商店', url: 'https://store.steampowered.com/app/669330/', icon: '🎮' },
  { name: 'QQ交流群', url: 'https://qm.qq.com/q/226025841', icon: '💬' },
  { name: 'QQ频道', url: 'https://pd.qq.com/g/pd90070872', icon: '📢' },
  { name: '小黑盒', url: 'https://api.xiaoheihe.cn/s/10019c', icon: '📦' },
];

function App() {
  const [selectedUnits, setSelectedUnits] = useState<SelectedUnit[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [commentUnit, setCommentUnit] = useState<SelectedUnit | null>(null);
  const [commentText, setCommentText] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['light', 'medium', 'heavy']));
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  // 过滤单位
  const filteredUnits = searchQuery.trim()
    ? allUnits.filter(
        u =>
          u.cn.includes(searchQuery) ||
          u.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.s.includes(searchQuery)
      )
    : allUnits;

  // 按类别分组
  const unitsByCategory = filteredUnits.reduce((acc, unit) => {
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
        toast.error('最多只能选择9个单位');
        return prev;
      }
      return [...prev, unit];
    });
  }, []);

  // 移除单位
  const removeUnit = useCallback((unitId: string) => {
    setSelectedUnits(prev => prev.filter(u => u.id !== unitId));
  }, []);

  // 打开评论对话框
  const openComment = useCallback((unit: SelectedUnit) => {
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
    // 使用 encodeURIComponent 和 btoa 进行编码
    const base64 = btoa(encodeURIComponent(json));
    return base64;
  }, [selectedUnits]);

  // 导出图片（带社区链接）
  const exportImage = useCallback(async () => {
    if (!exportRef.current) return;
    
    try {
      toast.info('正在生成图片...');
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#16161d',
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      
      const link = document.createElement('a');
      link.download = `我的九个钢指单位_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success('图片已保存');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('生成图片失败');
    }
  }, []);

  // 打开分享对话框
  const openShareDialog = useCallback(() => {
    try {
      const base64 = generateShareData();
      const url = `${window.location.origin}${window.location.pathname}?s=${base64}`;
      setShareUrl(url);
      setShareDialogOpen(true);
    } catch (error) {
      toast.error('生成分享链接失败');
    }
  }, [generateShareData]);

  // 复制分享链接
  const copyShareLink = useCallback(() => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('分享链接已复制到剪贴板');
    }).catch(() => {
      toast.error('复制失败，请手动复制');
    });
  }, [shareUrl]);

  // 重置
  const reset = useCallback(() => {
    setSelectedUnits([]);
    toast.info('已重置选择');
  }, []);

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
        // 使用 decodeURIComponent 和 atob 进行解码
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
        toast.success('已加载分享的数据');
        // 清除URL参数
        window.history.replaceState({}, '', window.location.pathname);
      } catch (error) {
        console.error('Parse error:', error);
        toast.error('分享链接无效或已损坏');
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0c10] text-[#f0f0f0]">
      {/* 头部 */}
      <header className="border-b border-[#2c2c36] bg-[#16161d]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                构成我的<span className="text-[#00e5ff]">九个</span>钢指单位
              </h1>
              <p className="text-sm text-[#7a7a8c] mt-1">
                选择构成你的钢铁指挥官战术风格的9个单位
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={reset}
                className="border-[#444] bg-[#23232c] hover:bg-[#333340] text-white"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                重置
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={openShareDialog}
                disabled={selectedUnits.length === 0}
                className="border-[#444] bg-[#23232c] hover:bg-[#333340] text-white disabled:opacity-50"
              >
                <Share2 className="w-4 h-4 mr-1" />
                分享
              </Button>
              <Button
                size="sm"
                onClick={exportImage}
                disabled={selectedUnits.length === 0}
                className="bg-[#00e5ff] text-black hover:bg-[#00c8dd] font-bold disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-1" />
                导出
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：单位选择 */}
          <div className="space-y-4">
            {/* 搜索栏 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7a7a8c]" />
              <input
                type="text"
                placeholder="搜索单位名称..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="tech-input pl-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a7a8c] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 单位列表 */}
            <div className="tech-panel p-4 space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto">
              {searchQuery ? (
                // 搜索结果
                <div className="grid grid-cols-3 gap-2">
                  {filteredUnits.map(unit => {
                    const isSelected = selectedUnits.some(u => u.id === unit.id);
                    const category = unitCategories.find(c => c.id === unit.category);
                    return (
                      <button
                        key={unit.id}
                        onClick={() => selectUnit(unit)}
                        className={`unit-card p-3 text-left ${isSelected ? 'selected' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className="category-tag"
                            style={{
                              background: `${category?.color}20`,
                              color: category?.color,
                            }}
                          >
                            {unit.s}
                          </span>
                          {isSelected && (
                            <span className="text-[#00e5ff] text-xs">✓</span>
                          )}
                        </div>
                        <div className="font-bold text-sm">{unit.cn}</div>
                        <div className="text-xs text-[#7a7a8c]">{unit.en}</div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                // 按类别分组
                unitCategories.map(category => {
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
                          <span className="font-bold">{category.cn}单位</span>
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
                                <div className="font-bold text-sm truncate">{unit.cn}</div>
                                <div className="text-xs text-[#7a7a8c] truncate">{unit.en}</div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 右侧：已选单位展示 */}
          <div>
            {/* 预览区域（用于显示） */}
            <div ref={resultRef} className="tech-panel p-6">
              {/* 标题区域 */}
              <div className="text-center mb-6 pb-6 border-b border-[#2c2c36]">
                <h2 className="text-2xl font-black text-white mb-2">
                  构成我的<span className="text-[#00e5ff]">九个</span>钢指单位
                </h2>
                <p className="text-sm text-[#7a7a8c]">
                  钢铁指挥官 / Mechabellum
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
                          ? 'border-[#00e5ff] bg-[#00e5ff]/10'
                          : 'border-dashed border-[#2c2c36] bg-[#121217]'
                      }`}
                    >
                      {unit ? (
                        <>
                          <button
                            onClick={() => removeUnit(unit.id)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#ff3d00]/80 hover:bg-[#ff3d00] text-white flex items-center justify-center text-xs z-10"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => openComment(unit)}
                            className="absolute top-1 left-1 w-5 h-5 rounded-full bg-[#2979ff]/80 hover:bg-[#2979ff] text-white flex items-center justify-center text-xs z-10"
                          >
                            {unit.comment ? '✎' : '+'}
                          </button>
                          <div
                            className="text-3xl font-black mb-1"
                            style={{
                              color: unitCategories.find(c => c.id === unit.category)?.color,
                            }}
                          >
                            {unit.s}
                          </div>
                          <div className="font-bold text-white text-center px-1">{unit.cn}</div>
                          <div className="text-xs text-[#7a7a8c] text-center px-1">{unit.en}</div>
                          {unit.comment && (
                            <div className="absolute bottom-0 left-0 right-0 bg-[#00e5ff]/20 px-1 py-0.5">
                              <p className="text-[10px] text-[#00e5ff] text-center truncate">
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
                <p>已选择 {selectedUnits.length}/9 个单位</p>
                {selectedUnits.length === 9 && (
                  <p className="text-[#00e5ff] mt-1">✓ 选择完成！</p>
                )}
              </div>
            </div>

            {/* 导出用隐藏区域（带社区链接） */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
              <div ref={exportRef} className="tech-panel p-6" style={{ width: '500px' }}>
                {/* 标题区域 */}
                <div className="text-center mb-6 pb-6 border-b border-[#2c2c36]">
                  <h2 className="text-2xl font-black text-white mb-2">
                    构成我的<span className="text-[#00e5ff]">九个</span>钢指单位
                  </h2>
                  <p className="text-sm text-[#7a7a8c]">
                    钢铁指挥官 / Mechabellum
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
                            ? 'border-[#00e5ff] bg-[#00e5ff]/10'
                            : 'border-dashed border-[#2c2c36] bg-[#121217]'
                        }`}
                        style={{ height: '130px' }}
                      >
                        {unit ? (
                          <>
                            <div
                              className="text-3xl font-black mb-1"
                              style={{
                                color: unitCategories.find(c => c.id === unit.category)?.color,
                              }}
                            >
                              {unit.s}
                            </div>
                            <div className="font-bold text-white text-center px-1">{unit.cn}</div>
                            <div className="text-xs text-[#7a7a8c] text-center px-1">{unit.en}</div>
                            {unit.comment && (
                              <div className="absolute bottom-0 left-0 right-0 bg-[#00e5ff]/20 px-1 py-0.5">
                                <p className="text-[10px] text-[#00e5ff] text-center truncate">
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

                {/* 社区链接区域 */}
                <div className="mt-6 pt-6 border-t border-[#2c2c36]">
                  <p className="text-center text-sm text-[#7a7a8c] mb-4">加入钢铁指挥官社区</p>
                  <div className="grid grid-cols-2 gap-3">
                    {communityLinks.map(link => (
                      <div
                        key={link.name}
                        className="flex items-center gap-2 p-3 bg-[#1a1a22] rounded-lg border border-[#2a2a35]"
                      >
                        <span className="text-xl">{link.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">{link.name}</p>
                          <p className="text-[10px] text-[#7a7a8c] truncate">{link.url}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 底部信息 */}
                <div className="text-center text-xs text-[#7a7a8c] mt-6">
                  <p>使用 构成我的九个钢指单位 生成</p>
                </div>
              </div>
            </div>

            {/* 已选列表 */}
            {selectedUnits.length > 0 && (
              <div className="mt-4 tech-panel p-4">
                <h3 className="font-bold text-white mb-3">已选单位列表</h3>
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
                          <div className="font-bold text-sm">{unit.cn}</div>
                          <div className="text-xs text-[#7a7a8c]">{unit.en}</div>
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
      </main>

      {/* 评论对话框 */}
      <Dialog open={!!commentUnit} onOpenChange={() => setCommentUnit(null)}>
        <DialogContent className="bg-[#16161d] border-[#2c2c36] text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              添加备注 - {commentUnit?.cn}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="输入你对这个单位的评价..."
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
                取消
              </Button>
              <Button
                onClick={saveComment}
                className="flex-1 bg-[#00e5ff] text-black hover:bg-[#00c8dd] font-bold"
              >
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 分享对话框 */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="bg-[#16161d] border-[#2c2c36] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">分享你的选择</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="p-3 bg-[#1a1a22] rounded-lg border border-[#2a2a35]">
              <p className="text-xs text-[#7a7a8c] mb-2">分享链接</p>
              <p className="text-sm text-white break-all">{shareUrl}</p>
            </div>
            <Button
              onClick={copyShareLink}
              className="w-full bg-[#00e5ff] text-black hover:bg-[#00c8dd] font-bold"
            >
              复制链接
            </Button>
            
            {/* 社区链接 */}
            <div className="pt-4 border-t border-[#2c2c36]">
              <p className="text-sm text-[#7a7a8c] mb-3">加入钢铁指挥官社区</p>
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
                    <span className="text-sm text-white flex-1">{link.name}</span>
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
