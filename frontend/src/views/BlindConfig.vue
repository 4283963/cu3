<template>
  <div class="blind-config-page page-container">
    <div class="page-header">
      <h2><el-icon><Setting /></el-icon>掩体机位配置</h2>
      <p class="page-desc">配置机位参数与时段方案，实时预览配置效果</p>
    </div>

    <el-row :gutter="24">
      <el-col :span="12">
        <el-card shadow="hover" class="config-card">
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon"><Edit /></el-icon>
              <span>配置参数</span>
              <el-tag type="primary" size="small" effect="plain">联动模式</el-tag>
            </div>
          </template>

          <el-form :model="form" label-width="120px">
            <el-form-item label="机位编号">
              <el-input v-model="form.code" placeholder="如：KINGFISHER" />
            </el-form-item>

            <el-form-item label="机位名称">
              <el-input v-model="form.name" placeholder="如：翠鸟专属掩体" />
            </el-form-item>

            <el-form-item label="机位类型">
              <el-radio-group v-model="form.type">
                <el-radio value="WATERFOWL">水禽观测</el-radio>
                <el-radio value="RAPTOR">猛禽拍摄</el-radio>
                <el-radio value="FOREST">林鸟栖息</el-radio>
                <el-radio value="VIP">VIP专属</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="最低会员等级">
              <el-select v-model="form.minLevel" placeholder="选择可预约的最低等级">
                <el-option label="游客" value="GUEST" />
                <el-option label="基础会员" value="BASIC" />
                <el-option label="专业会员" value="PRO" />
                <el-option label="VIP会员" value="VIP" />
              </el-select>
            </el-form-item>

            <el-form-item label="时段方案">
              <el-radio-group v-model="form.slotMode" @change="handleSlotModeChange">
                <el-radio value="STANDARD">标准4时段</el-radio>
                <el-radio value="COMPACT">紧凑3时段</el-radio>
                <el-radio value="FULLDAY">全日场</el-radio>
                <el-radio value="CUSTOM">自定义</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="时段列表" v-if="form.slotMode === 'CUSTOM'">
              <div class="slot-editor">
                <div
                  v-for="(slot, index) in form.timeSlots"
                  :key="slot.id"
                  class="slot-edit-row"
                >
                  <el-input
                    v-model="slot.label"
                    placeholder="时段名称"
                    style="width: 180px; margin-right: 8px;"
                  />
                  <el-input-number
                    v-model="slot.price"
                    :min="0"
                    :step="10"
                    controls-position="right"
                    style="width: 120px; margin-right: 8px;"
                  />
                  <el-button
                    type="danger"
                    link
                    size="small"
                    :disabled="form.timeSlots.length <= 1"
                    @click="removeSlot(index)"
                  >
                    删除
                  </el-button>
                </div>
                <el-button type="primary" link size="small" @click="addSlot">
                  <el-icon><Plus /></el-icon>添加时段
                </el-button>
              </div>
            </el-form-item>

            <el-form-item label="基础单价">
              <el-input-number
                v-model="form.basePrice"
                :min="0"
                :step="50"
                controls-position="right"
              />
              <span style="margin-left: 12px; color: #909399; font-size: 13px;">
                （元/时段，联动调整时段价格）
              </span>
            </el-form-item>

            <el-form-item label="自动联动价格">
              <el-switch v-model="form.autoPrice" @change="handleAutoPriceChange" />
              <span style="margin-left: 12px; color: #909399; font-size: 13px;">
                开启后，基础单价变化将自动同步到各时段
              </span>
            </el-form-item>

            <el-form-item label="位置描述">
              <el-input v-model="form.location" placeholder="如：A区-1号点位" />
            </el-form-item>

            <el-form-item label="机位特色">
              <el-select
                v-model="form.features"
                multiple
                filterable
                allow-create
                placeholder="输入后回车添加"
                style="width: 100%"
              >
                <el-option label="单向透视玻璃" value="单向透视玻璃" />
                <el-option label="专业三脚架位" value="专业三脚架位" />
                <el-option label="自动喂食器" value="自动喂食器" />
                <el-option label="360度全景视野" value="360度全景视野" />
                <el-option label="远程控制系统" value="远程控制系统" />
                <el-option label="专业灯光设备" value="专业灯光设备" />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleSave">
                <el-icon><Check /></el-icon>保存配置
              </el-button>
              <el-button type="success" @click="handleExport">
                <el-icon><Download /></el-icon>导出配置
              </el-button>
              <el-button type="warning" @click="handleImportClick">
                <el-icon><Upload /></el-icon>导入配置
              </el-button>
              <el-button @click="handleReset">
                <el-icon><Refresh /></el-icon>重置
              </el-button>
              <input
                ref="fileInputRef"
                type="file"
                accept=".bpc,.json"
                style="display: none;"
                @change="handleFileChange"
              />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="hover" class="preview-card">
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon success"><View /></el-icon>
              <span>实时预览</span>
              <el-switch
                v-model="showPreview"
                active-text="预览开启"
                inactive-text="预览关闭"
              />
            </div>
          </template>

          <div v-if="showPreview" class="preview-content">
            <div class="preview-blind">
              <div class="preview-image-placeholder">
                <el-icon><Picture /></el-icon>
                <span>机位图（预览）</span>
              </div>
              <div class="preview-info">
                <div class="preview-title">
                  <h3>{{ previewConfig.name || '未命名机位' }}</h3>
                  <el-tag :type="getLevelTagType(previewConfig.minLevel)" size="small">
                    {{ getLevelName(previewConfig.minLevel) }}+
                  </el-tag>
                </div>
                <div class="preview-meta">
                  <el-icon><Location /></el-icon>
                  <span>{{ previewConfig.location || '未设置位置' }}</span>
                </div>
                <div class="preview-features" v-if="previewConfig.features.length">
                  <el-tag
                    v-for="(f, i) in previewConfig.features"
                    :key="i"
                    type="info"
                    size="small"
                    effect="plain"
                  >
                    {{ f }}
                  </el-tag>
                </div>
              </div>
            </div>

            <el-divider content-position="left">
              <span class="divider-text">
                <el-icon><Clock /></el-icon>可预约时段（{{ previewConfig.timeSlots.length }}个）
              </span>
            </el-divider>

            <div class="preview-time-slots">
              <div
                v-for="slot in previewConfig.timeSlots"
                :key="slot.id"
                class="preview-slot"
              >
                <div class="slot-label">{{ slot.label }}</div>
                <div class="slot-price">¥{{ slot.price }}</div>
                <el-tag type="success" size="small">可预约</el-tag>
              </div>
              <el-empty
                v-if="previewConfig.timeSlots.length === 0"
                description="暂无时段配置"
                :image-size="60"
              />
            </div>

            <el-divider content-position="left">
              <span class="divider-text">
                <el-icon><DataLine /></el-icon>联动统计
              </span>
            </el-divider>

            <el-row :gutter="12" class="preview-stats">
              <el-col :span="8">
                <el-statistic title="时段总数" :value="previewConfig.timeSlots.length" />
              </el-col>
              <el-col :span="8">
                <el-statistic title="最低单价" :value="minSlotPrice" prefix="¥" />
              </el-col>
              <el-col :span="8">
                <el-statistic title="最高单价" :value="maxSlotPrice" prefix="¥" />
              </el-col>
            </el-row>

            <el-divider content-position="left">
              <span class="divider-text">
                <el-icon><Document /></el-icon>生成的 JSON 配置
              </span>
            </el-divider>

            <pre class="json-preview">{{ generatedJson }}</pre>
          </div>

          <el-empty
            v-else
            description="开启预览开关以查看配置效果"
            :image-size="100"
          />
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      v-model="importDialogVisible"
      title="导入配置文件"
      width="520px"
      :close-on-click-modal="false"
      @closed="resetImportState"
    >
      <div v-if="importLoading" class="import-loading">
        <el-icon class="loading-icon"><Loading /></el-icon>
        <p>正在解析配置文件...</p>
      </div>

      <div v-else-if="importResult" class="import-result">
        <el-result
          :icon="importResult.valid ? 'success' : 'error'"
          :title="importResult.valid ? '配置解析成功' : '配置解析失败'"
          :sub-title="importResult.valid ? '确认以下配置信息后点击导入' : importResult.errors?.[0]"
        >
          <template v-if="importResult.valid" #extra>
            <div class="import-preview">
              <el-descriptions :column="1" border size="small">
                <el-descriptions-item label="机位名称">
                  {{ importData.name || '未命名' }}
                </el-descriptions-item>
                <el-descriptions-item label="机位编号">
                  {{ importData.code || '-' }}
                </el-descriptions-item>
                <el-descriptions-item label="最低会员等级">
                  <el-tag :type="getLevelTagType(importData.minLevel)" size="small">
                    {{ getLevelName(importData.minLevel) }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="时段数量">
                  {{ importData.timeSlots?.length || 0 }} 个
                </el-descriptions-item>
                <el-descriptions-item label="文件版本">
                  v{{ importMeta.version }}
                </el-descriptions-item>
                <el-descriptions-item label="导出时间">
                  {{ formatTimestamp(importMeta.timestamp) }}
                </el-descriptions-item>
              </el-descriptions>

              <div v-if="importResult.warnings?.length" class="import-warnings">
                <el-alert
                  :title="`有 ${importResult.warnings.length} 条警告`"
                  type="warning"
                  :closable="false"
                  show-icon
                >
                  <template #default>
                    <ul>
                      <li v-for="(w, i) in importResult.warnings" :key="i">
                        {{ w }}
                      </li>
                    </ul>
                  </template>
                </el-alert>
              </div>
            </div>
          </template>
        </el-result>
      </div>

      <div v-else class="import-tip">
        <el-icon class="tip-icon"><Upload /></el-icon>
        <p>支持 <strong>.bpc</strong> 专用配置文件和 <strong>.json</strong> 格式</p>
        <p class="tip-sub">选择文件后将自动解析并预览配置内容</p>
      </div>

      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button
          v-if="importResult?.valid"
          type="primary"
          @click="confirmImport"
        >
          确认导入
        </el-button>
        <el-button
          v-else
          type="primary"
          @click="handleImportClick"
        >
          选择文件
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  downloadConfigFile,
  readConfigFile,
  validateConfigData,
  migrateConfig
} from '@/utils/blindConfig';

