import React, { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Accordion from '@/components/ui/Accordion';

// Form field types
interface IdentityFields {
  gender: string;
  age: string;
  ethnicity: string;
  faceShape: string;
  eyeColor: string;
  eyeShape: string;
  noseType: string;
  lipShape: string;
  distinguishingMarks: string;
  hairColor: string;
  hairTexture: string;
  hairStyle: string;
  skinTexture: string;
  skinTone: string;
  makeup: string;
  bodyType: string;
  facialExpression: string;
  gazeDirection: string;
}

interface StyleFields {
  realismLevel: string;
  lightingStyle: string;
  lightingTemperature: string;
  lightingDirection: string;
  location: string;
  cameraType: string;
  cameraAngle: string;
  lensType: string;
  colorGrading: string;
  sharpnessLevel: string;
}

interface PersonalityFields {
  personalityKeywords: string;
  contentNiche: string;
  clothingStyle: string;
  accessories: string;
  bodyPose: string;
  handPosition: string;
  objectsHeld: string;
  sceneLocation: string;
  sceneDetails: string;
}

interface TechnicalFields {
  skinRenderingDetail: string;
  makeupApplication: string;
  qualityModifiers: string;
}

// Option definitions
const GENDER_OPTIONS = [
  { value: '', label: '請選擇...', disabled: false },
  { value: 'Female', label: 'Female（女性）', disabled: false },
  { value: 'Male', label: 'Male（男性）', disabled: false },
  { value: 'Non-binary', label: 'Non-binary（非二元性别）', disabled: false },
  { value: 'Prefer not to say', label: 'Prefer not to say（不愿透露）', disabled: false },
];

const REALISM_OPTIONS = [
  { value: '', label: '請選擇...', disabled: false },
  { value: 'Stylized', label: 'Stylized（风格化）', disabled: false },
  { value: 'Semi-realistic', label: 'Semi-realistic（半写实）', disabled: false },
  { value: 'Photorealistic', label: 'Photorealistic（照片级写实）', disabled: false },
  { value: 'Hyper-real', label: 'Hyper-real（超写实）', disabled: false },
  { value: '3D render', label: '3D render（3D渲染）', disabled: false },
  { value: 'Illustration', label: 'Illustration（插画）', disabled: false },
  { value: 'Anime / Manga', label: 'Anime / Manga（动漫）', disabled: false },
  { value: 'Oil painting', label: 'Oil painting（油画）', disabled: false },
  { value: 'Watercolor', label: 'Watercolor（水彩）', disabled: false },
  { value: 'Sketch', label: 'Sketch（素描）', disabled: false },
];

const LIGHTING_OPTIONS = [
  { value: '', label: '請選擇...', disabled: false },
  { value: 'Soft daylight', label: 'Soft daylight（柔和日光）', disabled: false },
  { value: 'Golden hour', label: 'Golden hour（黄金时刻）', disabled: false },
  { value: 'Studio softbox', label: 'Studio softbox（影棚柔光箱）', disabled: false },
  { value: 'Rim light', label: 'Rim light（轮廓光）', disabled: false },
  { value: 'Butterfly lighting', label: 'Butterfly lighting（蝴蝶光）', disabled: false },
  { value: 'Rembrandt lighting', label: 'Rembrandt lighting（伦勃朗光）', disabled: false },
  { value: 'Split lighting', label: 'Split lighting（分割光）', disabled: false },
  { value: 'Backlight', label: 'Backlight（逆光）', disabled: false },
  { value: 'High key', label: 'High key（高调光）', disabled: false },
  { value: 'Low key', label: 'Low key（低调光）', disabled: false },
  { value: 'Dramatic shadows', label: 'Dramatic shadows（戏剧阴影）', disabled: false },
  { value: 'Neon lighting', label: 'Neon lighting（霓虹灯）', disabled: false },
  { value: 'Candlelight', label: 'Candlelight（烛光）', disabled: false },
  { value: 'Moonlight', label: 'Moonlight（月光）', disabled: false },
];

const LOCATION_OPTIONS = [
  { value: '', label: '請選擇...', disabled: false },
  { value: 'Clean studio background', label: 'Clean studio background（纯色影棚背景）', disabled: false },
  { value: 'White seamless', label: 'White seamless（白色无缝背景）', disabled: false },
  { value: 'Black backdrop', label: 'Black backdrop（黑色背景）', disabled: false },
  { value: 'Gray gradient', label: 'Gray gradient（灰色渐变）', disabled: false },
  { value: 'Indoor domestic', label: 'Indoor domestic（室内家居）', disabled: false },
  { value: 'Outdoor natural', label: 'Outdoor natural（户外自然）', disabled: false },
  { value: 'Urban street', label: 'Urban street（城市街道）', disabled: false },
  { value: 'Beach / Ocean', label: 'Beach / Ocean（海滩/海洋）', disabled: false },
  { value: 'Forest / Woods', label: 'Forest / Woods（森林）', disabled: false },
  { value: 'Mountain landscape', label: 'Mountain landscape（山景）', disabled: false },
  { value: 'Office setting', label: 'Office setting（办公室）', disabled: false },
  { value: 'Café / Restaurant', label: 'Café / Restaurant（咖啡馆/餐厅）', disabled: false },
  { value: 'Bedroom', label: 'Bedroom（卧室）', disabled: false },
  { value: 'Living room', label: 'Living room（客厅）', disabled: false },
  { value: 'Garden', label: 'Garden（花园）', disabled: false },
  { value: 'Rooftop', label: 'Rooftop（屋顶）', disabled: false },
  { value: 'Industrial warehouse', label: 'Industrial warehouse（工业仓库）', disabled: false },
  { value: 'Vintage interior', label: 'Vintage interior（复古室内）', disabled: false },
];

const MAKEUP_OPTIONS = [
  { value: 'No makeup', label: 'No makeup（无妆容）', disabled: false },
  { value: 'Minimal natural', label: 'Minimal natural（极简自然妆）', disabled: false },
  { value: 'Light everyday', label: 'Light everyday（日常淡妆）', disabled: false },
  { value: 'Medium coverage', label: 'Medium coverage（中等遮瑕）', disabled: false },
  { value: 'Full glam', label: 'Full glam（全妆）', disabled: false },
  { value: 'Editorial', label: 'Editorial（时尚妆）', disabled: false },
  { value: 'Dramatic', label: 'Dramatic（戏剧妆）', disabled: false },
  { value: 'Smoky eye', label: 'Smoky eye（烟熏妆）', disabled: false },
  { value: 'Bold lip', label: 'Bold lip（红唇妆）', disabled: false },
  { value: 'Monochromatic', label: 'Monochromatic（单色妆）', disabled: false },
];

const BODY_TYPE_OPTIONS = [
  { value: 'Slim / Petite', label: 'Slim / Petite（苗条/娇小）', disabled: false },
  { value: 'Average / Athletic', label: 'Average / Athletic（平均/运动型）', disabled: false },
  { value: 'Curvy / Hourglass', label: 'Curvy / Hourglass（曲线/沙漏型）', disabled: false },
  { value: 'Pear shape', label: 'Pear shape（梨形）', disabled: false },
  { value: 'Apple shape', label: 'Apple shape（苹果形）', disabled: false },
  { value: 'Rectangle', label: 'Rectangle（矩形）', disabled: false },
  { value: 'Plus size', label: 'Plus size（大码）', disabled: false },
  { value: 'Muscular / Toned', label: 'Muscular / Toned（肌肉/紧实）', disabled: false },
];

const CAMERA_TYPE_OPTIONS = [
  { value: '35mm DSLR', label: '35mm DSLR（35mm单反）', disabled: false },
  { value: 'Medium format', label: 'Medium format（中画幅）', disabled: false },
  { value: 'Large format', label: 'Large format（大画幅）', disabled: false },
  { value: 'Smartphone', label: 'Smartphone（智能手机）', disabled: false },
  { value: 'Vintage film camera', label: 'Vintage film camera（复古胶片机）', disabled: false },
  { value: 'Polaroid', label: 'Polaroid（拍立得）', disabled: false },
  { value: 'Cinematic', label: 'Cinematic（电影感）', disabled: false },
  { value: 'Security camera', label: 'Security camera（监控摄像头）', disabled: false },
  { value: 'GoPro / Action cam', label: 'GoPro / Action cam（运动相机）', disabled: false },
  { value: 'Drone aerial', label: 'Drone aerial（无人机航拍）', disabled: false },
];

const LENS_TYPE_OPTIONS = [
  { value: '50mm portrait', label: '50mm portrait（50mm人像）', disabled: false },
  { value: '24mm wide angle', label: '24mm wide angle（24mm广角）', disabled: false },
  { value: '35mm standard', label: '35mm standard（35mm标准）', disabled: false },
  { value: '85mm telephoto', label: '85mm telephoto（85mm长焦）', disabled: false },
  { value: '135mm telephoto', label: '135mm telephoto（135mm长焦）', disabled: false },
  { value: 'Macro lens', label: 'Macro lens（微距镜头）', disabled: false },
  { value: 'Fish-eye', label: 'Fish-eye（鱼眼镜头）', disabled: false },
  { value: 'Tilt-shift', label: 'Tilt-shift（移轴镜头）', disabled: false },
  { value: 'Vintage lens', label: 'Vintage lens（复古镜头）', disabled: false },
  { value: 'Bokeh effect', label: 'Bokeh effect（散景效果）', disabled: false },
];

const COLOR_GRADING_OPTIONS = [
  { value: 'Neutral / Natural', label: 'Neutral / Natural（中性/自然）', disabled: false },
  { value: 'Warm tones', label: 'Warm tones（暖色调）', disabled: false },
  { value: 'Cool tones', label: 'Cool tones（冷色调）', disabled: false },
  { value: 'Monochrome', label: 'Monochrome（单色）', disabled: false },
  { value: 'Sepia', label: 'Sepia（棕褐色）', disabled: false },
  { value: 'High contrast', label: 'High contrast（高对比度）', disabled: false },
  { value: 'Pastel colors', label: 'Pastel colors（柔和色彩）', disabled: false },
  { value: 'Vibrant / Saturated', label: 'Vibrant / Saturated（鲜艳/饱和）', disabled: false },
  { value: 'Desaturated / Muted', label: 'Desaturated / Muted（去饱和/柔和）', disabled: false },
  { value: 'Teal and orange', label: 'Teal and orange（青橙色调）', disabled: false },
  { value: 'Black and white', label: 'Black and white（黑白）', disabled: false },
  { value: 'Vintage film', label: 'Vintage film（复古胶片）', disabled: false },
  { value: 'Cinematic', label: 'Cinematic（电影感）', disabled: false },
  { value: 'HDR', label: 'HDR（高动态范围）', disabled: false },
];

const SHARPNESS_OPTIONS = [
  { value: 'Standard sharp', label: 'Standard sharp（标准锐度）', disabled: false },
  { value: 'Soft focus', label: 'Soft focus（柔焦）', disabled: false },
  { value: 'Slightly soft', label: 'Slightly soft（轻微柔化）', disabled: false },
  { value: 'Tack sharp', label: 'Tack sharp（极锐利）', disabled: false },
  { value: 'Hyper-detailed', label: 'Hyper-detailed（超细节）', disabled: false },
  { value: 'Cinematic soft', label: 'Cinematic soft（电影柔化）', disabled: false },
  { value: 'Dreamy blur', label: 'Dreamy blur（梦幻模糊）', disabled: false },
  { value: 'Selective focus', label: 'Selective focus（选择性对焦）', disabled: false },
];

const CONTENT_NICHE_OPTIONS = [
  { value: '', label: '請選擇...', disabled: false },
  { value: 'Lifestyle', label: 'Lifestyle（生活方式）', disabled: false },
  { value: 'Fashion', label: 'Fashion（时尚）', disabled: false },
  { value: 'Beauty / Cosmetics', label: 'Beauty / Cosmetics（美妆）', disabled: false },
  { value: 'Business / Corporate', label: 'Business / Corporate（商务/企业）', disabled: false },
  { value: 'Editorial', label: 'Editorial（编辑内容）', disabled: false },
  { value: 'Social media', label: 'Social media（社交媒体）', disabled: false },
  { value: 'E-commerce', label: 'E-commerce（电商）', disabled: false },
  { value: 'Portrait photography', label: 'Portrait photography（肖像摄影）', disabled: false },
  { value: 'Fitness / Wellness', label: 'Fitness / Wellness（健身/健康）', disabled: false },
  { value: 'Travel', label: 'Travel（旅行）', disabled: false },
  { value: 'Food & Beverage', label: 'Food & Beverage（餐饮）', disabled: false },
  { value: 'Technology', label: 'Technology（科技）', disabled: false },
  { value: 'Education', label: 'Education（教育）', disabled: false },
  { value: 'Entertainment', label: 'Entertainment（娱乐）', disabled: false },
  { value: 'Artistic', label: 'Artistic（艺术创作）', disabled: false },
  { value: 'Family / Maternity', label: 'Family / Maternity（家庭/孕妇）', disabled: false },
  { value: 'Bridal / Wedding', label: 'Bridal / Wedding（新娘/婚礼）', disabled: false },
];

export default function AIPromptGeneratorPage() {
  // Form state
  const [identity, setIdentity] = useState<IdentityFields>({
    gender: '',
    age: '',
    ethnicity: '',
    faceShape: '',
    eyeColor: '',
    eyeShape: '',
    noseType: '',
    lipShape: '',
    distinguishingMarks: '',
    hairColor: '',
    hairTexture: '',
    hairStyle: '',
    skinTexture: '',
    skinTone: '',
    makeup: 'No makeup',
    bodyType: 'Slim / Petite',
    facialExpression: '',
    gazeDirection: '',
  });

  const [style, setStyle] = useState<StyleFields>({
    realismLevel: '',
    lightingStyle: '',
    lightingTemperature: '',
    lightingDirection: '',
    location: '',
    cameraType: '35mm DSLR',
    cameraAngle: '',
    lensType: '50mm portrait',
    colorGrading: 'Neutral / Natural',
    sharpnessLevel: 'Standard sharp',
  });

  const [personality, setPersonality] = useState<PersonalityFields>({
    personalityKeywords: '',
    contentNiche: '',
    clothingStyle: '',
    accessories: '',
    bodyPose: '',
    handPosition: '',
    objectsHeld: '',
    sceneLocation: '',
    sceneDetails: '',
  });

  const [technical, setTechnical] = useState<TechnicalFields>({
    skinRenderingDetail: '',
    makeupApplication: '',
    qualityModifiers: 'Photorealistic, 8K resolution, sharp focus on eyes, professional photography, no artificial smoothing, no plastic skin, no uncanny valley',
  });

  const [outputTab, setOutputTab] = useState<'json' | 'prompt'>('json');
  const [generatedJSON, setGeneratedJSON] = useState<string>('');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // AI import state
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [importJSON, setImportJSON] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  // AI Prompt template
  const AIPROMPT_TEMPLATE = `角色定義與任務目標
你現在是一位雙棲專家：「首席數位人像藝術家 (Senior Character Artist)」與「逆向人像攝影鑑定師 (Reverse Engineering Photographer)」。你的任務是將輸入的「文字描述」或「照片」轉化為一份具備物理真實感 (PBR) 與極高細節度的結構化 JSON。

操作模式（自動切換）
文字模式 (Synthesis Mode)：若收到文字，請以描繪師視角，將簡短描述擴展為具備解剖學深度、生理特徵與精確光學參數的專業細節。

影像模式 (Analysis Mode)：若收到照片，請進行逆向鑑定。分析眼中的 Catchlight 推斷燈位、根據背景模糊度推斷焦距、根據皮膚質感推斷渲染參數。

核心撰寫準則
全欄位覆蓋：必須填寫 JSON 結構中的每一個欄位。

真實性優先：如果描述或照片中明確不存在某項元素（例如沒拿東西、沒穿外套、沒化妝），請在該欄位填入 "None" 或 "Not applicable"，嚴禁憑空捏造不存在的物體。

專業語彙：自由填寫欄位嚴禁單詞。必須包含專業語彙（如：Fitzpatrick Scale, Subsurface Scattering, Micro-pores, K-temperature, 3-point lighting coordinates）。

物理一致性：所有的技術參數（燈光溫度、相機焦距、皮膚渲染）必須符合真實物理與專業攝影邏輯。

【可選選項列表】（嚴格遵守選項值，不要更改）
【Identity 身份特徵】

gender (必填): Female / Male / Non-binary / Prefer not to say

age (必填): 需包含具體區間與質感（如: mid-20s, approximately 24-26 years old）

ethnicity / faceShape / eyeColor / eyeShape / noseType / lipShape: 需描述解剖學特徵與層次

distinguishingMarks: 微瑕疵、痣、疤痕或紋理細部（若無則填 None）

hairColor / hairTexture / hairStyle: 描述髮絲光澤演算法、定義與流動感

skinTexture / skinTone: 必須包含 Micro-texture 與底色 Undertones

makeup: No makeup / Minimal natural / Light everyday / Medium coverage / Full glam / Editorial / Dramatic / Smoky eye / Bold lip / Monochromatic（預設: No makeup）

bodyType: Slim / Petite / Average / Athletic / Curvy / Hourglass / Pear shape / Apple shape / Rectangle / Plus size / Muscular / Toned（預設: Slim / Petite）

facialExpression / gazeDirection: 描述情感張力與視線焦點

【Style 風格參數】

realismLevel (必填): Stylized / Semi-realistic / Photorealistic / Hyper-real / 3D render / Illustration / Anime / Manga / Oil painting / Watercolor / Sketch

lightingStyle (必填): Soft daylight / Golden hour / Studio softbox / Rim light / Butterfly lighting / Rembrandt lighting / Split lighting / Backlight / High key / Low key / Dramatic shadows / Neon lighting / Candlelight / Moonlight

lightingTemperature / lightingDirection: 使用 K 值與點鐘方向（如: 5200K, 2 o'clock position）

location (必填): Clean studio background / White seamless / Black backdrop / Gray gradient / Indoor domestic / Outdoor natural / Urban street / Beach / Ocean / Forest / Woods / Mountain landscape / Office setting / Café / Restaurant / Bedroom / Living room / Garden / Rooftop / Industrial warehouse / Vintage interior

cameraType: 35mm DSLR / Medium format / Large format / Smartphone / Vintage film camera / Polaroid / Cinematic / Security camera / GoPro / Action cam / Drone aerial（預設: 35mm DSLR）

cameraAngle / lensType / colorGrading / sharpnessLevel: 使用專業攝影術語描述

【Personality 個性與場景】

personalityKeywords / contentNiche (必填) / clothingStyle / accessories / bodyPose / handPosition / objectsHeld / sceneLocation / sceneDetails: 描述需具備專業製片/攝影組的細節。若該項不存在（如沒拿東西），請填 None。

【Technical Specs 技術規格】

skinRenderingDetail / makeupApplication / qualityModifiers: 需強調 8K、無恐怖谷、PBR 物理渲染術語。

【返回 JSON 格式】
{
  "identity": {
    "gender": "選項值",
    "age": "年齡描述",
    "ethnicity": "種族/血統",
    "faceShape": "臉型",
    "eyeColor": "眼睛顏色",
    "eyeShape": "眼型",
    "noseType": "鼻型",
    "lipShape": "唇形",
    "distinguishingMarks": "特徵標記",
    "hairColor": "髮色",
    "hairTexture": "髮質",
    "hairStyle": "髮型",
    "skinTexture": "皮膚質感",
    "skinTone": "膚色",
    "makeup": "妝容選項",
    "bodyType": "體型選項",
    "facialExpression": "面部表情",
    "gazeDirection": "視線方向"
  },
  "style": {
    "realismLevel": "真實度選項",
    "lightingStyle": "燈光風格選項",
    "lightingTemperature": "色溫",
    "lightingDirection": "燈光方向",
    "location": "背景位置選項",
    "cameraType": "相機類型選項",
    "cameraAngle": "拍攝角度",
    "lensType": "鏡頭類型選項",
    "colorGrading": "色彩分級選項",
    "sharpnessLevel": "銳度級別選項"
  },
  "personality": {
    "personalityKeywords": "個性關鍵詞",
    "contentNiche": "內容定位選項",
    "clothingStyle": "服裝風格",
    "accessories": "配飾",
    "bodyPose": "身體姿勢",
    "handPosition": "手部位置",
    "objectsHeld": "手持物品",
    "sceneLocation": "場景位置",
    "sceneDetails": "場景細節"
  },
  "technicalSpecs": {
    "skinRenderingDetail": "皮膚渲染細節",
    "makeupApplication": "妝容應用",
    "qualityModifiers": "質量修飾詞（預設值: Photorealistic, 8K resolution, sharp focus on eyes, professional photography, no artificial smoothing, no plastic skin, no uncanny valley）"
  }
}

【核心執行規則】
全欄位輸出：JSON 中必須包含所有欄位，不得因未提及而刪除 Key。

不適用處理：對於不存在的元素，值一律設為 "None" 或 "Not applicable"。

純淨輸出：禁止任何 Markdown 代碼塊（不要有 \`\`\`json）、禁止任何前言、後記或解釋文字。只返回從 { 開始到 } 結束的純 JSON。

確保 JSON 格式正確。

---
現在我的人物描述是：`;

  // Count filled fields for each category
  const identityFilledCount = useMemo(() => {
    return Object.values(identity).filter(v => v && v.trim() !== '').length;
  }, [identity]);

  const styleFilledCount = useMemo(() => {
    return Object.values(style).filter(v => v && v.trim() !== '').length;
  }, [style]);

  const personalityFilledCount = useMemo(() => {
    return Object.values(personality).filter(v => v && v.trim() !== '').length;
  }, [personality]);

  const technicalFilledCount = useMemo(() => {
    return Object.values(technical).filter(v => v && v.trim() !== '').length;
  }, [technical]);

  // Generate JSON output
  const generateJSON = () => {
    const allFields = { ...identity, ...style, ...personality, ...technical };
    const filtered: Record<string, any> = {};

    for (const [key, value] of Object.entries(allFields)) {
      if (value && value.trim() !== '') {
        filtered[key] = value.trim();
      }
    }

    const jsonData: {
      _meta: {
        prompt_version: string;
        generated_at: string;
        field_count: number;
      };
      identity?: Partial<IdentityFields>;
      style?: Partial<StyleFields>;
      personality?: Partial<PersonalityFields>;
      technicalSpecs?: Partial<TechnicalFields>;
    } = {
      _meta: {
        prompt_version: 'v2.1',
        generated_at: new Date().toISOString(),
        field_count: Object.keys(filtered).length,
      },
      identity: {},
      style: {},
      personality: {},
      technicalSpecs: {},
    };

    const identityFields: (keyof IdentityFields)[] = [
      'gender', 'age', 'ethnicity', 'faceShape', 'eyeColor', 'eyeShape',
      'noseType', 'lipShape', 'distinguishingMarks', 'hairColor', 'hairTexture',
      'hairStyle', 'skinTexture', 'skinTone', 'makeup', 'bodyType',
      'facialExpression', 'gazeDirection'
    ];

    const styleFields: (keyof StyleFields)[] = [
      'realismLevel', 'lightingStyle', 'lightingTemperature', 'lightingDirection',
      'location', 'cameraType', 'cameraAngle', 'lensType', 'colorGrading',
      'sharpnessLevel'
    ];

    const personalityFields: (keyof PersonalityFields)[] = [
      'personalityKeywords', 'contentNiche', 'clothingStyle', 'accessories',
      'bodyPose', 'handPosition', 'objectsHeld', 'sceneLocation', 'sceneDetails'
    ];

    const technicalFields: (keyof TechnicalFields)[] = [
      'skinRenderingDetail', 'makeupApplication', 'qualityModifiers'
    ];

    identityFields.forEach(field => {
      if (filtered[field]) jsonData.identity![field] = filtered[field];
    });

    styleFields.forEach(field => {
      if (filtered[field]) jsonData.style![field] = filtered[field];
    });

    personalityFields.forEach(field => {
      if (filtered[field]) jsonData.personality![field] = filtered[field];
    });

    technicalFields.forEach(field => {
      if (filtered[field]) jsonData.technicalSpecs![field] = filtered[field];
    });

    if (Object.keys(jsonData.identity!).length === 0) delete jsonData.identity;
    if (Object.keys(jsonData.style!).length === 0) delete jsonData.style;
    if (Object.keys(jsonData.personality!).length === 0) delete jsonData.personality;
    if (Object.keys(jsonData.technicalSpecs!).length === 0) delete jsonData.technicalSpecs;

    return JSON.stringify(jsonData, null, 2);
  };

  // Generate natural language prompt
  const generatePromptText = () => {
    const parts: string[] = [];

    if (identity.age || identity.gender || identity.ethnicity) {
      const baseDesc = [identity.age, identity.gender, identity.ethnicity]
        .filter(x => x)
        .join(' ');
      if (baseDesc) parts.push(baseDesc);
    }

    const appearance: string[] = [];
    const hair = [identity.hairColor, identity.hairTexture, identity.hairStyle].filter(x => x).join(' ');
    if (hair) appearance.push(`hair: ${hair}`);

    const eyes = [identity.eyeColor, identity.eyeShape].filter(x => x).join(' ');
    if (eyes) appearance.push(`eyes: ${eyes}`);

    const skin = [identity.skinTone, identity.skinTexture].filter(x => x).join(' ');
    if (skin) appearance.push(`skin: ${skin}`);

    if (identity.faceShape) appearance.push(`face: ${identity.faceShape}`);
    if (identity.noseType) appearance.push(`nose: ${identity.noseType}`);
    if (identity.lipShape) appearance.push(`lips: ${identity.lipShape}`);
    if (identity.distinguishingMarks) appearance.push(`marks: ${identity.distinguishingMarks}`);

    if (appearance.length > 0) parts.push(`Appearance: ${appearance.join(', ')}`);

    if (identity.makeup && identity.makeup !== 'No makeup') {
      parts.push(`Makeup: ${identity.makeup}`);
    }
    if (identity.bodyType) parts.push(`Body: ${identity.bodyType}`);

    const expression = [identity.facialExpression, identity.gazeDirection ? `gaze: ${identity.gazeDirection}` : null].filter(x => x);
    if (expression.length > 0) parts.push(`Expression: ${expression.join(', ')}`);

    if (personality.clothingStyle) parts.push(`Clothing: ${personality.clothingStyle}`);
    if (personality.accessories) parts.push(`Accessories: ${personality.accessories}`);

    const pose = [personality.bodyPose, personality.handPosition ? `hands: ${personality.handPosition}` : null, personality.objectsHeld ? `holding: ${personality.objectsHeld}` : null].filter(x => x);
    if (pose.length > 0) parts.push(`Pose: ${pose.join(', ')}`);

    const scene = [style.location, personality.sceneLocation, personality.sceneDetails].filter(x => x);
    if (scene.length > 0) parts.push(`Scene: ${scene.join(', ')}`);

    const photography = [style.lightingStyle, style.lightingTemperature, style.lightingDirection, style.cameraType, style.cameraAngle, style.lensType].filter(x => x);
    if (photography.length > 0) parts.push(`Photography: ${photography.join(', ')}`);

    const styleParams = [style.realismLevel, style.colorGrading, style.sharpnessLevel, personality.contentNiche].filter(x => x);
    if (styleParams.length > 0) parts.push(`Style: ${styleParams.join(', ')}`);

    const tech = [technical.skinRenderingDetail, technical.makeupApplication, technical.qualityModifiers].filter(x => x);
    if (tech.length > 0) parts.push(`Technical: ${tech.join(', ')}`);

    if (personality.personalityKeywords) parts.push(`Personality: ${personality.personalityKeywords}`);

    return parts.join(' | ');
  };

  // Handle form submission
  const handleGenerate = () => {
    const errors: string[] = [];

    if (!identity.gender) errors.push('Gender 性别');
    if (!identity.age) errors.push('Age 年龄');
    if (!style.realismLevel) errors.push('Realism Level 真实度级别');
    if (!style.lightingStyle) errors.push('Lighting Style 灯光风格');
    if (!style.location) errors.push('Location 背景位置');
    if (!personality.contentNiche) errors.push('Content Niche 内容定位');

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    setGeneratedJSON(generateJSON());
    setGeneratedPrompt(generatePromptText());
  };

  // Handle reset
  const handleReset = () => {
    if (!confirm('確定要重置所有字段嗎？')) return;

    setIdentity({
      gender: '',
      age: '',
      ethnicity: '',
      faceShape: '',
      eyeColor: '',
      eyeShape: '',
      noseType: '',
      lipShape: '',
      distinguishingMarks: '',
      hairColor: '',
      hairTexture: '',
      hairStyle: '',
      skinTexture: '',
      skinTone: '',
      makeup: 'No makeup',
      bodyType: 'Slim / Petite',
      facialExpression: '',
      gazeDirection: '',
    });

    setStyle({
      realismLevel: '',
      lightingStyle: '',
      lightingTemperature: '',
      lightingDirection: '',
      location: '',
      cameraType: '35mm DSLR',
      cameraAngle: '',
      lensType: '50mm portrait',
      colorGrading: 'Neutral / Natural',
      sharpnessLevel: 'Standard sharp',
    });

    setPersonality({
      personalityKeywords: '',
      contentNiche: '',
      clothingStyle: '',
      accessories: '',
      bodyPose: '',
      handPosition: '',
      objectsHeld: '',
      sceneLocation: '',
      sceneDetails: '',
    });

    setTechnical({
      skinRenderingDetail: '',
      makeupApplication: '',
      qualityModifiers: 'Photorealistic, 8K resolution, sharp focus on eyes, professional photography, no artificial smoothing, no plastic skin, no uncanny valley',
    });

    setGeneratedJSON('');
    setGeneratedPrompt('');
    setValidationErrors([]);
  };

  // Copy to clipboard
  const handleCopy = async (text: string, type: string) => {
    if (!text) {
      alert('請先生成提示詞！');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      alert('複製失敗，請手動複製');
    }
  };

  // Save identity to localStorage
  const handleSaveToStorage = () => {
    if (!generatedJSON) {
      alert('請先生成提示詞！');
      return;
    }
    localStorage.setItem('aiPortraitGenerator_lastIdentity', generatedJSON);
    alert('✅ Identity 已儲存！您可以在「多角度參考表生成器」中使用。');
  };

  // Copy AI prompt template
  const handleCopyAIPrompt = async () => {
    try {
      await navigator.clipboard.writeText(AIPROMPT_TEMPLATE);
      setCopySuccess('ai-prompt');
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      alert('複製失敗，請手動複製');
    }
  };

  // Import from JSON and populate form
  const handleImportFromJSON = () => {
    if (!importJSON.trim()) {
      setImportError('請先貼上 AI 返回的 JSON');
      return;
    }

    try {
      // Clean up the JSON string - remove markdown code blocks if present
      let cleanedJSON = importJSON.trim();
      if (cleanedJSON.startsWith('```')) {
        cleanedJSON = cleanedJSON.replace(/^```(?:json)?\n/, '').replace(/\n```$/, '');
      }

      const parsed = JSON.parse(cleanedJSON);

      // Map parsed data to form state
      if (parsed.identity && typeof parsed.identity === 'object') {
        setIdentity(prev => ({ ...prev, ...parsed.identity }));
      }
      if (parsed.style && typeof parsed.style === 'object') {
        setStyle(prev => ({ ...prev, ...parsed.style }));
      }
      if (parsed.personality && typeof parsed.personality === 'object') {
        setPersonality(prev => ({ ...prev, ...parsed.personality }));
      }
      if (parsed.technicalSpecs && typeof parsed.technicalSpecs === 'object') {
        setTechnical(prev => ({ ...prev, ...parsed.technicalSpecs }));
      }

      setImportError('');
      setImportSuccess(true);
      setImportJSON('');

      // Clear success message after 3 seconds
      setTimeout(() => setImportSuccess(false), 3000);
    } catch (err) {
      setImportError('JSON 格式錯誤，請檢查後重試。請確保貼上的是純 JSON 格式，不包含任何額外文字。');
      setImportSuccess(false);
    }
  };

  // Accordion items
  const accordionItems = [
    {
      id: 'identity',
      title: 'Identity - 身份特徵',
      icon: '👤',
      requiredCount: 2,
      filledCount: identityFilledCount,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Gender 性别"
              options={GENDER_OPTIONS}
              value={identity.gender}
              onChange={(e) => setIdentity({ ...identity, gender: e.target.value })}
              required
            />
            <Input
              label="Age 年龄"
              value={identity.age}
              onChange={(e) => setIdentity({ ...identity, age: e.target.value })}
              placeholder="例如：25歲、30-35歲、青少年"
              required
              isInvalid={validationErrors.includes('Age 年龄')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Ethnicity 種族/血統"
              value={identity.ethnicity}
              onChange={(e) => setIdentity({ ...identity, ethnicity: e.target.value })}
              placeholder="例如：東亞、歐洲、非洲、拉丁裔"
            />
            <Input
              label="Face Shape 臉型"
              value={identity.faceShape}
              onChange={(e) => setIdentity({ ...identity, faceShape: e.target.value })}
              placeholder="例如：橢圓臉、圓臉、方臉、心形臉"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Eye Color 眼睛顏色"
              value={identity.eyeColor}
              onChange={(e) => setIdentity({ ...identity, eyeColor: e.target.value })}
              placeholder="例如：深棕色、淺藍色、綠色"
            />
            <Input
              label="Eye Shape 眼型"
              value={identity.eyeShape}
              onChange={(e) => setIdentity({ ...identity, eyeShape: e.target.value })}
              placeholder="例如：杏仁眼、圓眼、內雙"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nose Type 鼻型"
              value={identity.noseType}
              onChange={(e) => setIdentity({ ...identity, noseType: e.target.value })}
              placeholder="例如：挺直、小巧、鷹鉤鼻"
            />
            <Input
              label="Lip Shape 唇形"
              value={identity.lipShape}
              onChange={(e) => setIdentity({ ...identity, lipShape: e.target.value })}
              placeholder="例如：飽滿、薄唇、上翹"
            />
          </div>

          <Input
            label="Distinguishing Marks 特徵標記"
            value={identity.distinguishingMarks}
            onChange={(e) => setIdentity({ ...identity, distinguishingMarks: e.target.value })}
            placeholder="例如：右頸有小痣、左眉有疤痕、酒窩"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Hair Color 髮色"
              value={identity.hairColor}
              onChange={(e) => setIdentity({ ...identity, hairColor: e.target.value })}
              placeholder="例如：深黑色、栗色、金色"
            />
            <Input
              label="Hair Texture 髮質"
              value={identity.hairTexture}
              onChange={(e) => setIdentity({ ...identity, hairTexture: e.target.value })}
              placeholder="例如：直髮、波浪、捲髮"
            />
          </div>

          <Input
            label="Hair Style 髮型"
            value={identity.hairStyle}
            onChange={(e) => setIdentity({ ...identity, hairStyle: e.target.value })}
            placeholder="例如：長髮披肩、短髮波波頭、馬尾辮"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Skin Texture 皮膚質感"
              value={identity.skinTexture}
              onChange={(e) => setIdentity({ ...identity, skinTexture: e.target.value })}
              placeholder="例如：光滑、有毛孔細節、啞光"
            />
            <Input
              label="Skin Tone 膚色"
              value={identity.skinTone}
              onChange={(e) => setIdentity({ ...identity, skinTone: e.target.value })}
              placeholder="例如：白皙、小麥色、暖調"
            />
          </div>

          <Select
            label="Makeup 妆容"
            options={MAKEUP_OPTIONS}
            value={identity.makeup}
            onChange={(e) => setIdentity({ ...identity, makeup: e.target.value })}
          />

          <Select
            label="Body Type 體型"
            options={BODY_TYPE_OPTIONS}
            value={identity.bodyType}
            onChange={(e) => setIdentity({ ...identity, bodyType: e.target.value })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Facial Expression 面部表情"
              value={identity.facialExpression}
              onChange={(e) => setIdentity({ ...identity, facialExpression: e.target.value })}
              placeholder="例如：微笑、嚴肅、沉思"
            />
            <Input
              label="Gaze Direction 視線方向"
              value={identity.gazeDirection}
              onChange={(e) => setIdentity({ ...identity, gazeDirection: e.target.value })}
              placeholder="例如：直視鏡頭、看向遠方"
            />
          </div>
        </div>
      ),
    },
    {
      id: 'style',
      title: 'Style - 風格參數',
      icon: '🎬',
      requiredCount: 3,
      filledCount: styleFilledCount,
      content: (
        <div className="space-y-4">
          <Select
            label="Realism Level 真實度級別"
            options={REALISM_OPTIONS}
            value={style.realismLevel}
            onChange={(e) => setStyle({ ...style, realismLevel: e.target.value })}
            required
            isInvalid={validationErrors.includes('Realism Level 真实度级别')}
          />

          <Select
            label="Lighting Style 燈光風格"
            options={LIGHTING_OPTIONS}
            value={style.lightingStyle}
            onChange={(e) => setStyle({ ...style, lightingStyle: e.target.value })}
            required
            isInvalid={validationErrors.includes('Lighting Style 灯光风格')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Lighting Temperature 色溫"
              value={style.lightingTemperature}
              onChange={(e) => setStyle({ ...style, lightingTemperature: e.target.value })}
              placeholder="例如：3200K（暖黃）、5200K（自然日光）"
            />
            <Input
              label="Lighting Direction 燈光方向"
              value={style.lightingDirection}
              onChange={(e) => setStyle({ ...style, lightingDirection: e.target.value })}
              placeholder="例如：2點鐘方向、正前方、側光"
            />
          </div>

          <Select
            label="Location 背景位置"
            options={LOCATION_OPTIONS}
            value={style.location}
            onChange={(e) => setStyle({ ...style, location: e.target.value })}
            required
            isInvalid={validationErrors.includes('Location 背景位置')}
          />

          <Select
            label="Camera Type 相機類型"
            options={CAMERA_TYPE_OPTIONS}
            value={style.cameraType}
            onChange={(e) => setStyle({ ...style, cameraType: e.target.value })}
          />

          <Input
            label="Camera Angle 拍攝角度"
            value={style.cameraAngle}
            onChange={(e) => setStyle({ ...style, cameraAngle: e.target.value })}
            placeholder="例如：平視、俯拍、仰拍、3/4正面"
          />

          <Select
            label="Lens Type 鏡頭類型"
            options={LENS_TYPE_OPTIONS}
            value={style.lensType}
            onChange={(e) => setStyle({ ...style, lensType: e.target.value })}
          />

          <Select
            label="Color Grading 色彩分級"
            options={COLOR_GRADING_OPTIONS}
            value={style.colorGrading}
            onChange={(e) => setStyle({ ...style, colorGrading: e.target.value })}
          />

          <Select
            label="Sharpness Level 銳度級別"
            options={SHARPNESS_OPTIONS}
            value={style.sharpnessLevel}
            onChange={(e) => setStyle({ ...style, sharpnessLevel: e.target.value })}
          />
        </div>
      ),
    },
    {
      id: 'personality',
      title: 'Personality - 個性與場景',
      icon: '🎭',
      requiredCount: 1,
      filledCount: personalityFilledCount,
      content: (
        <div className="space-y-4">
          <Input
            label="Personality Keywords 個性關鍵詞"
            value={personality.personalityKeywords}
            onChange={(e) => setPersonality({ ...personality, personalityKeywords: e.target.value })}
            placeholder="例如：自信、優雅、活潑、沉穩"
          />

          <Select
            label="Content Niche 內容定位"
            options={CONTENT_NICHE_OPTIONS}
            value={personality.contentNiche}
            onChange={(e) => setPersonality({ ...personality, contentNiche: e.target.value })}
            required
            isInvalid={validationErrors.includes('Content Niche 内容定位')}
          />

          <Input
            label="Clothing Style 服裝風格"
            value={personality.clothingStyle}
            onChange={(e) => setPersonality({ ...personality, clothingStyle: e.target.value })}
            placeholder="例如：極簡風、商務正裝、休閒T恤、連衣裙"
          />

          <Input
            label="Accessories 配飾"
            value={personality.accessories}
            onChange={(e) => setPersonality({ ...personality, accessories: e.target.value })}
            placeholder="例如：大金耳環、項鍊、手錶、墨鏡"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Body Pose 身體姿勢"
              value={personality.bodyPose}
              onChange={(e) => setPersonality({ ...personality, bodyPose: e.target.value })}
              placeholder="例如：站立、坐姿、側身30度"
            />
            <Input
              label="Hand Position 手部位置"
              value={personality.handPosition}
              onChange={(e) => setPersonality({ ...personality, handPosition: e.target.value })}
              placeholder="例如：自然下垂、插口袋、托腮"
            />
          </div>

          <Input
            label="Objects Held 手持物品"
            value={personality.objectsHeld}
            onChange={(e) => setPersonality({ ...personality, objectsHeld: e.target.value })}
            placeholder="例如：咖啡杯、書本、手機、花束、包包"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Scene Location 場景位置"
              value={personality.sceneLocation}
              onChange={(e) => setPersonality({ ...personality, sceneLocation: e.target.value })}
              placeholder="例如：臥室、辦公室、咖啡館、公園"
            />
            <Input
              label="Scene Details 場景細節"
              value={personality.sceneDetails}
              onChange={(e) => setPersonality({ ...personality, sceneDetails: e.target.value })}
              placeholder="例如：木質相框、綠植、書架、窗簾"
            />
          </div>
        </div>
      ),
    },
    {
      id: 'technical',
      title: 'Technical Specs - 技術規格',
      icon: '⚙️',
      requiredCount: 0,
      filledCount: technicalFilledCount,
      content: (
        <div className="space-y-4">
          <Textarea
            label="Skin Rendering Detail 皮膚渲染細節"
            value={technical.skinRenderingDetail}
            onChange={(e) => setTechnical({ ...technical, skinRenderingDetail: e.target.value })}
            placeholder="例如：可見毛孔、自然散射、細微絨毛、無過度磨皮"
          />

          <Textarea
            label="Makeup Application 妝容應用"
            value={technical.makeupApplication}
            onChange={(e) => setTechnical({ ...technical, makeupApplication: e.target.value })}
            placeholder="例如：輕薄底妝、自然眼線、淡色唇膏、無厚重感"
          />

          <Textarea
            label="Quality Modifiers 質量修飾詞"
            value={technical.qualityModifiers}
            onChange={(e) => setTechnical({ ...technical, qualityModifiers: e.target.value })}
            placeholder="例如：8K分辨率、專業攝影、無塑料感皮膚、無恐怖谷效應"
            showCharCount
            maxLength={500}
          />
        </div>
      ),
    },
  ];

  return (
    <Layout
      title="AI 人像提示詞生成器 - 0xShinyui"
      description="根據標準化字段生成高質量的 AI 圖像提示詞"
      canonical="/ai-prompt-generator"
    >
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1
              className="text-4xl sm:text-5xl font-bold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              🎨 AI 人像提示詞生成器
            </h1>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: 'var(--text-muted)' }}
            >
              根據標準化字段生成高質量的圖像提示詞 JSON 和自然語言格式
            </p>
          </div>

          {/* Validation errors */}
          {validationErrors.length > 0 && (
            <Card padding="md" className="mb-6" style={{ borderColor: '#ef4444' }}>
              <h3 style={{ color: '#ef4444' }} className="font-semibold mb-2">
                ⚠️ 請填寫所有必填字段
              </h3>
              <ul className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {validationErrors.map((error, i) => (
                  <li key={i}>• {error}</li>
                ))}
              </ul>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Form */}
            <div className="lg:col-span-2">
              {/* AI Assistant Section */}
              <Card padding="lg" className="mb-6">
                <button
                  onClick={() => setShowAIPrompt(!showAIPrompt)}
                  className="w-full flex items-center justify-between py-2"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🤖</span>
                    <h2 className="text-xl font-semibold" style={{ color: 'var(--accent-gold)' }}>
                      使用 AI 輔助生成
                    </h2>
                  </div>
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${
                      showAIPrompt ? 'rotate-180' : ''
                    }`}
                    style={{ color: 'var(--text-muted)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showAIPrompt && (
                  <div className="mt-6 space-y-6">
                    {/* Description */}
                    <div
                      className="p-4 rounded-lg"
                      style={{
                        backgroundColor: 'var(--hover-background)',
                        borderLeft: '3px solid var(--accent-gold)',
                      }}
                    >
                      <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                        快速生成結構化數據 - 使用您喜歡的 AI 工具（ChatGPT、Claude、Gemini
                        等）自動填寫表單字段
                      </p>
                    </div>

                    {/* Steps */}
                    <div className="space-y-3">
                      <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        使用步驟：
                      </h4>
                      <ol className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <li className="flex items-start gap-2">
                          <span
                            className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                            style={{
                              backgroundColor: 'var(--accent-gold)',
                              color: 'var(--background)',
                            }}
                          >
                            1
                          </span>
                          <span>點擊下方「複製提示詞」按鈕</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span
                            className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                            style={{
                              backgroundColor: 'var(--accent-gold)',
                              color: 'var(--background)',
                            }}
                          >
                            2
                          </span>
                          <span>貼上到 ChatGPT / Claude / Gemini 等 AI 工具</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span
                            className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                            style={{
                              backgroundColor: 'var(--accent-gold)',
                              color: 'var(--background)',
                            }}
                          >
                            3
                          </span>
                          <span>在提示詞末尾加入您的人物描述</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span
                            className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                            style={{
                              backgroundColor: 'var(--accent-gold)',
                              color: 'var(--background)',
                            }}
                          >
                            4
                          </span>
                          <span>將 AI 返回的 JSON 貼到下方輸入框並點擊載入</span>
                        </li>
                      </ol>
                    </div>

                    {/* Copy button */}
                    <button
                      onClick={handleCopyAIPrompt}
                      className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
                      style={{
                        backgroundColor:
                          copySuccess === 'ai-prompt' ? '#17a58a' : 'var(--accent-gold)',
                        color: 'var(--background)',
                      }}
                    >
                      {copySuccess === 'ai-prompt' ? '✅ 已複製！' : '📋 複製提示詞模板'}
                    </button>

                    {/* Prompt preview */}
                    <div>
                      <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                        提示詞模板預覽：
                      </h4>
                      <div
                        className="p-4 rounded-lg overflow-x-auto"
                        style={{
                          backgroundColor: '#0b0e11',
                          border: '1px solid var(--border-color)',
                          maxHeight: '200px',
                          overflowY: 'auto',
                        }}
                      >
                        <pre
                          className="text-xs"
                          style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}
                        >
                          {AIPROMPT_TEMPLATE}
                        </pre>
                      </div>
                    </div>

                    {/* Import section */}
                    <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
                      <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                        📥 載入 AI 返回的 JSON
                      </h4>
                      <Textarea
                        value={importJSON}
                        onChange={(e) => setImportJSON(e.target.value)}
                        placeholder="將 AI 返回的 JSON 貼到這裡..."
                        rows={6}
                      />
                      {importError && (
                        <p className="text-sm mt-2" style={{ color: '#ef4444' }}>
                          ⚠️ {importError}
                        </p>
                      )}
                      {importSuccess && (
                        <p className="text-sm mt-2" style={{ color: '#17a58a' }}>
                          ✅ 成功載入！表單字段已更新。
                        </p>
                      )}
                      <button
                        onClick={handleImportFromJSON}
                        className="w-full mt-3 py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
                        style={{
                          backgroundColor: 'var(--accent-gold)',
                          color: 'var(--background)',
                        }}
                      >
                        🔄 從 JSON 載入到表單
                      </button>
                    </div>
                  </div>
                )}
              </Card>

              <Accordion items={accordionItems} defaultOpen="identity" allowMultiple={true} />

              {/* Action buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleGenerate}
                  className="flex-1 py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: 'var(--accent-gold)',
                    color: 'var(--background)',
                  }}
                >
                  🚀 生成提示詞
                </button>
                <button
                  onClick={handleReset}
                  className="py-4 px-6 rounded-lg font-semibold transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--border-color)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  🔄 重置
                </button>
              </div>
            </div>

            {/* Right column - Output */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <Card padding="lg">
                  <h2
                    className="text-lg font-semibold mb-4"
                    style={{ color: 'var(--accent-gold)' }}
                  >
                    📤 輸出結果
                  </h2>

                  {/* Tab switcher */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setOutputTab('json')}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                        outputTab === 'json' ? '' : 'opacity-60'
                      }`}
                      style={{
                        backgroundColor:
                          outputTab === 'json' ? 'var(--accent-gold)' : 'var(--border-color)',
                        color: outputTab === 'json' ? 'var(--background)' : 'var(--text-primary)',
                      }}
                    >
                      JSON
                    </button>
                    <button
                      onClick={() => setOutputTab('prompt')}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                        outputTab === 'prompt' ? '' : 'opacity-60'
                      }`}
                      style={{
                        backgroundColor:
                          outputTab === 'prompt' ? 'var(--accent-gold)' : 'var(--border-color)',
                        color:
                          outputTab === 'prompt' ? 'var(--background)' : 'var(--text-primary)',
                      }}
                    >
                      Prompt
                    </button>
                  </div>

                  {/* Output content */}
                  {outputTab === 'json' ? (
                    <>
                      <div
                        className="p-4 rounded-lg mb-4 overflow-x-auto"
                        style={{
                          backgroundColor: '#0b0e11',
                          borderColor: 'var(--border-color)',
                          fontFamily: 'monospace',
                          fontSize: '12px',
                          maxHeight: '400px',
                          overflowY: 'auto',
                        }}
                      >
                        <pre style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                          {generatedJSON || '// 點擊「生成提示詞」查看結果...'}
                        </pre>
                      </div>
                      <button
                        onClick={() => handleCopy(generatedJSON, 'json')}
                        className="w-full py-3 rounded-lg font-medium transition-all duration-200"
                        style={{
                          backgroundColor: copySuccess === 'json' ? '#17a58a' : '#28a745',
                          color: 'white',
                        }}
                      >
                        {copySuccess === 'json' ? '✅ 已複製！' : '📋 複製 JSON'}
                      </button>
                      <button
                        onClick={handleSaveToStorage}
                        className="w-full py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
                        style={{
                          backgroundColor: 'var(--accent-gold)',
                          color: 'var(--background)',
                          marginTop: '8px',
                        }}
                      >
                        💾 儲存 Identity（用於多角度工具）
                      </button>
                    </>
                  ) : (
                    <>
                      <div
                        className="p-4 rounded-lg mb-4 overflow-x-auto"
                        style={{
                          backgroundColor: '#0b0e11',
                          borderColor: 'var(--accent-gold)',
                          fontFamily: 'inherit',
                          fontSize: '14px',
                          maxHeight: '400px',
                          overflowY: 'auto',
                        }}
                      >
                        <pre style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                          {generatedPrompt || '// 點擊「生成提示詞」查看結果...'}
                        </pre>
                      </div>
                      <button
                        onClick={() => handleCopy(generatedPrompt, 'prompt')}
                        className="w-full py-3 rounded-lg font-medium transition-all duration-200"
                        style={{
                          backgroundColor: copySuccess === 'prompt' ? '#17a58a' : '#28a745',
                          color: 'white',
                        }}
                      >
                        {copySuccess === 'prompt' ? '✅ 已複製！' : '📋 複製 Prompt'}
                      </button>
                    </>
                  )}

                  {/* Tips */}
                  <div
                    className="mt-4 p-3 rounded-lg text-sm"
                    style={{
                      backgroundColor: 'var(--hover-background)',
                      borderLeft: '3px solid var(--accent-gold)',
                    }}
                  >
                    <p style={{ color: 'var(--text-muted)' }}>
                      💡 JSON 格式可用於 API 調用，自然語言 Prompt 可直接用於圖像生成工具。
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Bottom info */}
          <div
            className="mt-12 p-6 rounded-lg"
            style={{
              backgroundColor: 'var(--card-background)',
              border: '2px dashed var(--border-color)',
            }}
          >
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: 'var(--accent-gold)' }}
            >
              💡 使用提示
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              <li>• 點擊分類標題可展開/折疊表單區域</li>
              <li>• 標記 <span className="text-red-400">*</span> 的字段為必填項</li>
              <li>• 所有選擇均有合理的預設值，可根據需要調整</li>
              <li>• 生成後點擊複製按鈕即可複製到剪貼板</li>
              <li>• 此工具完全在瀏覽器本地運行，不會上傳任何數據</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
