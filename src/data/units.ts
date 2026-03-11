// 钢铁指挥官单位数据
// 数据来源于 https://github.com/MaxLinkerAlpha/mechabellum

export interface Unit {
  id: string;
  cn: string;
  en: string;
  s: string; // 缩写
  category: UnitCategory;
  icon?: string;
}

export type UnitCategory = 
  | 'light'      // 轻型单位
  | 'medium'     // 中型单位  
  | 'heavy';     // 重型/超重型单位

export const unitCategories: { id: UnitCategory; cn: string; color: string }[] = [
  { id: 'light', cn: '轻型', color: '#4ade80' },
  { id: 'medium', cn: '中型', color: '#fbbf24' },
  { id: 'heavy', cn: '重型/超重型', color: '#f87171' },
];

export const units: Unit[] = [
  // 轻型单位
  { id: '1', cn: '尖牙', en: 'Fang', s: '牙', category: 'light' },
  { id: '2', cn: '爬虫', en: 'Crawler', s: '爬', category: 'light' },
  { id: '4', cn: '弧光', en: 'Arclight', s: '弧', category: 'light' },
  { id: '5', cn: '野马', en: 'Mustang', s: '马', category: 'light' },
  { id: '12', cn: '骇客', en: 'Hacker', s: '骇', category: 'light' },
  { id: '15', cn: '兵蜂', en: 'Wasp', s: '蜂', category: 'light' },
  { id: '19', cn: '猎犬', en: 'Hound', s: '犬', category: 'light' },
  
  // 中型单位
  { id: '3', cn: '长弓', en: 'Marksman', s: '弓', category: 'medium' },
  { id: '6', cn: '钢球', en: 'Steel Ball', s: '球', category: 'medium' },
  { id: '10', cn: '铁锤', en: 'Sledgehammer', s: '锤', category: 'medium' },
  { id: '13', cn: '犀牛', en: 'Rhino', s: '犀', category: 'medium' },
  { id: '18', cn: '狂蝎', en: 'Scorpion', s: '蝎', category: 'medium' },
  { id: '22', cn: '狼蛛', en: 'Tarantula', s: '蛛', category: 'medium' },
  { id: '23', cn: '剑齿虎', en: 'Sabertooth', s: '虎', category: 'medium' },
  { id: '27', cn: '火獾', en: 'Fire Badger', s: '獾', category: 'medium' },
  
  // 重型/超重型单位
  { id: '7', cn: '霸主', en: 'Overlord', s: '霸', category: 'heavy' },
  { id: '8', cn: '暴雨', en: 'Stormcaller', s: '雨', category: 'heavy' },
  { id: '9', cn: '熔点', en: 'Melting Point', s: '熔', category: 'heavy' },
  { id: '11', cn: '火神', en: 'Vulcan', s: '火', category: 'heavy' },
  { id: '14', cn: '凤凰', en: 'Phoenix', s: '凤', category: 'heavy' },
  { id: '16', cn: '堡垒', en: 'Fortress', s: '堡', category: 'heavy' },
  { id: '17', cn: '沙虫', en: 'Sandworm', s: '沙', category: 'heavy' },
  { id: '20', cn: '雷霆', en: 'Raiden', s: '雷', category: 'heavy' },
  { id: '25', cn: '恶灵', en: 'Wraith', s: '恶', category: 'heavy' },
  { id: '26', cn: '台风', en: 'Typhoon', s: '风', category: 'heavy' },
  { id: '29', cn: '魔眼', en: 'Void Eye', s: '眼', category: 'heavy' },
  { id: '30', cn: '丧钟', en: 'Death Knell', s: '钟', category: 'heavy' },
  { id: '24', cn: '战争工厂', en: 'War Factory', s: '厂', category: 'heavy' },
];

// 按类别获取单位
export function getUnitsByCategory(category: UnitCategory): Unit[] {
  return units.filter(u => u.category === category);
}

// 搜索单位
export function searchUnits(query: string): Unit[] {
  const lower = query.toLowerCase();
  return units.filter(
    u =>
      u.cn.includes(query) ||
      u.en.toLowerCase().includes(lower) ||
      u.s.includes(query)
  );
}

// 根据ID获取单位
export function getUnitById(id: string): Unit | undefined {
  return units.find(u => u.id === id);
}
