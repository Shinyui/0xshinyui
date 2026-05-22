/**
 * 分類工具函數
 */

// 分類映射表 - 統一管理所有分類顯示名稱
const CATEGORY_MAP: Record<string, string> = {
  all: "全部文章",
  pm: "產品管理",
  opt: "運營",
  dev: "技術",
  edtech: "線上教育",
  iGaming: "博弈產業",
  adult: "成人產業",
  trading: "交易",
  other: "其他",
};

/**
 * 將分類 ID 轉換為顯示名稱
 * @param category - 分類 ID（如 'pm'）
 * @returns 顯示名稱（如 '產品管理'）
 */
export function getCategoryDisplayName(category: string): string {
  return CATEGORY_MAP[category] || category;
}

/**
 * 分類排序函數（'other' 永遠在最後，其餘按字母順序）
 * @param categories - 分類列表
 * @returns 排序後的分類列表
 */
export function sortCategories(categories: string[]): string[] {
  return [...categories].sort((a, b) => {
    if (a === "other") return 1;
    if (b === "other") return -1;
    return a.localeCompare(b);
  });
}

/**
 * 獲取所有可用的分類列表
 * @returns 所有分類的 ID 列表
 */
export function getAllCategoryIds(): string[] {
  return Object.keys(CATEGORY_MAP);
}

/**
 * 驗證分類是否有效
 * @param category - 分類 ID
 * @returns 是否為有效分類
 */
export function isValidCategory(category: string): boolean {
  return category in CATEGORY_MAP;
}
