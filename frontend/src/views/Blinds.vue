<template>
  <div class="blinds-page page-container">
    <div class="page-header">
      <h2><el-icon><Location /></el-icon>掩体机位预约</h2>
      <p class="page-desc">根据您的会员等级，系统为您展示可预约的机位及时段</p>
    </div>

    <el-row :gutter="20" v-loading="bookingStore.loading.blinds">
      <el-col :span="8" v-for="blind in bookingStore.blinds" :key="blind.id">
        <el-card shadow="hover" class="blind-card">
          <img :src="blind.image" :alt="blind.name" class="blind-image" />
          <div class="card-body">
            <div class="blind-title">
              <h3>{{ blind.name }}</h3>
              <el-tag :type="getLevelTagType(blind.minLevel)" size="small">
                {{ getLevelName(blind.minLevel) }}+
              </el-tag>
            </div>
            <p class="blind-desc">{{ blind.description }}</p>
            <div class="blind-location">
              <el-icon><Location /></el-icon>
              <span>{{ blind.location }}</span>
            </div>
            <div class="blind-features">
              <el-tag
                v-for="(feature, idx) in blind.features"
                :key="idx"
                type="info"
                size="small"
                effect="plain"
              >
                {{ feature }}
              </el-tag>
            </div>
            <el-button
              type="primary"
              class="book-btn"
              @click="openBookingDialog(blind)"
              :disabled="!userStore.isLoggedIn"
            >
              <el-icon><Calendar /></el-icon>
              {{ userStore.isLoggedIn ? '立即预约' : '登录后预约' }}
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-empty
      v-if="!bookingStore.loading.blinds && bookingStore.blinds.length === 0"
      description="暂无可用机位，请升级会员等级解锁更多机位"
    />

    <el-dialog
      v-model="dialogVisible"
      :title="`预约 - ${selectedBlind?.name || ''}`"
      width="600px"
      :close-on-click-modal="false"
      @closed="resetDialog"
    >
      <div v-if="selectedBlind" class="booking-dialog">
        <div class="dialog-info">
          <img :src="selectedBlind.image" :alt="selectedBlind.name" />
          <div class="info-text">
            <h4>{{ selectedBlind.name }}</h4>
            <p><el-icon><Location /></el-icon>{{ selectedBlind.location }}</p>
          </div>
        </div>

        <el-form :model="bookingForm" label-width="80px" class="booking-form">
          <el-form-item label="选择日期">
            <el-date-picker
              v-model="bookingForm.date"
              type="date"
              placeholder="请选择预约日期"
              :disabled-date="disabledDate"
              value-format="YYYY-MM-DD"
              style="width: 100%"
              @change="handleDateChange"
            />
          </el-form-item>

          <el-form-item label="选择时段">
            <div class="time-slots">
              <div
                v-for="slot in availableSlots"
                :key="slot.id"
                class="time-slot"
                :class="{
                  active: bookingForm.timeSlotId === slot.id,
                  disabled: !slot.available
                }"
                @click="selectSlot(slot)"
              >
                <div class="slot-label">{{ slot.label }}</div>
                <div class="slot-price">¥{{ slot.price }}</div>
                <div class="slot-status">
                  <el-tag v-if="slot.available" type="success" size="small">可预约</el-tag>
                  <el-tag v-else type="info" size="small">已约满</el-tag>
                </div>
              </div>
              <el-empty
                v-if="availableSlots.length === 0 && bookingForm.date"
                description="暂无可用时段"
                :image-size="80"
              />
            </div>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="submitting"
          :disabled="!canSubmit"
          @click="submitBooking"
        >
          确认预约
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '@/stores/user';
import { useBookingStore } from '@/stores/booking';

const userStore = useUserStore();
const bookingStore = useBookingStore();

const dialogVisible = ref(false);
const selectedBlind = ref(null);
const availableSlots = ref([]);
const submitting = ref(false);

const bookingForm = reactive({
  date: '',
  timeSlotId: '',
  timeSlotLabel: '',
  price: 0
});

const levelMap = {
  BASIC: { name: '基础会员', type: 'success' },
  PRO: { name: '专业会员', type: 'warning' },
  VIP: { name: 'VIP会员', type: 'danger' }
};

