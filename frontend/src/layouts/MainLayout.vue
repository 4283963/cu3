<template>
  <el-container class="main-layout">
    <el-header class="layout-header">
      <div class="header-left">
        <el-icon class="logo-icon"><Camera /></el-icon>
        <span class="logo-text">鸟类摄影基地</span>
      </div>
      <el-menu
        mode="horizontal"
        :default-active="activeMenu"
        class="nav-menu"
        router
      >
        <el-menu-item
          v-for="route in visibleRoutes"
          :key="route.path"
          :index="route.path"
        >
          <el-icon><component :is="route.meta.icon" /></el-icon>
          <span>{{ route.meta.title }}</span>
        </el-menu-item>
      </el-menu>
      <div class="header-right">
        <template v-if="userStore.isLoggedIn">
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32" :src="userStore.userInfo?.avatar">
                {{ userStore.userInfo?.nickname?.charAt(0) }}
              </el-avatar>
              <span class="user-name">{{ userStore.userInfo?.nickname }}</span>
              <el-tag :type="levelTagType" size="small" class="level-tag">
                {{ userStore.userInfo?.levelName }}
              </el-tag>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>个人中心
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <el-button v-else type="primary" @click="goLogin">
          <el-icon><User /></el-icon>登录
        </el-button>
      </div>
    </el-header>
    <el-main class="layout-main">
      <slot></slot>
    </el-main>
    <el-footer class="layout-footer">
      <span>© 2024 鸟类摄影基地掩体预约系统 | 网关动态路由控管</span>
    </el-footer>
  </el-container>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { ElMessageBox } from 'element-plus';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const activeMenu = computed(() => route.path);
const visibleRoutes = computed(() => userStore.menuRoutes);

const levelTagType = computed(() => {
  const map = { 'VIP会员': 'danger', '专业会员': 'warning', '基础会员': 'success', '游客': 'info' };
  return map[userStore.userInfo?.levelName] || 'info';
});

const goLogin = () => {
  router.push('/login');
};

const handleCommand = async (cmd) => {
  if (cmd === 'logout') {
    try {
      await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        type: 'warning'
      });
      userStore.logout();
    } catch (e) {}
  } else if (cmd === 'profile') {
    router.push('/profile');
  }
};
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
}

.layout-header {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #1a3d2e 0%, #2d5a45 100%);
  padding: 0 24px;
  border-bottom: 1px solid #e4e7ed;
  gap: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 28px;
  color: #ffd700;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  letter-spacing: 1px;
}

.nav-menu {
  flex: 1;
  border-bottom: none;
  background: transparent;
}

.nav-menu :deep(.el-menu-item) {
  color: rgba(255, 255, 255, 0.85);
  border-bottom: 2px solid transparent;
}

.nav-menu :deep(.el-menu-item:hover) {
  color: #ffd700;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-menu :deep(.el-menu-item.is-active) {
  color: #ffd700;
  border-bottom: 2px solid #ffd700;
  background-color: rgba(255, 255, 255, 0.05);
}

.header-right {
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-name {
  font-size: 14px;
}

.level-tag {
  margin-left: 4px;
}

.layout-main {
  padding: 0;
  background-color: #f5f7fa;
}

.layout-footer {
  background-color: #2c3e50;
  color: #fff;
  text-align: center;
  line-height: 50px;
  font-size: 13px;
  opacity: 0.8;
}
</style>
