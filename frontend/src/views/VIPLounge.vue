<template>
  <div class="vip-page page-container">
    <div class="vip-header">
      <div class="vip-content">
        <el-icon class="vip-icon"><Crown /></el-icon>
        <h1>VIP会员专属专区</h1>
        <p class="vip-subtitle">尊享顶级拍摄体验与专属服务</p>
      </div>
    </div>

    <el-row :gutter="24" class="vip-content">
      <el-col :span="12">
        <el-card shadow="hover" class="vip-card">
          <template #header>
            <div class="card-title">
              <el-icon class="card-icon danger"><Star /></el-icon>
              <span>VIP专属机位</span>
            </div>
          </template>
          <el-list>
            <el-list-item v-for="blind in vipBlinds" :key="blind.id">
              <div class="blind-item">
                <img :src="blind.image" :alt="blind.name" class="blind-thumb" />
                <div class="blind-detail">
                  <h4>{{ blind.name }}</h4>
                  <p>{{ blind.description }}</p>
                  <div class="blind-meta">
                    <el-tag type="danger" size="small" effect="dark">VIP专属</el-tag>
                    <span class="price">¥{{ Math.min(...blind.timeSlots.map(s => s.price)) }} 起/时段</span>
                  </div>
                </div>
              </div>
            </el-list-item>
          </el-list>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="hover" class="vip-card">
          <template #header>
            <div class="card-title">
              <el-icon class="card-icon warning"><Medal /></el-icon>
              <span>VIP专属权益</span>
            </div>
          </template>
          <div class="privilege-list">
            <div class="privilege-item" v-for="(p, idx) in privileges" :key="idx">
              <el-icon class="privilege-icon"><Crown /></el-icon>
              <div>
                <h4>{{ p.title }}</h4>
                <p>{{ p.desc }}</p>
              </div>
            </div>
          </div>
        </el-card>

        <el-card shadow="hover" class="vip-card" style="margin-top: 20px;">
          <template #header>
            <div class="card-title">
              <el-icon class="card-icon primary"><Service /></el-icon>
              <span>快速服务通道</span>
            </div>
          </template>
          <div class="service-actions">
            <el-button type="primary" size="large">
              <el-icon><Phone /></el-icon>联系私人导摄
            </el-button>
            <el-button type="warning" size="large">
              <el-icon><Calendar /></el-icon>预约专属时段
            </el-button>
            <el-button type="danger" size="large">
              <el-icon><Tools /></el-icon>设备租赁服务
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useBookingStore } from '@/stores/booking';

const bookingStore = useBookingStore();

const vipBlinds = computed(() => bookingStore.blinds.filter(b => b.minLevel === 'VIP'));

const privileges = [
  { title: '无限机位预约', desc: '不再受预约数量限制，随心拍摄' },
  { title: '私人导摄服务', desc: '资深摄影师一对一指导' },
  { title: '专属休息区域', desc: '独立休息区，提供餐饮服务' },
  { title: '专业设备租赁', desc: '顶级镜头、三脚架免费使用' },
  { title: '优先预约权', desc: '热门机位优先3天开放预约' },
  { title: '作品推荐展示', desc: '优秀作品在官网首页推荐' }
];

onMounted(async () => {
  await bookingStore.fetchBlinds();
});
</script>

<style scoped>
.vip-page {
  padding: 0;
}

.vip-header {
  background: linear-gradient(135deg, #8b6914 0%, #d4a017 50%, #f5d061 100%);
  padding: 60px 48px;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.vip-header::before {
  content: '';
  position: absolute;
  right: -80px;
  top: -80px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
}

.vip-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.vip-icon {
  font-size: 64px;
  color: #fff;
  margin-bottom: 12px;
}

.vip-header h1 {
  font-size: 36px;
  margin: 0 0 12px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.vip-subtitle {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
}

.vip-content {
  padding: 24px 48px;
}

.vip-card {
  height: 100%;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
}

.card-icon {
  font-size: 20px;
}

.card-icon.danger { color: #f56c6c; }
.card-icon.warning { color: #e6a23c; }
.card-icon.primary { color: #409eff; }

.blind-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.blind-item:last-child {
  border-bottom: none;
}

.blind-thumb {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.blind-detail {
  flex: 1;
}

.blind-detail h4 {
  margin: 0 0 4px;
  font-size: 15px;
  color: #303133;
}

.blind-detail p {
  margin: 0 0 6px;
  font-size: 12px;
  color: #909399;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blind-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.blind-meta .price {
  font-size: 13px;
  font-weight: bold;
  color: #f56c6c;
}

.privilege-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.privilege-item {
  display: flex;
  gap: 10px;
  padding: 12px;
  background: linear-gradient(135deg, #fff8e1, #fff3cd);
  border-radius: 8px;
}

.privilege-icon {
  font-size: 24px;
  color: #d4a017;
  flex-shrink: 0;
}

.privilege-item h4 {
  margin: 0 0 4px;
  font-size: 14px;
  color: #8b6914;
}

.privilege-item p {
  margin: 0;
  font-size: 12px;
  color: #665200;
}

.service-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.service-actions .el-button {
  justify-content: flex-start;
  padding-left: 20px;
}
</style>
