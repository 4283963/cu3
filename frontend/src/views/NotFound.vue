<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1 class="error-code">404</h1>
      <p class="error-message">抱歉，您访问的页面不存在</p>
      <p class="error-tip">可能是该页面需要更高的会员权限，或链接已失效</p>
      <el-button type="primary" size="large" @click="goHome">
        <el-icon><House /></el-icon>返回首页
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<style scoped>
.not-found-container {
  min-height: calc(100vh - 120px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.not-found-content {
  text-align: center;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  color: #2d5a45;
  margin: 0;
  line-height: 1;
  text-shadow: 4px 4px 0 rgba(255, 215, 0, 0.3);
}

.error-message {
  font-size: 24px;
  color: #303133;
  margin: 24px 0 12px;
}

.error-tip {
  font-size: 14px;
  color: #909399;
  margin-bottom: 32px;
}
</style>
