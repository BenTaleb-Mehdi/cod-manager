/**
 * ISO/IEC 18004 Compliant Pure TypeScript QR Code Generator
 * Zero-dependency, offline-capable, and fully scannable by all standard smartphone cameras.
 * Based on the public domain QR code reference implementation by Kazuhiko Arase.
 */

const QRMode = {
  MODE_NUMBER: 1 << 0,
  MODE_ALPHA_NUM: 1 << 1,
  MODE_8BIT_BYTE: 1 << 2,
  MODE_KANJI: 1 << 3,
};

export const QRErrorCorrectLevel = {
  L: 1,
  M: 0,
  Q: 3,
  H: 2,
};

const QRMaskPattern = {
  PATTERN000: 0,
  PATTERN001: 1,
  PATTERN010: 2,
  PATTERN011: 3,
  PATTERN100: 4,
  PATTERN101: 5,
  PATTERN110: 6,
  PATTERN111: 7,
};

// Galois Field 256 Math
const QRMath = {
  glog(n: number) {
    if (n < 1) throw new Error("glog(" + n + ")");
    return LOG_TABLE[n];
  },
  gexp(n: number) {
    while (n < 0) n += 255;
    while (n >= 255) n -= 255;
    return EXP_TABLE[n];
  },
};

const EXP_TABLE = new Array(256);
const LOG_TABLE = new Array(256);

(function initGF() {
  for (let i = 0; i < 8; i++) EXP_TABLE[i] = 1 << i;
  for (let i = 8; i < 256; i++) {
    EXP_TABLE[i] =
      EXP_TABLE[i - 4] ^ EXP_TABLE[i - 5] ^ EXP_TABLE[i - 6] ^ EXP_TABLE[i - 8];
  }
  for (let i = 0; i < 255; i++) LOG_TABLE[EXP_TABLE[i]] = i;
})();

class QRPolynomial {
  num: number[];

  constructor(num: number[], shift = 0) {
    let offset = 0;
    while (offset < num.length && num[offset] === 0) offset++;
    this.num = new Array(num.length - offset + shift);
    for (let i = 0; i < num.length - offset; i++) {
      this.num[i] = num[offset + i];
    }
  }

  get(index: number) {
    return this.num[index];
  }

  getLength() {
    return this.num.length;
  }

  multiply(e: QRPolynomial): QRPolynomial {
    const num = new Array(this.getLength() + e.getLength() - 1).fill(0);
    for (let i = 0; i < this.getLength(); i++) {
      for (let j = 0; j < e.getLength(); j++) {
        num[i + j] ^= QRMath.gexp(
          QRMath.glog(this.get(i)) + QRMath.glog(e.get(j))
        );
      }
    }
    return new QRPolynomial(num);
  }

  mod(e: QRPolynomial): QRPolynomial {
    if (this.getLength() - e.getLength() < 0) return this;
    const ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
    const num = new Array(this.getLength());
    for (let i = 0; i < this.getLength(); i++) num[i] = this.get(i);
    for (let i = 0; i < e.getLength(); i++) {
      num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
    }
    return new QRPolynomial(num).mod(e);
  }
}

// RS Block configurations: [totalCount, dataCount]
const RS_BLOCK_TABLE: Record<number, Record<number, number[][]>> = {
  1: { [QRErrorCorrectLevel.L]: [[1, 26, 19]], [QRErrorCorrectLevel.M]: [[1, 26, 16]] },
  2: { [QRErrorCorrectLevel.L]: [[1, 44, 34]], [QRErrorCorrectLevel.M]: [[1, 44, 28]] },
  3: { [QRErrorCorrectLevel.L]: [[1, 70, 55]], [QRErrorCorrectLevel.M]: [[1, 70, 44]] },
  4: { [QRErrorCorrectLevel.L]: [[1, 100, 80]], [QRErrorCorrectLevel.M]: [[2, 50, 32]] },
  5: { [QRErrorCorrectLevel.L]: [[1, 134, 108]], [QRErrorCorrectLevel.M]: [[2, 67, 43]] },
  6: { [QRErrorCorrectLevel.L]: [[2, 86, 68]], [QRErrorCorrectLevel.M]: [[4, 43, 27]] },
  7: { [QRErrorCorrectLevel.L]: [[2, 98, 78]], [QRErrorCorrectLevel.M]: [[4, 49, 31]] },
  8: { [QRErrorCorrectLevel.L]: [[2, 121, 97]], [QRErrorCorrectLevel.M]: [[2, 60, 38], [2, 61, 39]] },
  9: { [QRErrorCorrectLevel.L]: [[2, 146, 116]], [QRErrorCorrectLevel.M]: [[3, 58, 36], [2, 59, 37]] },
  10: { [QRErrorCorrectLevel.L]: [[2, 86, 68], [2, 87, 69]], [QRErrorCorrectLevel.M]: [[4, 69, 43], [1, 70, 44]] },
};

