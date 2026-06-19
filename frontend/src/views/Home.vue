<template>
  <div class="home-page">
    <div class="hero-section">
      <div class="hero-content">
        <h1>探索鸟类世界的每一个精彩瞬间</h1>
        <p class="hero-subtitle">专业掩体机位 · 动态预约系统 · 会员分级权限</p>
        <div class="hero-actions">
          <el-button type="primary" size="large" @click="goBlinds">
            <el-icon><Location /></el-icon>查看机位
          </el-button>
          <el-button size="large" @click="goBlinds" v-if="!userStore.isLoggedIn">
            <el-icon><User /></el-icon>立即登录
          </el-button>
        </div>
      </div>
      <div class="hero-decoration">
        <el-icon class="hero-icon"><Camera /></el-icon>
      </div>
    </div>

    <div class="section stats-section">
      <el-row :gutter="24">
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <el-icon class="stat-icon primary"><Location /></el-icon>
              <div class="stat-info">
                <div class="stat-value">{{ totalBlinds }}</div>
                <div class="stat-label">掩体机位</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <el-icon class="stat-icon success"><Tickets /></el-icon>
              <div class="stat-info">
                <div class="stat-value">{{ activeBookings }}</div>
                <div class="stat-label">当前预约</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <el-icon class="stat-icon warning"><User /></el-icon>
              <div class="stat-info">
                <div class="stat-value">3</div>
                <div class="stat-label">会员等级</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <el-icon class="stat-icon danger"><Crown /></el-icon>
              <div class="stat-info">
                <div class="stat-value">{{ vipBlinds }}</div>
                <div class="stat-label">VIP专享</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="section">
      <div class="section-header">
        <h2><el-icon><Compass /></el-icon>系统特色</h2>
      </div>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-card shadow="hover" class="feature-card">
            <el-icon class="feature-icon primary"><Key /></el-icon>
            <h3>动态路由权限</h3>
            <p>根据摄影师会员级别，网关动态下发路由表，前端智能注册，确保不同级别看到不同功能。</p>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="feature-card">
            <el-icon class="feature-icon success"><Calendar /></el-icon>
            <h3>智能时段预约</h3>
            <p>基于配置JSON动态渲染不同机位的时段选择，实时显示可用状态，避免预约冲突。</p>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="feature-card">
            <el-icon class="feature-icon warning"><Medal /></el-icon>
            <h3>会员分级体系</h3>
            <p>基础/专业/VIP三级会员体系，不同级别解锁不同机位权限，享受专属服务。</p>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="section">
      <div class="section-header">
        <h2><el-icon><Picture /></el-icon>热门机位</h2>
        <el-button type="primary" link @click="goBlinds">查看全部 →</el-button>
      </div>
      <el-row :gutter="20" v-loading="loading">
        <el-col :span="8" v-for="blind in featuredBlinds" :key="blind.id">
          <el-card shadow="hover" class="blind-card">
            <img :src="blind.image" :alt="blind.name" class="blind-image" />
            <div class="blind-info">
              <div class="blind-header">
                <h3>{{ blind.name }}</h3>
                <el-tag :type="getLevelTagType(blind.minLevel)" size="small">
                  {{ getLevelName(blind.minLevel) }}+
                </el-tag>
              </div>
              <p class="blind-desc">{{ blind.description }}</p>
              <div class="blind-meta">
                <span><el-icon><Location /></el-icon>{{ blind.location }}</span>
                <span class="blind-price">¥{{ Math.min(...blind.timeSlots.map(s => s.price)) }}起</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useBookingStore } from '@/stores/booking';

const router = useRouter();
const userStore = useUserStore();
const bookingStore = useBookingStore();

const loading = ref(false);
const totalBlinds = computed(() => bookingStore.blinds.length);
const activeBookings = computed(() => bookingStore.confirmedBookings.length);
const vipBlinds = computed(() => bookingStore.blinds.filter(b => b.minLevel === 'VIP').length);
const featuredBlinds = computed(() => bookingStore.blinds.slice(0, 3));

const levelMap = {
  BASIC: { name: '基础会员', type: 'success' },
  PRO: { name: '专业会员', type: 'warning' },
  VIP: { name: 'VIP会员', type: 'danger' }
};

const getLevelName = (level) => levelMap[level]?.name || level;
const getLevelTagType = (level) => levelMap[level]?.type || 'info';

const goBlinds = () => {
  router.push('/blinds');
};

onMounted(async () => {
  loading.value = true;
  try {
    await bookingStore.fetchBlinds();
    if (userStore.isLoggedIn) {
      await bookingStore.fetchBookings();
    }
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.home-page {
  padding-bottom: 40px;
}

.hero-section {
  background: linear-gradient(135deg, #1a3d2e 0%, #2d5a45 50%, #3d7a5e 100%);
  padding: 60px 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  right: -100px;
  top: -100px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, transparent 70%);
}

.hero-content {
  max-width: 560px;
  z-index: 1;
}

.hero-content h1 {
  font-size: 38px;
  margin-bottom: 16px;
  line-height: 1.3;
}

.hero-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

.hero-decoration {
  z-index: 1;
}

.hero-icon {
  font-size: 180px;
  color: rgba(255, 215, 0, 0.2);
}

.section {
  padding: 32px 48px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 22px;
  color: #1a3d2e;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stats-section {
  margin-top: -40px;
  position: relative;
  z-index: 10;
}

.stat-card {
  text-align: center;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 0;
}

.stat-icon {
  font-size: 40px;
  padding: 12px;
  border-radius: 12px;
}

.stat-icon.primary { color: #409eff; background: rgba(64, 158, 255, 0.1); }
.stat-icon.success { color: #67c23a; background: rgba(103, 194, 58, 0.1); }
.stat-icon.warning { color: #e6a23c; background: rgba(230, 162, 60, 0.1); }
.stat-icon.danger { color: #f56c6c; background: rgba(245, 108, 108, 0.1); }

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.feature-card {
  text-align: center;
  padding: 24px 16px;
  height: 100%;
}

.feature-icon {
  font-size: 48px;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 16px;
}

.feature-icon.primary { color: #409eff; background: rgba(64, 158, 255, 0.1); }
.feature-icon.success { color: #67c23a; background: rgba(103, 194, 58, 0.1); }
.feature-icon.warning { color: #e6a23c; background: rgba(230, 162, 60, 0.1); }

.feature-card h3 {
  font-size: 18px;
  color: #303133;
  margin-bottom: 12px;
}

.feature-card p {
  font-size: 14px;
  color: #606266;
  line-height: 1.7;
  margin: 0;
}

.blind-card {
  overflow: hidden;
}

.blind-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 4px 4px 0 0;
  margin: -20px -20px 16px;
  width: calc(100% + 40px);
}

.blind-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.blind-header h3 {
  font-size: 16px;
  margin: 0;
  color: #303133;
}

.blind-desc {
  font-size: 13px;
  color: #606266;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blind-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #909399;
}

.blind-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.blind-price {
  color: #f56c6c;
  font-weight: bold;
  font-size: 15px;
}
</style>