const getLevelName = (level) => levelMap[level]?.name || level;
const getLevelTagType = (level) => levelMap[level]?.type || 'info';

const disabledDate = (time) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return time.getTime() < today.getTime();
};

const canSubmit = computed(() => {
  return bookingForm.date && bookingForm.timeSlotId;
});

const openBookingDialog = (blind) => {
  selectedBlind.value = blind;
  bookingForm.date = new Date().toISOString().split('T')[0];
  bookingForm.timeSlotId = '';
  bookingForm.timeSlotLabel = '';
  bookingForm.price = 0;
  availableSlots.value = [];
  dialogVisible.value = true;
  loadAvailableSlots();
};

const loadAvailableSlots = async () => {
  if (!selectedBlind.value || !bookingForm.date) return;
  try {
    const res = await bookingStore.fetchBlindSlots(selectedBlind.value.id, bookingForm.date);
    availableSlots.value = res.slots;
  } catch (e) {
    console.error('加载时段失败', e);
  }
};

const handleDateChange = () => {
  bookingForm.timeSlotId = '';
  bookingForm.timeSlotLabel = '';
  bookingForm.price = 0;
  loadAvailableSlots();
};

const selectSlot = (slot) => {
  if (!slot.available) return;
  bookingForm.timeSlotId = slot.id;
  bookingForm.timeSlotLabel = slot.label;
  bookingForm.price = slot.price;
};

const submitBooking = async () => {
  if (!canSubmit.value) return;

  try {
    await ElMessageBox.confirm(
      `确认预约【${selectedBlind.value.name}】\n日期：${bookingForm.date}\n时段：${bookingForm.timeSlotLabel}\n费用：¥${bookingForm.price}`,
      '确认预约',
      { type: 'info' }
    );

    submitting.value = true;
    await bookingStore.createNewBooking({
      blindId: selectedBlind.value.id,
      date: bookingForm.date,
      timeSlotId: bookingForm.timeSlotId
    });

    ElMessage.success('预约成功！');
    dialogVisible.value = false;
    loadAvailableSlots();
  } catch (e) {
    if (e !== 'cancel') {
      console.error('预约失败', e);
    }
  } finally {
    submitting.value = false;
  }
};

const resetDialog = () => {
  selectedBlind.value = null;
  availableSlots.value = [];
  bookingForm.date = '';
  bookingForm.timeSlotId = '';
};

onMounted(async () => {
  await bookingStore.fetchBlinds();
});
</script>

<style scoped>
.blinds-page {
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

.blind-card {
  margin-bottom: 20px;
  overflow: hidden;
}

.blind-image {
  width: calc(100% + 40px);
  height: 180px;
  object-fit: cover;
  margin: -20px -20px 0;
}

.card-body {
  padding-top: 16px;
}

.blind-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.blind-title h3 {
  font-size: 17px;
  margin: 0;
  color: #303133;
}

.blind-desc {
  font-size: 13px;
  color: #606266;
  margin: 0 0 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blind-location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #909399;
  margin-bottom: 10px;
}

.blind-features {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.book-btn {
  width: 100%;
}

.booking-dialog .dialog-info {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.booking-dialog .dialog-info img {
  width: 100px;
  height: 70px;
  object-fit: cover;
  border-radius: 6px;
}

.booking-dialog .info-text h4 {
  margin: 0 0 8px;
  color: #303133;
}

.booking-dialog .info-text p {
  margin: 0;
  font-size: 13px;
  color: #606266;
  display: flex;
  align-items: center;
  gap: 4px;
}

.booking-form {
  margin-top: 8px;
}

.time-slots {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  width: 100%;
}

.time-slot {
  padding: 14px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.time-slot:hover:not(.disabled) {
  border-color: #409eff;
  background: #ecf5ff;
}

.time-slot.active {
  border-color: #409eff;
  background: #ecf5ff;
}

.time-slot.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.slot-label {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.slot-price {
  font-size: 16px;
  font-weight: bold;
  color: #f56c6c;
}

.slot-status {
  margin-top: 2px;
}
</style>