const defaultSlotsByMode = {
  STANDARD: [
    { id: 't1', label: '早场 06:00-09:00', start: '06:00', end: '09:00', price: 200 },
    { id: 't2', label: '上午场 09:00-12:00', start: '09:00', end: '12:00', price: 180 },
    { id: 't3', label: '下午场 14:00-17:00', start: '14:00', end: '17:00', price: 180 },
    { id: 't4', label: '晚场 17:00-20:00', start: '17:00', end: '20:00', price: 220 }
  ],
  COMPACT: [
    { id: 't1', label: '上午 08:00-12:00', start: '08:00', end: '12:00', price: 300 },
    { id: 't2', label: '下午 13:00-17:00', start: '13:00', end: '17:00', price: 300 },
    { id: 't3', label: '黄昏 17:00-20:00', start: '17:00', end: '20:00', price: 350 }
  ],
  FULLDAY: [
    { id: 't1', label: '全日场 06:00-18:00', start: '06:00', end: '18:00', price: 800 }
  ],
  CUSTOM: [
    { id: 't1', label: '自定义时段', start: '00:00', end: '00:00', price: 100 }
  ]
};

const createDefaultForm = () => ({
  code: '',
  name: '',
  type: 'WATERFOWL',
  minLevel: 'BASIC',
  slotMode: 'STANDARD',
  basePrice: 200,
  autoPrice: true,
  location: '',
  features: [],
  timeSlots: JSON.parse(JSON.stringify(defaultSlotsByMode.STANDARD))
});

