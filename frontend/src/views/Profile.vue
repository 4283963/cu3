<template>
  <div class="profile-page page-container">
    <el-row :gutter="24">
      <el-col :span="8">
        <el-card shadow="hover" class="profile-card">
          <div class="avatar-section">
            <el-avatar :size="100" :src="userStore.userInfo?.avatar">
              {{ userStore.userInfo?.nickname?.charAt(0) }}
            </el-avatar>
            <h2 class="nickname">{{ userStore.userInfo?.nickname }}</h2>
            <el-tag :type="levelTagType" size="large" effect="dark" class="level-tag">
              <el-icon><Medal /></el-icon>
              {{ userStore.userInfo?.levelName }}
            </el-tag>
          </div>

          <el-descriptions :column="1" border class="info-list">
            <el-descriptions-item label="用户名">
              {{ userStore.userInfo?.username }}
            </el-descriptions-item>
            <el-descriptions-item label="会员ID">
              {{ userStore.userInfo?.id }}
            </el-descriptions-item>
            <el-descriptions-item label="最大预约数">
              <span class="text-primary">{{ userStore.userInfo?.maxBlinds }} 个机位</span>
            </el-descriptions-item>
            <el-descriptions-item label="注册时间">
              {{ formatDate(userStore.userInfo?.createdAt) }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card shadow="hover" class="member-card">
          <template #header>
            <div class="card-header">
              <span><el-icon><Crown /></el-icon>会员权益说明</span>
            </div>
          </template>

          <el-steps :active="currentLevelIndex" finish-status="success" align-center>
            <el-step title="基础会员" description="BASIC" />
            <el-step title="专业会员" description="PRO" />
            <el-step title="VIP会员" description="VIP" />
          </el-steps>

          <el-row :gutter="16" class="level-comparison">
            <el-col :span="8" v-for="level in levels" :key="level.key">
              <div class="level-card" :class="{ active: level.key === userStore.userInfo?.level }">
                <div class="level-header" :class="level.type">
                  <h4>{{ level.name }}</h4>
                  <el-tag v-if="level.key === userStore.userInfo?.level" type="success" size="small" effect="dark">
                    当前等级
                  </el-tag>
                </div>
                <ul class="level-features">
                  <li v-for="(feature, idx) in level.features" :key="idx">
                    <el-icon><Check /></el-icon>{{ feature }}
                  </li>
                </ul>
              </div>
            </el-col>
          </el-row>
        </el-card>

        <el-card shadow="hover" class="stats-card" style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <span><el-icon><DataAnalysis /></el-icon>使用统计</span>
            </div>
          </template>
          <el-row :gutter="24">
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-num text-primary">{{ bookingStore.bookings.length }}</div>
                <div class="stat-label">总预约次数</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-num text-success">{{ bookingStore.confirmedBookings.length }}</div>
                <div class="stat-label">有效预约</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-num text-warning">{{ bookingStore.blinds.length }}</div>
                <div class="stat-label">可预约机位</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-num text-danger">¥{{ totalSpent }}</div>
                <div class="stat-label">累计消费</div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useBookingStore } from '@/stores/booking';

const userStore = useUserStore();
const bookingStore = useBookingStore();

const levelTagType = computed(() => {
  const map = { VIP: 'danger', PRO: 'warning', BASIC: 'success' };
  return map[userStore.userInfo?.level] || 'info';
});

const currentLevelIndex = computed(() => {
  const map = { BASIC: 0, PRO: 1, VIP: 2 };
  return map[userStore.userInfo?.level] ?? 0;
});

const levels = [
  {
    key: 'BASIC',
    name: '基础会员',
    type: 'success',
    features: ['预约最多2个机位', '开放翠鸟/湿地掩体', '基础时段选择']
  },
  {
    key: 'PRO',
    name: '专业会员',
    type: 'warning',
    features: ['预约最多4个机位', '开放鹭鸟观测塔', '作品展示区', '专属客服支持']
  },
  {
    key: 'VIP',
    name: 'VIP会员',
    type: 'danger',
    features: ['无限机位预约', '猛禽/专属棚开放', 'VIP专区服务', '系统管理权限', '私人导摄服务']
  }
];

const totalSpent = computed(() => {
  return bookingStore.bookings.reduce((sum, b) => sum + b.price, 0);
});

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('zh-CN');
};

onMounted(async () => {
  await bookingStore.fetchBlinds();
  await bookingStore.fetchBookings();
  await userStore.refreshUserInfo();
});
</script>

<style scoped>
.profile-page {
  padding: 24px 48px;
}

.profile-card {
  text-align: center;
}

.avatar-section {
  padding: 20px 0;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 20px;
}

.nickname {
  font-size: 22px;
  color: #303133;
  margin: 12px 0 8px;
}

.level-tag {
  margin-top: 4px;
}

.info-list {
  margin-top: 0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 500;
}

.member-card :deep(.el-steps) {
  padding: 20px 40px 40px;
}

.level-comparison {
  margin-top: 20px;
}

.level-card {
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
}

.level-card.active {
  border-color: #409eff;
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.2);
}

.level-header {
  padding: 16px;
  color: #fff;
  text-align: center;
}

.level-header.success { background: linear-gradient(135deg, #67c23a, #85ce61); }
.level-header.warning { background: linear-gradient(135deg, #e6a23c, #ebb563); }
.level-header.danger { background: linear-gradient(135deg, #f56c6c, #f78989); }

.level-header h4 {
  margin: 0 0 6px;
  font-size: 16px;
}

.level-features {
  list-style: none;
  padding: 16px 20px;
  margin: 0;
}

.level-features li {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 0;
  font-size: 13px;
  color: #606266;
}

.level-features li .el-icon {
  color: #67c23a;
}

.stats-card .stat-item {
  text-align: center;
  padding: 20px;
}

.stat-num {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 13px;
  color: #909399;
}
</style>
