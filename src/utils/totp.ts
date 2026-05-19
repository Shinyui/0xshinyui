/**
 * TOTP (Time-based One-Time Password) 工具函數
 */

import crypto from 'crypto';

/**
 * Base32 解碼
 * @param encoded - Base32 編碼字串
 * @returns Buffer
 */
export function base32Decode(encoded: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  const output: number[] = [];

  for (let i = 0; i < encoded.length; i++) {
    const char = encoded[i].toUpperCase();
    if (char === '=') break;

    const index = alphabet.indexOf(char);
    if (index === -1) continue;

    value = (value << 5) | index;
    bits += 5;

    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(output);
}

/**
 * 生成 TOTP 驗證碼
 * @param secret - Base32 格式的密鑰
 * @param timeStep - 時間步長（秒），預設 30
 * @returns 6 位數驗證碼或 '錯誤'
 */
export function generateTOTP(secret: string, timeStep: number = 30): string {
  try {
    // 移除空格和轉換為大寫
    const cleanSecret = secret.replace(/\s/g, '').toUpperCase();

    // Base32 解碼
    const key = base32Decode(cleanSecret);

    // 計算時間步數
    const time = Math.floor(Date.now() / 1000 / timeStep);
    const timeBuffer = Buffer.alloc(8);
    timeBuffer.writeUInt32BE(0, 0);
    timeBuffer.writeUInt32BE(time, 4);

    // HMAC-SHA1
    const hmac = crypto.createHmac('sha1', key);
    hmac.update(timeBuffer);
    const hash = hmac.digest();

    // 動態截取
    const offset = hash[hash.length - 1] & 0xf;
    const code =
      (((hash[offset] & 0x7f) << 24) |
        ((hash[offset + 1] & 0xff) << 16) |
        ((hash[offset + 2] & 0xff) << 8) |
        (hash[offset + 3] & 0xff)) %
      1000000;

    return code.toString().padStart(6, '0');
  } catch {
    return '錯誤';
  }
}

/**
 * 驗證 TOTP 密鑰格式是否有效
 * @param secret - 待驗證的密鑰
 * @returns 是否有效
 */
export function validateTOTPSecret(secret: string): boolean {
  if (!secret || secret.trim().length === 0) {
    return false;
  }

  const cleanSecret = secret.replace(/\s/g, '').toUpperCase();
  const base32Regex = /^[A-Z2-7]+=*$/;

  return base32Regex.test(cleanSecret);
}

/**
 * 計算當前時間步長的剩餘秒數
 * @param timeStep - 時間步長（秒），預設 30
 * @returns 剩餘秒數
 */
export function getRemainingSeconds(timeStep: number = 30): number {
  const now = Math.floor(Date.now() / 1000);
  return timeStep - (now % timeStep);
}