const form = reactive(createDefaultForm());
const showPreview = ref(true);

const levelMap = {
  GUEST: { name: '游客', type: 'info' },
  BASIC: { name: '基础会员', type: 'success' },
  PRO: { name: '专业会员', type: 'warning' },
  VIP: { name: 'VIP会员', type: 'danger' }
};

const getLevelName = (level) => levelMap[level]?.name || level;
const getLevelTagType = (level) => levelMap[level]?.type || 'info';

const generateSlotId = () => 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const addSlot = () => {
  form.timeSlots.push({
    id: generateSlotId(),
    label: '新时段',
    start: '00:00',
    end: '00:00',
    price: form.basePrice
  });
};

const removeSlot = (index) => {
  if (form.timeSlots.length > 1) {
    form.timeSlots.splice(index, 1);
  }
};

const handleSlotModeChange = (mode) => {
  const template = defaultSlotsByMode[mode] || [];
  form.timeSlots = JSON.parse(JSON.stringify(template));
  if (form.autoPrice) {
    syncPricesFromBase();
  }
};

const syncPricesFromBase = () => {
  form.timeSlots.forEach((slot, idx) => {
    const base = form.basePrice;
    const factors = [1.1, 1.0, 1.0, 1.2];
    slot.price = Math.round(base * (factors[idx] || 1.0));
  });
};

