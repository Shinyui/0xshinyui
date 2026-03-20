import React, { useState, useEffect, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Textarea from '@/components/ui/Textarea';

// TypeScript interfaces
interface BaseIdentity {
  _meta?: {
    prompt_version?: string;
    generated_at?: string;
    field_count?: number;
  };
  identity?: {
    gender?: string;
    age?: string;
    ethnicity?: string;
    faceShape?: string;
    eyeColor?: string;
    eyeShape?: string;
    noseType?: string;
    lipShape?: string;
    distinguishingMarks?: string;
    hairColor?: string;
    hairTexture?: string;
    hairStyle?: string;
    skinTexture?: string;
    skinTone?: string;
    makeup?: string;
    bodyType?: string;
    facialExpression?: string;
    gazeDirection?: string;
  };
  style?: Record<string, any>;
  personality?: Record<string, any>;
  technicalSpecs?: Record<string, any>;
}

type MacroShotType = 'full-body' | 'mid-shot' | 'extreme-close-up';
type MacroTargetType = 'eye' | 'skin' | 'lip' | 'nose' | 'eyelash';

interface MacroShotOutput {
  task: string;
  instruction: string;
  base_identity: string;
  shot_type: string;
  macro_target: string;
  macro_specifications: {
    lens: string;
    aperture: string;
    focus_target: string;
    visible_details: string[];
    lighting_consideration: string;
  };
  target_details: {
    // Eye details
    iris_patterns?: boolean;
    limbal_ring_detail?: boolean;
    individual_eyelashes?: boolean;
    micro_reflections?: boolean;
    natural_moisture?: boolean;
    blood_vessels?: boolean;
    // Skin texture details
    individual_pores?: boolean;
    vellus_hair?: boolean;
    skin_texture_variations?: boolean;
    subtle_imperfections?: boolean;
    micro_wrinkles?: boolean;
    skin_tone_gradients?: boolean;
    // Lip details
    vertical_lip_lines?: boolean;
    color_variations?: boolean;
    surface_detail?: boolean;
    natural_sheen?: boolean;
    cupid_bow_detail?: boolean;
    lip_volume?: boolean;
    // Nose details
    pore_detail?: boolean;
    nose_contour_shadows?: boolean;
    fine_hairs?: boolean;
    bone_structure?: boolean;
    bridge_curve?: boolean;
    // Eyelash details
    lash_curve?: boolean;
    lash_spacing?: boolean;
    lash_root_detail?: boolean;
    eyelid_texture?: boolean;
    lash_density?: boolean;
    natural_distribution?: boolean;
  };
  depth_of_field: string;
  quality_requirements: string[];
  professional_standards: string;
}

// Constants
const MACRO_SHOT_LABELS: Record<MacroShotType, string> = {
  'full-body': '全身 (Full body)',
  'mid-shot': '半身 (Mid shot)',
  'extreme-close-up': '極特寫 (Extreme close-up)'
};

const MACRO_SHOT_DESCRIPTIONS: Record<MacroShotType, string> = {
  'full-body': 'Full body shot, head to toe visible, complete figure in frame, environmental context visible',
  'mid-shot': 'Mid shot from waist up, upper body and face clearly visible, tighter framing',
  'extreme-close-up': 'Extreme close-up shot, shoulders and face, intimate framing, detailed facial features'
};

const MACRO_SHOT_ICONS: Record<MacroShotType, string> = {
  'full-body': '🧍‍♂️',
  'mid-shot': '🧍',
  'extreme-close-up': '🔍'
};

const MACRO_TARGET_LABELS: Record<MacroTargetType, string> = {
  'eye': '眼部特寫 (Eye Macro)',
  'skin': '皮膚紋理 (Skin Texture)',
  'lip': '嘴唇細節 (Lip Detail)',
  'nose': '鼻樑細節 (Nose Bridge)',
  'eyelash': '睫毛細節 (Eyelash Detail)'
};

const MACRO_TARGET_ICONS: Record<MacroTargetType, string> = {
  'eye': '👁️',
  'skin': '🧴',
  'lip': '👄',
  'nose': '👃',
  'eyelash': '👁️'
};

const MACRO_TARGET_SHORT_LABELS: Record<MacroTargetType, string> = {
  'eye': '眼部特寫',
  'skin': '皮膚紋理',
  'lip': '嘴唇細節',
  'nose': '鼻樑細節',
  'eyelash': '睫毛細節'
};

// Eye macro specifications
const EYE_MACRO_SPECS = {
  lens: '100mm macro lens',
  aperture: 'f/2.8',
  focus_target: 'Extreme macro close-up of a single eye',
  visible_details: [
    'Visible iris patterns',
    'Limbal ring detail',
    'Individual eyelashes',
    'Micro-reflections in pupil',
    'Natural moisture on eye surface',
    'Subtle blood vessels in sclera'
  ],
  lighting_consideration: 'Ultra-sharp focus on iris texture with shallow depth of field',
  depth_of_field: 'shallow depth of field'
};

const EYE_MACRO_INSTRUCTION = 'Macro Shot: Extreme macro close-up of a single eye. 100mm macro lens, f/2.8. Visible iris patterns, limbal ring detail, individual eyelashes, micro-reflections in pupil, natural moisture on eye surface, subtle blood vessels in sclera. Ultra-sharp focus on iris texture with shallow depth of field. Same exact person from identity lock. Hyper-realistic detail. Natural imperfections maintained. Professional macro photography with accurate depth of field and lighting for extreme close-up work.';

// Skin macro specifications
const SKIN_MACRO_SPECS = {
  lens: '100mm macro lens',
  aperture: 'f/2.8',
  focus_target: 'Extreme macro close-up of cheek skin',
  visible_details: [
    'Individual pores visible',
    'Fine vellus hair (peach fuzz)',
    'Natural skin texture variations',
    'Subtle imperfections',
    'Micro-wrinkles',
    'Realistic skin tone gradients'
  ],
  lighting_consideration: 'No smoothing, no artificial enhancement',
  depth_of_field: 'shallow depth of field'
};

const SKIN_MACRO_INSTRUCTION = 'Macro Shot: Extreme macro close-up of cheek skin. 100mm macro lens, f/2.8. Individual pores visible, fine vellus hair (peach fuzz), natural skin texture variations, subtle imperfections, micro-wrinkles, realistic skin tone gradients. No smoothing, no artificial enhancement. Same exact person from identity lock. Hyper-realistic detail. Natural imperfections maintained. Professional macro photography with accurate depth of field and lighting for extreme close-up work.';

// Lip macro specifications
const LIP_MACRO_SPECS = {
  lens: '100mm macro lens',
  aperture: 'f/2.8',
  focus_target: 'Extreme macro close-up of lips',
  visible_details: [
    'Natural lip texture and vertical lip lines visible',
    'Subtle color variations from center to edges',
    'Natural moisture',
    'Fine detail in lip surface',
    'Photorealistic rendering of lip structure',
    'Lip volume and fullness'
  ],
  lighting_consideration: 'Photorealistic rendering of lip structure',
  depth_of_field: 'shallow depth of field'
};

const LIP_MACRO_INSTRUCTION = 'Macro Shot: Extreme macro close-up of lips. 100mm macro lens, f/2.8. Natural lip texture and vertical lip lines visible, subtle color variations from center to edges, natural moisture, fine detail in lip surface. Photorealistic rendering of lip structure. Same exact person from identity lock. Hyper-realistic detail. Natural imperfections maintained. Professional macro photography with accurate depth of field and lighting for extreme close-up work.';

// Nose macro specifications
const NOSE_MACRO_SPECS = {
  lens: '100mm macro lens',
  aperture: 'f/2.8',
  focus_target: 'Extreme macro close-up of nose bridge between eyes',
  visible_details: [
    'Skin pore detail',
    'Subtle shadows in nose contours',
    'Natural skin texture',
    'Visible fine hairs',
    'Realistic bone structure underneath skin surface',
    'Nasal bridge curvature'
  ],
  lighting_consideration: 'Realistic bone structure underneath skin surface',
  depth_of_field: 'shallow depth of field'
};

const NOSE_MACRO_INSTRUCTION = 'Macro Shot: Extreme macro close-up of nose bridge between eyes. 100mm macro lens, f/2.8. Skin pore detail, subtle shadows in nose contours, natural skin texture, visible fine hairs, realistic bone structure underneath skin surface. Same exact person from identity lock. Hyper-realistic detail. Natural imperfections maintained. Professional macro photography with accurate depth of field and lighting for extreme close-up work.';

// Eyelash macro specifications
const EYELASH_MACRO_SPECS = {
  lens: '100mm macro lens',
  aperture: 'f/2.8',
  focus_target: 'Extreme macro close-up of upper eyelashes',
  visible_details: [
    'Individual eyelash strands with natural curve and spacing',
    'Fine detail in lash roots',
    'Skin texture of eyelid visible',
    'Natural spacing between lashes',
    'Realistic lash density',
    'Lash length variation'
  ],
  lighting_consideration: 'Natural spacing between lashes',
  depth_of_field: 'shallow depth of field'
};

const EYELASH_MACRO_INSTRUCTION = 'Macro Shot: Extreme macro close-up of upper eyelashes. 100mm macro lens, f/2.8. Individual eyelash strands with natural curve and spacing, fine detail in lash roots, skin texture of eyelid visible, natural spacing between lashes, realistic lash density. Same exact person from identity lock. Hyper-realistic detail. Natural imperfections maintained. Professional macro photography with accurate depth of field and lighting for extreme close-up work.';

export default function MacroShotGeneratorPage() {
  // State
  const [identityJSON, setIdentityJSON] = useState('');
  const [parsedIdentity, setParsedIdentity] = useState<BaseIdentity | null>(null);
  const [shotType, setShotType] = useState<MacroShotType>('full-body');
  const [macroTarget, setMacroTarget] = useState<MacroTargetType>('eye');
  const [generatedOutput, setGeneratedOutput] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [parseError, setParseError] = useState('');

  // Auto-load from localStorage on mount
  useEffect(() => {
    // Guard: Only access localStorage in browser environment
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aiPortraitGenerator_lastIdentity');
      if (saved) {
        setIdentityJSON(saved);
        try {
          const parsed = JSON.parse(saved);
          setParsedIdentity(parsed);
          setParseError('');
        } catch (err) {
          setParseError('已儲存的 JSON 格式無效，請重新輸入');
        }
      }
    }
  }, []);

  // Parse JSON when input changes
  const handleParseJSON = (value: string) => {
    setIdentityJSON(value);
    setParseError('');

    if (!value.trim()) {
      setParsedIdentity(null);
      return;
    }

    try {
      // Clean markdown code blocks if present
      let cleaned = value.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\n/, '').replace(/\n```$/, '');
      }

      const parsed = JSON.parse(cleaned);

      // Validate that it has at least identity data
      if (!parsed.identity || typeof parsed.identity !== 'object') {
        setParseError('JSON 必須包含 "identity" 物件');
        setParsedIdentity(null);
        return;
      }

      setParsedIdentity(parsed);
    } catch (err) {
      setParseError('JSON 格式錯誤：' + (err as Error).message);
      setParsedIdentity(null);
    }
  };

  // Load from localStorage button
  const handleLoadFromStorage = () => {
    const saved = localStorage.getItem('aiPortraitGenerator_lastIdentity');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setIdentityJSON(saved);
        setParsedIdentity(parsed);
        setParseError('');
      } catch (err) {
        setParseError('無法載入已儲存的資料');
      }
    } else {
      setParseError('沒有找到已儲存的 identity 資料。請先在 AI 提示詞生成器中生成並儲存。');
    }
  };

  // Get macro specs based on target
  const getMacroSpecs = () => {
    switch (macroTarget) {
      case 'eye': return EYE_MACRO_SPECS;
      case 'skin': return SKIN_MACRO_SPECS;
      case 'lip': return LIP_MACRO_SPECS;
      case 'nose': return NOSE_MACRO_SPECS;
      case 'eyelash': return EYELASH_MACRO_SPECS;
      default: return EYE_MACRO_SPECS;
    }
  };

  const getMacroInstruction = () => {
    switch (macroTarget) {
      case 'eye': return EYE_MACRO_INSTRUCTION;
      case 'skin': return SKIN_MACRO_INSTRUCTION;
      case 'lip': return LIP_MACRO_INSTRUCTION;
      case 'nose': return NOSE_MACRO_INSTRUCTION;
      case 'eyelash': return EYELASH_MACRO_INSTRUCTION;
      default: return EYE_MACRO_INSTRUCTION;
    }
  };

  // Generate macro shot JSON
  const generateMacroShotJSON = (): MacroShotOutput => {
    if (!parsedIdentity || !parsedIdentity.identity) {
      throw new Error('No valid identity data');
    }

    // Extract only the identity part for base_identity
    const identityOnly = {
      identity: parsedIdentity.identity
    };

    const specs = getMacroSpecs();

    return {
      task: `macro ${macroTarget} shot generation`,
      instruction: getMacroInstruction(),
      base_identity: JSON.stringify(identityOnly, null, 2),
      shot_type: MACRO_SHOT_DESCRIPTIONS[shotType],
      macro_target: macroTarget === 'eye' ? 'eye macro close-up'
        : macroTarget === 'skin' ? 'skin texture macro close-up'
        : macroTarget === 'lip' ? 'lip detail macro close-up'
        : macroTarget === 'nose' ? 'nose bridge macro close-up'
        : 'eyelash detail macro close-up',
      macro_specifications: {
        lens: specs.lens,
        aperture: specs.aperture,
        focus_target: specs.focus_target,
        visible_details: specs.visible_details,
        lighting_consideration: specs.lighting_consideration
      },
      target_details: macroTarget === 'eye' ? {
        iris_patterns: true,
        limbal_ring_detail: true,
        individual_eyelashes: true,
        micro_reflections: true,
        natural_moisture: true,
        blood_vessels: true
      } : macroTarget === 'skin' ? {
        individual_pores: true,
        vellus_hair: true,
        skin_texture_variations: true,
        subtle_imperfections: true,
        micro_wrinkles: true,
        skin_tone_gradients: true
      } : macroTarget === 'lip' ? {
        vertical_lip_lines: true,
        color_variations: true,
        natural_moisture: true,
        surface_detail: true,
        natural_sheen: true,
        cupid_bow_detail: true
      } : macroTarget === 'nose' ? {
        pore_detail: true,
        nose_contour_shadows: true,
        fine_hairs: true,
        bone_structure: true,
        bridge_curve: true
      } : { // eyelash
        lash_curve: true,
        lash_spacing: true,
        lash_root_detail: true,
        eyelid_texture: true,
        lash_density: true,
        natural_distribution: true
      },
      depth_of_field: specs.depth_of_field,
      quality_requirements: [
        'Same exact person from identity lock',
        'Hyper-realistic detail',
        'Natural imperfections maintained',
        'Professional macro photography with accurate depth of field and lighting'
      ],
      professional_standards: 'Professional macro photography with accurate depth of field and lighting for extreme close-up work'
    };
  };

  // Handle generate button
  const handleGenerate = () => {
    if (!parsedIdentity || !parsedIdentity.identity) {
      setParseError('請先輸入有效的 identity JSON');
      return;
    }

    try {
      const output = generateMacroShotJSON();
      setGeneratedOutput(JSON.stringify(output, null, 2));
    } catch (err) {
      setParseError('生成失敗：' + (err as Error).message);
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    if (!generatedOutput) {
      alert('請先生成 JSON！');
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedOutput);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      alert('複製失敗，請手動複製');
    }
  };

  // Identity summary for display
  const identitySummary = useMemo(() => {
    if (!parsedIdentity?.identity) return null;

    const id = parsedIdentity.identity;
    const parts: string[] = [];

    if (id.gender) parts.push(`性別: ${id.gender}`);
    if (id.age) parts.push(`年齡: ${id.age}`);
    if (id.ethnicity) parts.push(`種族: ${id.ethnicity}`);
    if (id.eyeColor) parts.push(`眼色: ${id.eyeColor}`);
    if (id.skinTone) parts.push(`膚色: ${id.skinTone}`);

    return parts.join(' | ');
  }, [parsedIdentity]);

  // Get current specs for display
  const currentSpecs = getMacroSpecs();

  // Get target details items for display
  const getTargetDetailItems = () => {
    switch (macroTarget) {
      case 'eye':
        return [
          { key: 'iris_patterns', label: '虹膜紋理' },
          { key: 'limbal_ring_detail', label: '虹膜環細節' },
          { key: 'individual_eyelashes', label: '睫毛細節' },
          { key: 'micro_reflections', label: '微反射' },
          { key: 'natural_moisture', label: '自然濕潤' },
          { key: 'blood_vessels', label: '血管細節' }
        ];
      case 'skin':
        return [
          { key: 'individual_pores', label: '毛孔細節' },
          { key: 'vellus_hair', label: '細毛/桃絨毛' },
          { key: 'skin_texture_variations', label: '皮膚紋理變化' },
          { key: 'subtle_imperfections', label: '微瑕疵' },
          { key: 'micro_wrinkles', label: '微細紋路' },
          { key: 'skin_tone_gradients', label: '膚色漸層' }
        ];
      case 'lip':
        return [
          { key: 'vertical_lip_lines', label: '唇紋可見' },
          { key: 'color_variations', label: '色彩變化' },
          { key: 'natural_moisture', label: '自然濕潤' },
          { key: 'surface_detail', label: '表面細節' },
          { key: 'natural_sheen', label: '光澤感' },
          { key: 'cupid_bow_detail', label: '唇峰細節' }
        ];
      case 'nose':
        return [
          { key: 'pore_detail', label: '毛孔細節' },
          { key: 'nose_contour_shadows', label: '鼻輪廓陰影' },
          { key: 'skin_texture', label: '皮膚紋理' },
          { key: 'fine_hairs', label: '細毛可見' },
          { key: 'bone_structure', label: '骨骼結構' },
          { key: 'bridge_curve', label: '鼻樑曲線' }
        ];
      case 'eyelash':
        return [
          { key: 'lash_curve', label: '睫毛曲線' },
          { key: 'lash_spacing', label: '睫毛間距' },
          { key: 'lash_root_detail', label: '根部細節' },
          { key: 'eyelid_texture', label: '眼皮紋理' },
          { key: 'lash_density', label: '睫毛密度' },
          { key: 'natural_distribution', label: '自然分佈' }
        ];
      default:
        return [];
    }
  };

  const targetDetailItems = getTargetDetailItems();

  return (
    <Layout
      title="Macro 特寫生成器 - 0xShinyui"
      description="根據人物 identity JSON 生成專業微距特寫提示詞，支援 5 種模式"
      canonical="/macro-shot"
    >
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1
              className="text-4xl sm:text-5xl font-bold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              🔍 Macro 特寫生成器
            </h1>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: 'var(--text-muted)' }}
            >
              使用專業微距攝影參數生成極致細節的特寫提示詞，支援 5 種面部特徵模式
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Input */}
            <div className="lg:col-span-2 space-y-6">
              {/* Identity Input Section */}
              <Card padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: 'var(--accent-gold)' }}
                  >
                    📥 Identity 輸入
                  </h2>
                  <button
                    onClick={handleLoadFromStorage}
                    className="py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    🔄 從 AI 生成器載入
                  </button>
                </div>

                <Textarea
                  value={identityJSON}
                  onChange={(e) => handleParseJSON(e.target.value)}
                  placeholder="將 AI 提示詞生成器的 JSON 輸出貼到這裡..."
                  rows={8}
                />

                {parseError && (
                  <div
                    className="mt-3 p-3 rounded-lg text-sm"
                    style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderLeft: '3px solid #ef4444' }}
                  >
                    <p style={{ color: '#ef4444' }}>⚠️ {parseError}</p>
                  </div>
                )}

                {parsedIdentity?.identity && (
                  <div
                    className="mt-3 p-3 rounded-lg text-sm"
                    style={{ backgroundColor: 'rgba(23, 162, 184, 0.1)', borderLeft: '3px solid #17a2b8' }}
                  >
                    <p style={{ color: '#17a2b8' }}>✅ Identity 已載入</p>
                    {identitySummary && (
                      <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
                        {identitySummary}
                      </p>
                    )}
                  </div>
                )}
              </Card>

              {/* Macro Target Selector */}
              <Card padding="lg">
                <h2
                  className="text-xl font-semibold mb-4"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  🎯 Macro 目標
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {(Object.keys(MACRO_TARGET_LABELS) as MacroTargetType[]).map((target) => (
                    <button
                      key={target}
                      onClick={() => setMacroTarget(target)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        macroTarget === target ? '' : 'opacity-60'
                      }`}
                      style={{
                        borderColor: macroTarget === target ? 'var(--accent-gold)' : 'var(--border-color)',
                        backgroundColor: macroTarget === target ? 'rgba(240, 185, 11, 0.1)' : 'var(--card-background)',
                      }}
                    >
                      <div className="text-xl mb-1">{MACRO_TARGET_ICONS[target]}</div>
                      <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                        {MACRO_TARGET_SHORT_LABELS[target]}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-4 p-3 rounded-lg text-sm" style={{ backgroundColor: 'var(--hover-background)' }}>
                  <p style={{ color: 'var(--text-muted)' }}>
                    {macroTarget === 'eye' && '👁️ 眼部特寫：強調虹膜紋理、睫毛、微反射等細節'}
                    {macroTarget === 'skin' && '🧴 皮膚紋理特寫：強調毛孔、細毛、皮膚紋理等真實細節'}
                    {macroTarget === 'lip' && '👄 嘴唇細節特寫：強調唇紋、色彩變化、自然濕潤等細節'}
                    {macroTarget === 'nose' && '👃 鼻樑細節特寫：強調毛孔、陰影、骨骼結構等細節'}
                    {macroTarget === 'eyelash' && '👁️ 睫毛細節特寫：強調睫毛曲線、間距、根部細節等'}
                  </p>
                </div>
              </Card>

              {/* Shot Type Selector */}
              <Card padding="lg">
                <h2
                  className="text-xl font-semibold mb-4"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  🎬 拍攝類型
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(['full-body', 'mid-shot', 'extreme-close-up'] as MacroShotType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setShotType(type)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        shotType === type ? '' : 'opacity-60'
                      }`}
                      style={{
                        borderColor: shotType === type ? 'var(--accent-gold)' : 'var(--border-color)',
                        backgroundColor: shotType === type ? 'rgba(240, 185, 11, 0.1)' : 'var(--card-background)',
                      }}
                    >
                      <div className="text-2xl mb-2">{MACRO_SHOT_ICONS[type]}</div>
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {MACRO_SHOT_LABELS[type]}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-4 p-3 rounded-lg text-sm" style={{ backgroundColor: 'var(--hover-background)' }}>
                  <p style={{ color: 'var(--text-muted)' }}>
                    目前選擇: <span style={{ color: 'var(--accent-gold)' }}>{MACRO_SHOT_DESCRIPTIONS[shotType]}</span>
                  </p>
                </div>
              </Card>

              {/* Macro Parameters Preview */}
              <Card padding="lg">
                <h2
                  className="text-xl font-semibold mb-4"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  🔬 Macro 參數預覽
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--hover-background)' }}>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>鏡頭</div>
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{currentSpecs.lens}</div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--hover-background)' }}>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>光圈</div>
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{currentSpecs.aperture}</div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--hover-background)' }}>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>對焦目標</div>
                    <div className="font-medium" style={{ color: 'var(--text-primary)', fontSize: '13px' }}>{currentSpecs.focus_target}</div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--hover-background)' }}>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>景深</div>
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{currentSpecs.depth_of_field}</div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>可見細節：</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {currentSpecs.visible_details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--accent-gold)' }}>✓</span>
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!parsedIdentity?.identity}
                className="w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                style={{
                  backgroundColor: 'var(--accent-gold)',
                  color: 'var(--background)',
                }}
              >
                🚀 生成 Macro Shot JSON
              </button>
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

                  {/* Target Details Summary */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                      {MACRO_TARGET_SHORT_LABELS[macroTarget]} 參數:
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {targetDetailItems.map((item) => (
                        <div
                          key={item.key}
                          className="flex items-center gap-1 p-2 rounded text-center"
                          style={{ backgroundColor: 'var(--hover-background)' }}
                        >
                          <span style={{ color: '#10b981' }}>✓</span>
                          <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Output JSON */}
                  <div
                    className="p-4 rounded-lg mb-4 overflow-x-auto"
                    style={{
                      backgroundColor: '#0b0e11',
                      maxHeight: '400px',
                      overflowY: 'auto',
                    }}
                  >
                    <pre
                      className="text-xs"
                      style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}
                    >
                      {generatedOutput || '// 點擊「生成 Macro Shot JSON」查看結果...'}
                    </pre>
                  </div>

                  {/* Copy button */}
                  <button
                    onClick={handleCopy}
                    disabled={!generatedOutput}
                    className="w-full py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: copySuccess ? '#17a58a' : '#28a745',
                      color: 'white',
                    }}
                  >
                    {copySuccess ? '✅ 已複製！' : '📋 複製 JSON'}
                  </button>

                  {/* Tips */}
                  <div
                    className="mt-4 p-3 rounded-lg text-sm"
                    style={{
                      backgroundColor: 'var(--hover-background)',
                      borderLeft: '3px solid var(--accent-gold)',
                    }}
                  >
                    <p style={{ color: 'var(--text-muted)' }}>
                      💡 此 JSON 使用專業微距攝影參數（100mm macro lens + f/2.8），{macroTarget === 'eye' ? '適合生成極致細節的眼部特寫' : macroTarget === 'skin' ? '適合生成真實皮膚紋理特寫' : macroTarget === 'lip' ? '適合生成嘴唇細節特寫' : macroTarget === 'nose' ? '適合生成鼻樑細節特寫' : '適合生成睫毛細節特寫'}。
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
              💡 使用說明
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              <li>• 從 AI 提示詞生成器複製 JSON，或使用「儲存 Identity」功能後在此工具中載入</li>
              <li>• 選擇 Macro 目標：眼部、皮膚紋理、嘴唇、鼻樑、睫毛 5 種模式</li>
              <li>• 選擇拍攝類型：全身、半身、極特寫</li>
              <li>• Macro 參數固定為 100mm macro lens + f/2.8 光圈</li>
              <li>• 每種模式都有 6 項特定的細節參數</li>
              <li>• 點擊生成後複製 JSON，可用於 Midjourney、Stable Diffusion 等工具</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
