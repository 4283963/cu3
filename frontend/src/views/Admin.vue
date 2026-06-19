<template>
  <div class="admin-page page-container">
    <div class="page-header">
      <h2><el-icon><Setting /></el-icon>系统管理</h2>
      <p class="page-desc">VIP会员专属 · 网关路由配置与系统监控</p>
    </div>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="路由配置" name="routes">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>当前路由表（根据会员级别动态下发）</span>
              <el-tag :type="levelTagType" effect="dark">
                登录用户: {{ userStore.userInfo?.levelName }}
              </el-tag>
            </div>
          </template>
          <el-alert
            title="网关路由控管说明"
            type="info"
            :closable="false"
            style="margin-bottom: 20px;"
          >
            系统根据摄影师当前的登录状态和会员级别，由后端网关动态下发路由配置表，
            前端接收后通过 router.addRoute() 动态注册，确保不同权限级别看到不同功能页面。
          </el-alert>
          <el-table :data="routeTableData" border style="width: 100%">
            <el-table-column prop="path" label="路由路径" width="160" />
            <el-table-column prop="name" label="路由名称" width="140" />
            <el-table-column prop="component" label="组件映射" width="140" />
            <el-table-column prop="title" label="页面标题" width="140">
              <template #default="{ row }">{{ row.title || '-' }}</template>
            </el-table-column>
            <el-table-column prop="icon" label="菜单图标" width="120">
              <template #default="{ row }">
                <el-icon v-if="row.icon"><component :is="row.icon" /></el-icon>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="是否需要登录" width="120">
              <template #default="{ row }">
                <el-tag :type="row.requiresAuth ? 'warning' : 'success'" size="small">
                  {{ row.requiresAuth ? '需要' : '不需要' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="是否在菜单显示" width="120">
              <template #default="{ row }">
                <el-tag :type="row.hidden ? 'info' : 'success'" size="small">
                  {{ row.hidden ? '隐藏' : '显示' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="会员权限矩阵" name="matrix">
        <el-card shadow="never">
          <template #header>
            <span>机位访问权限矩阵</span>
          </template>
          <el-table :data="accessMatrix" border style="width: 100%">
            <el-table-column prop="name" label="机位名称" width="160" fixed />
            <el-table-column label="游客 (GUEST)" width="120" align="center">
              <template #default="{ row }">
                <el-icon v-if="row.GUEST" class="text-success"><CircleCheck /></el-icon>
                <el-icon v-else class="text-danger"><Close /></el-icon>
              </template>
            </el-table-column>
            <el-table-column label="基础会员 (BASIC)" width="140" align="center">
              <template #default="{ row }">
                <el-icon v-if="row.BASIC" class="text-success"><CircleCheck /></el-icon>
                <el-icon v-else class="text-danger"><Close /></el-icon>
              </template>
            </el-table-column>
            <el-table-column label="专业会员 (PRO)" width="140" align="center">
              <template #default="{ row }">
                <el-icon v-if="row.PRO" class="text-success"><CircleCheck /></el-icon>
                <el-icon v-else class="text-danger"><Close /></el-icon>
              </template>
            </el-table-column>
            <el-table-column label="VIP会员 (VIP)" width="140" align="center">
              <template #default="{ row }">
                <el-icon v-if="row.VIP" class="text-success"><CircleCheck /></el-icon>
                <el-icon v-else class="text-danger"><Close /></el-icon>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="系统状态" name="status">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card shadow="hover">
              <el-statistic title="系统用户数" :value="3" />
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover">
              <el-statistic title="可预约机位" :value="blinds.length" />
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover">
              <el-statistic title="今日预约数" :value="todayBookings" />
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover">
              <el-statistic title="网关服务状态" value="运行中" />
            </el-card>
          </el-col>
        </el-row>

        <el-card shadow="never" style="margin-top: 20px;">
          <template #header>
            <span>机位时段配置 JSON 预览</span>
          </template>
          <el-tabs>
            <el-tab-pane v-for="blind in blinds" :key="blind.id" :label="blind.name">
              <pre class="json-preview">{{ JSON.stringify(blind.timeSlots, null, 2) }}</pre>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useBookingStore } from '@/stores/booking';

const userStore = useUserStore();
const bookingStore = useBookingStore();

const activeTab = ref('routes');

const levelTagType = computed(() => {
  const map = { VIP: 'danger', PRO: 'warning', BASIC: 'success' };
  return map[userStore.userInfo?.level] || 'info';
});

const routeTableData = computed(() => {
  return userStore.routes.map(r => ({
    path: r.path,
    name: r.name,
    component: r.component?.name || r.component,
    title: r.meta?.title,
    icon: r.meta?.icon,
    requiresAuth: r.meta?.requiresAuth,
    hidden: r.meta?.hidden
  }));
});

const blinds = computed(() => bookingStore.blinds);

const accessMatrix = computed(() => {
  const levels = { GUEST: 0, BASIC: 1, PRO: 2, VIP: 3 };
  return bookingStore.blinds.map(blind => {
    const minLevel = levels[blind.minLevel] ?? 999;
    return {
      name: blind.name,
      GUEST: minLevel <= 0,
      BASIC: minLevel <= 1,
      PRO: minLevel <= 2,
      VIP: minLevel <= 3
    };
  });
});

const todayBookings = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return bookingStore.bookings.filter(b => b.date === today && b.status === 'confirmed').length;
});

onMounted(async () => {
  await bookingStore.fetchBlinds();
  await bookingStore.fetchBookings();
});
</script>

<style scoped>
.admin-page {
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
  justify-content: space-between;
  align-items: center;
}

.json-preview {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 20px;
  border-radius: 6px;
  max-height: 400px;
  overflow: auto;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
}
</style>
