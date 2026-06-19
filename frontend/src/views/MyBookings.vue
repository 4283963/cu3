<template>
  <div class="my-bookings-page page-container">
    <div class="page-header">
      <h2><el-icon><Tickets /></el-icon>我的预约</h2>
      <p class="page-desc">
        当前会员等级：<el-tag :type="levelTagType" size="small">{{ userStore.userInfo?.levelName }}</el-tag>
        ，最多同时预约 <strong>{{ userStore.userInfo?.maxBlinds || 0 }}</strong> 个机位
      </p>
    </div>

    <el-tabs v-model="activeTab" class="booking-tabs">
      <el-tab-pane label="全部预约" name="all">
        <el-table
          :data="filteredBookings"
          v-loading="bookingStore.loading"
          style="width: 100%"
          empty-text="暂无预约记录"
        >
          <el-table-column prop="blindName" label="机位名称" width="180" />
          <el-table-column prop="date" label="预约日期" width="130">
            <template #default="{ row }">
              <span>{{ row.date }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="timeSlotLabel" label="时段" width="180" />
          <el-table-column prop="price" label="费用" width="100">
            <template #default="{ row }">
              <span class="text-danger">¥{{ row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" width="180">
            <template #default="{ row }">
              {{ formatDate(row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140" fixed="right">
            <template #default="{ row }">
              <el-button
                v-if="row.status === 'confirmed'"
                type="danger"
                link
                size="small"
                @click="handleCancel(row)"
              >
                取消预约
              </el-button>
              <span v-else class="text-muted">-</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane :label="`已确认 (${bookingStore.confirmedBookings.length})`" name="confirmed">
        <el-row :gutter="20">
          <el-col :span="8" v-for="booking in bookingStore.confirmedBookings" :key="booking.id">
            <el-card shadow="hover" class="booking-card confirmed">
              <div class="card-header">
                <el-icon class="status-icon success"><CircleCheck /></el-icon>
                <el-tag type="success" size="small">已确认</el-tag>
              </div>
              <h3>{{ booking.blindName }}</h3>
              <div class="booking-info">
                <p><el-icon><Calendar /></el-icon>{{ booking.date }}</p>
                <p><el-icon><Clock /></el-icon>{{ booking.timeSlotLabel }}</p>
                <p><el-icon><Money /></el-icon><span class="text-danger">¥{{ booking.price }}</span></p>
              </div>
              <el-button
                type="danger"
                plain
                size="small"
                class="cancel-btn"
                @click="handleCancel(booking)"
              >
                取消预约
              </el-button>
            </el-card>
          </el-col>
          <el-empty
            v-if="!bookingStore.loading && bookingStore.confirmedBookings.length === 0"
            description="暂无已确认的预约"
          />
        </el-row>
      </el-tab-pane>

      <el-tab-pane :label="`已取消 (${bookingStore.cancelledBookings.length})`" name="cancelled">
        <el-table
          :data="bookingStore.cancelledBookings"
          v-loading="bookingStore.loading"
          style="width: 100%"
          empty-text="暂无已取消的预约"
        >
          <el-table-column prop="blindName" label="机位名称" width="180" />
          <el-table-column prop="date" label="预约日期" width="130" />
          <el-table-column prop="timeSlotLabel" label="时段" width="180" />
          <el-table-column prop="price" label="费用" width="100">
            <template #default="{ row }">
              <span class="text-muted">¥{{ row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag type="info" size="small">已取消</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="cancelledAt" label="取消时间" width="180">
            <template #default="{ row }">
              {{ formatDate(row.cancelledAt) }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '@/stores/user';
import { useBookingStore } from '@/stores/booking';

const userStore = useUserStore();
const bookingStore = useBookingStore();

const activeTab = ref('all');

const levelTagType = computed(() => {
  const map = { 'VIP会员': 'danger', '专业会员': 'warning', '基础会员': 'success' };
  return map[userStore.userInfo?.levelName] || 'info';
});

const filteredBookings = computed(() => bookingStore.bookings);

const getStatusType = (status) => {
  const map = { confirmed: 'success', pending: 'warning', cancelled: 'info' };
  return map[status] || 'info';
};

const getStatusText = (status) => {
  const map = { confirmed: '已确认', pending: '待确认', cancelled: '已取消' };
  return map[status] || status;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('zh-CN');
};

const handleCancel = async (booking) => {
  try {
    await ElMessageBox.confirm(
      `确定取消【${booking.blindName}】的预约吗？\n日期：${booking.date}，时段：${booking.timeSlotLabel}`,
      '取消预约',
      { type: 'warning' }
    );
    await bookingStore.cancelBookingById(booking.id);
    ElMessage.success('预约已取消');
  } catch (e) {
    if (e !== 'cancel') {
      console.error('取消失败', e);
    }
  }
};

onMounted(async () => {
  await bookingStore.fetchBookings();
});
</script>

<style scoped>
.my-bookings-page {
  padding: 24px 48px;
}

.page-header {
  margin-bottom: 20px;
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

.page-desc strong {
  color: #1a3d2e;
}

.booking-tabs {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
}

.text-muted {
  color: #909399;
}

.booking-card {
  margin-bottom: 20px;
  position: relative;
}

.booking-card.confirmed {
  border-left: 4px solid #67c23a;
}

.card-header {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 8px;
}

.status-icon {
  font-size: 18px;
}

.status-icon.success { color: #67c23a; }

.booking-card h3 {
  font-size: 17px;
  color: #303133;
  margin: 0 0 12px;
}

.booking-info {
  margin-bottom: 16px;
}

.booking-info p {
  font-size: 13px;
  color: #606266;
  margin: 6px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.cancel-btn {
  width: 100%;
}
</style>