let isSyncingFromSlots = false;

const handleAutoPriceChange = (val) => {
  if (val) {
    syncPricesFromBase();
  }
};

watch(
  () => form.basePrice,
  () => {
    if (form.autoPrice && !isSyncingFromSlots) {
      syncPricesFromBase();
    }
  }
);

watch(
  () => form.timeSlots.map(s => s.price),
  (prices) => {
    if (!form.autoPrice) return;
    if (prices.length === 0) return;
    isSyncingFromSlots = true;
    try {
      const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
      if (Math.abs(avg - form.basePrice) > 5) {
        form.basePrice = avg;
      }
    } finally {
      setTimeout(() => { isSyncingFromSlots = false; }, 0);
    }
  },
  { deep: false }
);

const previewConfig = computed(() => ({
  name: form.name,
  minLevel: form.minLevel,
  location: form.location,
  features: form.features,
  timeSlots: form.timeSlots
}));

const minSlotPrice = computed(() => {
  if (form.timeSlots.length === 0) return 0;
  return Math.min(...form.timeSlots.map(s => s.price));
});

const maxSlotPrice = computed(() => {
  if (form.timeSlots.length === 0) return 0;
  return Math.max(...form.timeSlots.map(s => s.price));
});

const generatedJson = computed(() => {
  return JSON.stringify({
    id: 'blind-' + (form.code || 'new').toLowerCase(),
    code: form.code,
    name: form.name,
    type: form.type,
    minLevel: form.minLevel,
    location: form.location,
    features: form.features,
    timeSlots: form.timeSlots.map(s => ({
      id: s.id,
      label: s.label,
      start: s.start,
      end: s.end,
      price: s.price
    }))
  }, null, 2);
});

const handleSave = () => {
  if (!form.name || !form.code) {
    ElMessage.warning('请填写机位名称和编号');
    return;
  }
  if (form.timeSlots.length === 0) {
    ElMessage.warning('请至少配置一个时段');
    return;
  }
  console.log('保存的配置:', JSON.parse(generatedJson.value));
  ElMessage.success('配置保存成功！');
};

const handleReset = () => {
  Object.assign(form, createDefaultForm());
  ElMessage.info('已重置为默认配置');
};

const fileInputRef = ref(null);
const importDialogVisible = ref(false);
const importLoading = ref(false);
const importResult = ref(null);
const importData = ref(null);
const importMeta = ref(null);

const handleExport = () => {
  if (!form.name) {
    ElMessage.warning('请先填写机位名称');
    return;
  }
  
  try {
    const configData = JSON.parse(generatedJson.value);
    const filename = `blind-${form.code || 'config'}_${new Date().toISOString().split('T')[0]}.bpc`;
    downloadConfigFile(configData, filename);
    ElMessage.success('配置文件已导出');
  } catch (e) {
    console.error('导出失败:', e);
    ElMessage.error('导出失败：' + e.message);
  }
};

const handleImportClick = () => {
  if (!importResult.value) {
    fileInputRef.value?.click();
  } else {
    importDialogVisible.value = true;
  }
};

const handleFileChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  importDialogVisible.value = true;
  importLoading.value = true;
  importResult.value = null;
  importData.value = null;
  importMeta.value = null;

  try {
    const result = await readConfigFile(file);
    const migrated = migrateConfig(result.data, result.version);
    const validation = validateConfigData(migrated);

    importMeta.value = {
      version: result.version,
      timestamp: result.timestamp,
      filename: file.name
    };
    importData.value = migrated;
    importResult.value = validation;

    if (!validation.valid) {
      ElMessage.error('配置文件无效：' + validation.errors[0]);
    }
  } catch (e) {
    console.error('导入失败:', e);
    importResult.value = {
      valid: false,
      errors: [e.message || '文件解析失败'],
      warnings: []
    };
    ElMessage.error('导入失败：' + e.message);
  } finally {
    importLoading.value = false;
    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
  }
};

