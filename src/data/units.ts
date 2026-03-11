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
  { id: '1', cn: '尖牙', en: 'Fang', s: '牙', category: 'light', icon: './unit_icon/9_尖牙_Fang_Icon_1.png' },
  { id: '2', cn: '爬虫', en: 'Crawler', s: '爬', category: 'light', icon: './unit_icon/10_爬虫_Crawler_Icon_1.png' },
  { id: '4', cn: '弧光', en: 'Arclight', s: '弧', category: 'light', icon: './unit_icon/15_弧光_Arclight_Icon_1.png' },
  { id: '5', cn: '野马', en: 'Mustang', s: '马', category: 'light', icon: './unit_icon/7_野马_Mustang_Icon_1.png' },
  { id: '12', cn: '骇客', en: 'Hacker', s: '骇', category: 'light', icon: './unit_icon/14_骇客_Hacker_Icon_1.png' },
  { id: '15', cn: '兵蜂', en: 'Wasp', s: '蜂', category: 'light', icon: './unit_icon/6_兵峰_Wasp_Icon_1.png' },
  { id: '19', cn: '猎犬', en: 'Hound', s: '犬', category: 'light', icon: './unit_icon/28_猎犬_Hound_Icon_1.png' },
  { id: '31', cn: '鬼鳐', en: 'Phantom Ray', s: '鳐', category: 'light', icon: './unit_icon/25_鬼鳐_Phantom Ray_Icon_1.png' },
  { id: '32', cn: '先知', en: 'Farseer', s: '先', category: 'light', icon: './unit_icon/26_先知_Farseer_Icon_1.png' },
  
  // 中型单位
  { id: '3', cn: '长弓', en: 'Marksman', s: '弓', category: 'medium', icon: './unit_icon/2_长弓_Marksman_Icon_1.png' },
  { id: '6', cn: '钢球', en: 'Steel Ball', s: '球', category: 'medium', icon: './unit_icon/8_钢球_Steel Ball_Icon_1.png' },
  { id: '10', cn: '铁锤', en: 'Sledgehammer', s: '锤', category: 'medium', icon: './unit_icon/13_铁锤_Sledgehammer_Icon_1.png' },
  { id: '13', cn: '犀牛', en: 'Rhino', s: '犀', category: 'medium', icon: './unit_icon/5_犀牛_Rhino_Icon_1.png' },
  { id: '18', cn: '狂蝎', en: 'Scorpion', s: '蝎', category: 'medium', icon: './unit_icon/19_狂蝎_Scorpion_Icon_1.png' },
  { id: '22', cn: '狼蛛', en: 'Tarantula', s: '蛛', category: 'medium', icon: './unit_icon/24_狼蛛_Tarantula_Icon_1.png' },
  { id: '23', cn: '剑齿虎', en: 'Sabertooth', s: '虎', category: 'medium', icon: './unit_icon/21_剑齿虎_Sabertooth_Icon_1.png' },
  { id: '27', cn: '火獾', en: 'Fire Badger', s: '獾', category: 'medium', icon: './unit_icon/20_火獾_Fire Badger_Icon_1.png' },
  
  // 重型/超重型单位
  { id: '7', cn: '霸主', en: 'Overlord', s: '霸', category: 'heavy', icon: './unit_icon/11_霸主_Overlord_Icon_1.png' },
  { id: '8', cn: '暴雨', en: 'Stormcaller', s: '雨', category: 'heavy', icon: './unit_icon/12_暴雨_Stormcaller_Icon_1.png' },
  { id: '9', cn: '熔点', en: 'Melting Point', s: '熔', category: 'heavy', icon: './unit_icon/4_熔点_Melting Point_Icon_1.png' },
  { id: '11', cn: '火神', en: 'Vulcan', s: '火', category: 'heavy', icon: './unit_icon/3_火神_Vulcan_Icon_1.png' },
  { id: '14', cn: '凤凰', en: 'Phoenix', s: '凤', category: 'heavy', icon: './unit_icon/16_凤凰_Phoenix_Icon_1.png' },
  { id: '16', cn: '堡垒', en: 'Fortress', s: '堡', category: 'heavy', icon: './unit_icon/1_堡垒_Fortress_Icon_1.png' },
  { id: '17', cn: '沙虫', en: 'Sandworm', s: '沙', category: 'heavy', icon: './unit_icon/23_沙虫_Sandworm_Icon_1.png' },
  { id: '20', cn: '雷霆', en: 'Raiden', s: '雷', category: 'heavy', icon: './unit_icon/27_雷霆_Raiden_Icon_1.png' },
  { id: '25', cn: '恶灵', en: 'Wraith', s: '恶', category: 'heavy', icon: './unit_icon/18_恶灵_Wraith_Icon_1.png' },
  { id: '26', cn: '台风', en: 'Typhoon', s: '风', category: 'heavy', icon: './unit_icon/22_台风_Typhoon_Icon_1.png' },
  { id: '29', cn: '魔眼', en: 'Void Eye', s: '眼', category: 'heavy', icon: './unit_icon/30_魔眼_Void Eye_Icon_1.png' },
  { id: '30', cn: '丧钟', en: 'Death Knell', s: '钟', category: 'heavy', icon: './unit_icon/2001_丧钟_Death Knell_Icon_1.png' },
  { id: '24', cn: '战争工厂', en: 'War Factory', s: '厂', category: 'heavy', icon: './unit_icon/17_战争工厂_War Factory_Icon_1.png' },
  { id: '33', cn: '深渊', en: 'Abyss', s: '渊', category: 'heavy', icon: './unit_icon/29_深渊_Abyss_Icon_1.png' },
  { id: '34', cn: '磁暴', en: 'Vortex', s: '磁', category: 'heavy', icon: './unit_icon/31_磁暴_Vortex_Icon_1.png' },
  { id: '35', cn: '泰山', en: 'Mountain', s: '山', category: 'heavy', icon: './unit_icon/2002_泰山_Mountain_Icon_1.png' },
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