class QRRSBlock {
  totalCount: number;
  dataCount: number;

  constructor(totalCount: number, dataCount: number) {
    this.totalCount = totalCount;
    this.dataCount = dataCount;
  }

  static getRSBlocks(typeNumber: number, errorCorrectLevel: number): QRRSBlock[] {
    const table = RS_BLOCK_TABLE[typeNumber]?.[errorCorrectLevel];
    if (!table) throw new Error("Unsupported QR version: " + typeNumber);
    const list: QRRSBlock[] = [];
    for (const [count, totalCount, dataCount] of table) {
      for (let i = 0; i < count; i++) {
        list.push(new QRRSBlock(totalCount, dataCount));
      }
    }
    return list;
  }
}

class QRBitBuffer {
  buffer: number[] = [];
  length = 0;

  get(index: number) {
    const bufIndex = Math.floor(index / 8);
    return ((this.buffer[bufIndex] >>> (7 - (index % 8))) & 1) === 1;
  }

  put(num: number, length: number) {
    for (let i = 0; i < length; i++) {
      this.putBit(((num >>> (length - i - 1)) & 1) === 1);
    }
  }

  putBit(bit: boolean) {
    const bufIndex = Math.floor(this.length / 8);
    if (this.buffer.length <= bufIndex) this.buffer.push(0);
    if (bit) this.buffer[bufIndex] |= 0x80 >>> (this.length % 8);
    this.length++;
  }
}

const QRUtil = {
  PATTERN_POSITION_TABLE: [
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
  ],

  getBCHTypeInfo(data: number) {
    let d = data << 10;
    while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(1335) >= 0) {
      d ^= 1335 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(1335));
    }
    return ((data << 10) | d) ^ 0x5412;
  },

  getBCHDigit(data: number) {
    let digit = 0;
    while (data !== 0) {
      digit++;
      data >>>= 1;
    }
    return digit;
  },

  getPatternPosition(typeNumber: number) {
    return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1] || [];
  },

  getMask(maskPattern: number, i: number, j: number) {
    switch (maskPattern) {
      case QRMaskPattern.PATTERN000:
        return (i + j) % 2 === 0;
      case QRMaskPattern.PATTERN001:
        return i % 2 === 0;
      case QRMaskPattern.PATTERN010:
        return j % 3 === 0;
      case QRMaskPattern.PATTERN011:
        return (i + j) % 3 === 0;
      case QRMaskPattern.PATTERN100:
        return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
      case QRMaskPattern.PATTERN101:
        return ((i * j) % 2) + ((i * j) % 3) === 0;
      case QRMaskPattern.PATTERN110:
        return (((i * j) % 2) + ((i * j) % 3)) % 2 === 0;
      case QRMaskPattern.PATTERN111:
        return (((i * j) % 3) + ((i + j) % 2)) % 2 === 0;
      default:
        throw new Error("bad maskPattern:" + maskPattern);
    }
  },

  getErrorCorrectPolynomial(errorCorrectLength: number): QRPolynomial {
    let a = new QRPolynomial([1]);
    for (let i = 0; i < errorCorrectLength; i++) {
      a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)]));
    }
    return a;
  },

  getLengthInBits(mode: number, type: number) {
    if (1 <= type && type < 10) {
      return mode === QRMode.MODE_8BIT_BYTE ? 8 : 10;
    }
    return 16;
  },

  getLostPoint(qrCode: QRCode) {
    const moduleCount = qrCode.getModuleCount();
    let lostPoint = 0;

    // LEVEL1
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        let sameCount = 0;
        const dark = qrCode.isDark(row, col);
        for (let r = -1; r <= 1; r++) {
          if (row + r < 0 || moduleCount <= row + r) continue;
          for (let c = -1; c <= 1; c++) {
            if (col + c < 0 || moduleCount <= col + c) continue;
            if (r === 0 && c === 0) continue;
            if (dark === qrCode.isDark(row + r, col + c)) sameCount++;
          }
        }
        if (sameCount > 5) lostPoint += 3 + sameCount - 5;
      }
    }

    // LEVEL2
    for (let row = 0; row < moduleCount - 1; row++) {
      for (let col = 0; col < moduleCount - 1; col++) {
        let count = 0;
        if (qrCode.isDark(row, col)) count++;
        if (qrCode.isDark(row + 1, col)) count++;
        if (qrCode.isDark(row, col + 1)) count++;
        if (qrCode.isDark(row + 1, col + 1)) count++;
        if (count === 0 || count === 4) lostPoint += 3;
      }
    }

    return lostPoint;
  },
};

