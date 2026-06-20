import pako from 'pako';

const MAGIC_HEADER = [0x42, 0x50, 0x43];
const FORMAT_VERSION = 1;
const FILE_EXTENSION = '.bpc';
const MIME_TYPE = 'application/x-bird-blind-config';

const stringToUint8Array = (str) => {
  return new TextEncoder().encode(str);
};

const uint8ArrayToString = (bytes) => {
  return new TextDecoder().decode(bytes);
};

const concatUint8Arrays = (arrays) => {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
};

export const serializeConfig = (config) => {
  const payload = {
    v: FORMAT_VERSION,
    t: Date.now(),
    type: 'blind-config',
    data: config
  };
  const jsonStr = JSON.stringify(payload);
  const compressed = pako.gzip(stringToUint8Array(jsonStr));
  const header = new Uint8Array([...MAGIC_HEADER, FORMAT_VERSION]);
  return concatUint8Arrays([header, compressed]);
};

export const deserializeConfig = (buffer) => {
  const bytes = new Uint8Array(buffer);

  if (bytes.length < 4) {
    throw new Error('文件损坏：文件太小');
  }

  if (bytes[0] !== MAGIC_HEADER[0] || bytes[1] !== MAGIC_HEADER[1] || bytes[2] !== MAGIC_HEADER[2]) {
    throw new Error('文件格式错误：不是有效的 BPC 配置文件');
  }

  const version = bytes[3];
  if (version > FORMAT_VERSION) {
    throw new Error(`文件版本过高 (v${version})，请升级系统后再尝试`);
  }

  const compressedData = bytes.slice(4);
  let jsonStr;

  try {
    const decompressed = pako.ungzip(compressedData);
    jsonStr = uint8ArrayToString(decompressed);
  } catch (e) {
    throw new Error('文件解压失败：文件可能已损坏');
  }

  let payload;
  try {
    payload = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error('配置解析失败：JSON 格式无效');
  }

  if (payload.type !== 'blind-config') {
    throw new Error('文件类型不匹配');
  }

  return {
    version: payload.v,
    timestamp: payload.t,
    data: payload.data
  };
};

export const downloadConfigFile = (config, filename) => {
  const bytes = serializeConfig(config);
  const blob = new Blob([bytes], { type: MIME_TYPE });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `blind-config_${formatDate(new Date())}${FILE_EXTENSION}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const readConfigFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('请选择文件'));
      return;
    }

    const name = file.name.toLowerCase();
    if (!name.endsWith(FILE_EXTENSION) && !name.endsWith('.json')) {
      reject(new Error('文件格式不支持，请选择 .bpc 或 .json 配置文件'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        if (name.endsWith('.json')) {
          const jsonStr = e.target.result;
          const data = JSON.parse(jsonStr);
          resolve({
            version: FORMAT_VERSION,
            timestamp: Date.now(),
            data: data
          });
        } else {
          const buffer = e.target.result;
          const result = deserializeConfig(buffer);
          resolve(result);
        }
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };

    if (name.endsWith('.json')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
};

export const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
};

export const validateConfigData = (data) => {
  const errors = [];
  const warnings = [];

  if (!data || typeof data !== 'object') {
    errors.push('配置数据不是有效的对象');
    return { valid: false, errors, warnings };
  }

  if (!data.name || typeof data.name !== 'string') {
    errors.push('缺少机位名称 (name)');
  }

  if (!data.code || typeof data.code !== 'string') {
    warnings.push('缺少机位编号 (code)，将使用默认值');
  }

  if (!Array.isArray(data.timeSlots) || data.timeSlots.length === 0) {
    errors.push('时段配置为空或无效');
  } else {
    data.timeSlots.forEach((slot, idx) => {
      if (!slot.id) {
        warnings.push(`时段 ${idx + 1} 缺少 id，将自动生成`);
      }
      if (!slot.label) {
        warnings.push(`时段 ${idx + 1} 缺少标签`);
      }
      if (typeof slot.price !== 'number') {
        warnings.push(`时段 ${idx + 1} 价格无效`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

export const migrateConfig = (data, version) => {
  let result = { ...data };

  if (version <= 1) {
    if (!result.type) result.type = 'WATERFOWL';
    if (!result.minLevel) result.minLevel = 'BASIC';
    if (!result.slotMode) result.slotMode = 'CUSTOM';
    if (!result.basePrice) result.basePrice = 0;
    if (!result.autoPrice) result.autoPrice = false;
    if (!result.location) result.location = '';
    if (!result.features) result.features = [];
    if (!result.timeSlots) result.timeSlots = [];
    
    result.timeSlots = result.timeSlots.map((slot, idx) => ({
      id: slot.id || `t${idx + 1}`,
      label: slot.label || `时段${idx + 1}`,
      start: slot.start || '00:00',
      end: slot.end || '00:00',
      price: typeof slot.price === 'number' ? slot.price : 0
    }));
  }

  return result;
};

export default {
  serializeConfig,
  deserializeConfig,
  downloadConfigFile,
  readConfigFile,
  validateConfigData,
  migrateConfig,
  formatDate,
  FILE_EXTENSION,
  FORMAT_VERSION
};