const confirmImport = async () => {
  if (!importData.value) return;

  try {
    await ElMessageBox.confirm(
      `确定要导入机位【${importData.value.name || '未命名'}】的配置吗？\n当前未保存的配置将被覆盖。`,
      '确认导入',
      { type: 'warning', confirmButtonText: '确认导入', cancelButtonText: '取消' }
    );

    const data = importData.value;
    form.code = data.code || '';
    form.name = data.name || '';
    form.type = data.type || 'WATERFOWL';
    form.minLevel = data.minLevel || 'BASIC';
    form.slotMode = data.slotMode || 'CUSTOM';
    form.basePrice = data.basePrice || 0;
    form.autoPrice = data.autoPrice || false;
    form.location = data.location || '';
    form.features = data.features || [];
    form.timeSlots = data.timeSlots?.length 
      ? JSON.parse(JSON.stringify(data.timeSlots))
      : [{ id: 't1', label: '新时段', start: '00:00', end: '00:00', price: 0 }];

    importDialogVisible.value = false;
    ElMessage.success('配置导入成功！');
  } catch (e) {
    if (e !== 'cancel' && e?.action !== 'cancel') {
      console.error('导入确认失败:', e);
    }
  }
};

const resetImportState = () => {
  importLoading.value = false;
  importResult.value = null;
  importData.value = null;
  importMeta.value = null;
};

const formatTimestamp = (ts) => {
  if (!ts) return '-';
  return new Date(ts).toLocaleString('zh-CN');
};
</script>

<style scoped>
.blind-config-page {
  padding: 24px 48px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  font-size: 24px;
  color: #1a3d2e;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 8px;
}

.page-desc {
  color: #606266;
  margin: 0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.card-header .header-icon {
  font-size: 18px;
  color: #409eff;
}

.card-header .header-icon.success {
  color: #67c23a;
}

.card-header > :nth-child(2) {
  flex: 1;
}

.slot-editor {
  width: 100%;
}

.slot-edit-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.preview-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.preview-blind {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
}

.preview-image-placeholder {
  height: 120px;
  background: linear-gradient(135deg, #1a3d2e, #3d7a5e);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  gap: 6px;
}

.preview-image-placeholder .el-icon {
  font-size: 36px;
}

.preview-info {
  padding: 16px;
}

.preview-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.preview-title h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.preview-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #909399;
  margin-bottom: 10px;
}

.preview-features {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.divider-text {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #606266;
}

.preview-time-slots {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.preview-slot {
  padding: 12px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.preview-slot:hover {
  border-color: #409eff;
  background: #ecf5ff;
}

.preview-slot .slot-label {
  font-size: 13px;
  color: #303133;
  font-weight: 500;
}

.preview-slot .slot-price {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
}

.preview-stats {
  text-align: center;
}

.json-preview {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 6px;
  max-height: 300px;
  overflow: auto;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  line-height: 1.6;
  margin: 0;
}

.import-loading {
  text-align: center;
  padding: 40px 20px;
}

.loading-icon {
  font-size: 48px;
  color: #409eff;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.import-loading p {
  color: #606266;
  margin: 0;
}

.import-result {
  padding: 10px 0;
}

.import-preview {
  margin-top: 16px;
}

.import-warnings {
  margin-top: 16px;
}

.import-warnings ul {
  margin: 8px 0 0;
  padding-left: 20px;
  text-align: left;
}

.import-warnings li {
  font-size: 13px;
  line-height: 1.8;
  color: #e6a23c;
}

.import-tip {
  text-align: center;
  padding: 40px 20px;
}

.tip-icon {
  font-size: 56px;
  color: #c0c4cc;
  margin-bottom: 16px;
}

.import-tip p {
  margin: 0 0 8px;
  color: #606266;
}

.import-tip p strong {
  color: #409eff;
}

.tip-sub {
  font-size: 13px;
  color: #909399 !important;
}
</style>