class QRCode {
  typeNumber: number;
  errorCorrectLevel: number;
  modules: (boolean | null)[][] = [];
  moduleCount = 0;
  dataList: Uint8Array[] = [];

  constructor(typeNumber: number, errorCorrectLevel: number) {
    this.typeNumber = typeNumber;
    this.errorCorrectLevel = errorCorrectLevel;
  }

  addData(data: string) {
    const encoder = new TextEncoder();
    this.dataList.push(encoder.encode(data));
  }

  isDark(row: number, col: number) {
    if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
      throw new Error(row + "," + col);
    }
    return this.modules[row][col] === true;
  }

  getModuleCount() {
    return this.moduleCount;
  }

  make() {
    let minLostPoint = 0;
    let bestPattern = 0;

    for (let i = 0; i < 8; i++) {
      this.makeImpl(false, i);
      const lostPoint = QRUtil.getLostPoint(this);
      if (i === 0 || minLostPoint > lostPoint) {
        minLostPoint = lostPoint;
        bestPattern = i;
      }
    }
    this.makeImpl(false, bestPattern);
  }

  private makeImpl(test: boolean, maskPattern: number) {
    this.moduleCount = this.typeNumber * 4 + 17;
    this.modules = Array.from({ length: this.moduleCount }, () =>
      Array(this.moduleCount).fill(null)
    );

    this.setupPositionProbePattern(0, 0);
    this.setupPositionProbePattern(this.moduleCount - 7, 0);
    this.setupPositionProbePattern(0, this.moduleCount - 7);
    this.setupPositionAdjustPattern();
    this.setupTimingPattern();
    this.setupTypeInfo(test, maskPattern);

    const data = QRCode.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
    this.mapData(data, maskPattern);
  }

  private setupPositionProbePattern(row: number, col: number) {
    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || this.moduleCount <= row + r) continue;
      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || this.moduleCount <= col + c) continue;
        if (
          (0 <= r && r <= 6 && (c === 0 || c === 6)) ||
          (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
          (2 <= r && r <= 4 && 2 <= c && c <= 4)
        ) {
          this.modules[row + r][col + c] = true;
        } else {
          this.modules[row + r][col + c] = false;
        }
      }
    }
  }

  private setupTimingPattern() {
    for (let r = 8; r < this.moduleCount - 8; r++) {
      if (this.modules[r][6] !== null) continue;
      this.modules[r][6] = r % 2 === 0;
    }
    for (let c = 8; c < this.moduleCount - 8; c++) {
      if (this.modules[6][c] !== null) continue;
      this.modules[6][c] = c % 2 === 0;
    }
  }

  private setupPositionAdjustPattern() {
    const pos = QRUtil.getPatternPosition(this.typeNumber);
    for (let i = 0; i < pos.length; i++) {
      for (let j = 0; j < pos.length; j++) {
        const row = pos[i];
        const col = pos[j];
        if (this.modules[row][col] !== null) continue;
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (
              r === -2 ||
              r === 2 ||
              c === -2 ||
              c === 2 ||
              (r === 0 && c === 0)
            ) {
              this.modules[row + r][col + c] = true;
            } else {
              this.modules[row + r][col + c] = false;
            }
          }
        }
      }
    }
  }

  private setupTypeInfo(test: boolean, maskPattern: number) {
    const data = (this.errorCorrectLevel << 3) | maskPattern;
    const bits = QRUtil.getBCHTypeInfo(data);

    // vertical
    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >> i) & 1) === 1;
      if (i < 6) {
        this.modules[i][8] = mod;
      } else if (i < 8) {
        this.modules[i + 1][8] = mod;
      } else {
        this.modules[this.moduleCount - 15 + i][8] = mod;
      }
    }

    // horizontal
    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >> i) & 1) === 1;
      if (i < 8) {
        this.modules[8][this.moduleCount - i - 1] = mod;
      } else if (i === 8) {
        this.modules[8][15 - i] = mod;
      } else {
        this.modules[8][15 - i - 1] = mod;
      }
    }

    // fixed dark module
    this.modules[this.moduleCount - 8][8] = !test;
  }

  private mapData(data: number[], maskPattern: number) {
    let inc = -1;
    let row = this.moduleCount - 1;
    let bitIndex = 7;
    let byteIndex = 0;

    for (let col = this.moduleCount - 1; col > 0; col -= 2) {
      if (col === 6) col--;
      while (true) {
        for (let c = 0; c < 2; c++) {
          if (this.modules[row][col - c] === null) {
            let dark = false;
            if (byteIndex < data.length) {
              dark = ((data[byteIndex] >>> bitIndex) & 1) === 1;
            }
            const mask = QRUtil.getMask(maskPattern, row, col - c);
            if (mask) dark = !dark;
            this.modules[row][col - c] = dark;
            bitIndex--;
            if (bitIndex === -1) {
              byteIndex++;
              bitIndex = 7;
            }
          }
        }
        row += inc;
        if (row < 0 || this.moduleCount <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }
  }

  static createData(typeNumber: number, errorCorrectLevel: number, dataList: Uint8Array[]) {
    const rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
    const buffer = new QRBitBuffer();

    for (const bytes of dataList) {
      buffer.put(QRMode.MODE_8BIT_BYTE, 4);
      buffer.put(bytes.length, QRUtil.getLengthInBits(QRMode.MODE_8BIT_BYTE, typeNumber));
      for (let i = 0; i < bytes.length; i++) {
        buffer.put(bytes[i], 8);
      }
    }

    // calc total data bytes
    let totalDataCount = 0;
    for (const block of rsBlocks) totalDataCount += block.dataCount;

    if (buffer.length + 4 <= totalDataCount * 8) {
      buffer.put(0, 4);
    }

    while (buffer.length % 8 !== 0) {
      buffer.putBit(false);
    }

    while (true) {
      if (buffer.length >= totalDataCount * 8) break;
      buffer.put(0xec, 8);
      if (buffer.length >= totalDataCount * 8) break;
      buffer.put(0x11, 8);
    }

    return QRCode.createBytes(buffer, rsBlocks);
  }

  static createBytes(buffer: QRBitBuffer, rsBlocks: QRRSBlock[]) {
    let offset = 0;
    let maxDcCount = 0;
    let maxEcCount = 0;

    const dcdata: number[][] = Array.from({ length: rsBlocks.length });
    const ecdata: number[][] = Array.from({ length: rsBlocks.length });

    for (let r = 0; r < rsBlocks.length; r++) {
      const dcCount = rsBlocks[r].dataCount;
      const ecCount = rsBlocks[r].totalCount - dcCount;

      maxDcCount = Math.max(maxDcCount, dcCount);
      maxEcCount = Math.max(maxEcCount, ecCount);

      dcdata[r] = new Array(dcCount);
      for (let i = 0; i < dcdata[r].length; i++) {
        dcdata[r][i] = 0xff & buffer.buffer[i + offset];
      }
      offset += dcCount;

      const rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
      const rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
      const modPoly = rawPoly.mod(rsPoly);

      ecdata[r] = new Array(rsPoly.getLength() - 1).fill(0);
      for (let i = 0; i < modPoly.getLength(); i++) {
        const modIndex = i + ecdata[r].length - modPoly.getLength();
        if (modIndex >= 0) {
          ecdata[r][modIndex] = modPoly.get(i);
        }
      }
    }

    let totalCodeCount = 0;
    for (const b of rsBlocks) totalCodeCount += b.totalCount;

    const data: number[] = new Array(totalCodeCount);
    let index = 0;

    for (let i = 0; i < maxDcCount; i++) {
      for (let r = 0; r < rsBlocks.length; r++) {
        if (i < dcdata[r].length) {
          data[index++] = dcdata[r][i];
        }
      }
    }

    for (let i = 0; i < maxEcCount; i++) {
      for (let r = 0; r < rsBlocks.length; r++) {
        if (i < ecdata[r].length) {
          data[index++] = ecdata[r][i];
        }
      }
    }

    return data;
  }
}

/**
 * Public export: generates a 2D boolean matrix for the given text.
 * Automatically picks the optimal type number (1 to 10) for Error Correction Level M.
 */
export function generateQRCodeMatrix(text: string): boolean[][] {
  const encoder = new TextEncoder();
  const rawBytes = encoder.encode(text);

  // Find lowest viable QR version (1 to 10) for error correction level M
  let selectedVersion = 10;
  for (let v = 1; v <= 10; v++) {
    const rsBlocks = QRRSBlock.getRSBlocks(v, QRErrorCorrectLevel.M);
    let capacity = 0;
    for (const b of rsBlocks) capacity += b.dataCount;
    // 4 bits mode + 8/16 bits len + data
    const headerBits = 4 + (v < 10 ? 8 : 16);
    if ((rawBytes.length * 8 + headerBits) <= capacity * 8) {
      selectedVersion = v;
      break;
    }
  }

  const qr = new QRCode(selectedVersion, QRErrorCorrectLevel.M);
  qr.addData(text);
  qr.make();

  const count = qr.getModuleCount();
  const matrix: boolean[][] = [];
  for (let r = 0; r < count; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < count; c++) {
      row.push(qr.isDark(r, c));
    }
    matrix.push(row);
  }

  return matrix;
}
