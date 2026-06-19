<template>
  <div class="login-container">
    <div class="login-bg"></div>
    <div class="login-box">
      <div class="login-header">
        <el-icon class="login-icon"><Camera /></el-icon>
        <h1>鸟类摄影基地</h1>
        <p>掩体预约与链路控制网关系统</p>
      </div>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            size="large"
            :prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-button
          type="primary"
          size="large"
          class="login-btn"
          :loading="loading"
          @click="handleLogin"
        >
          登 录
        </el-button>
      </el-form>
      <div class="login-tips">
        <el-alert type="info" :closable="false">
          <template #title>
            <div class="tips-content">
              <p><strong>测试账号：</strong></p>
              <p>VIP会员: admin / 123456</p>
              <p>专业会员: photographer_pro / 123456</p>
              <p>基础会员: photographer_basic / 123456</p>
            </div>
          </template>
        </el-alert>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const formRef = ref(null);
const loading = ref(false);
const form = reactive({
  username: '',
  password: ''
});

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};

const handleLogin = async () => {
  try {
    await formRef.value.validate();
    loading.value = true;
    await userStore.login(form.username, form.password);
    ElMessage.success('登录成功');
    const redirect = route.query.redirect || '/';
    router.push(redirect);
  } catch (err) {
    if (err !== false) {
      console.error('登录失败:', err);
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  position: relative;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #1a3d2e 0%, #2d5a45 50%, #1e4a38 100%);
  z-index: 0;
}

.login-bg::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background-image: radial-gradient(circle at 30% 50%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
                    radial-gradient(circle at 70% 80%, rgba(74, 144, 226, 0.1) 0%, transparent 50%);
}

.login-box {
  position: relative;
  z-index: 1;
  width: 420px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-icon {
  font-size: 48px;
  color: #2d5a45;
  margin-bottom: 12px;
}

.login-header h1 {
  font-size: 26px;
  color: #1a3d2e;
  margin-bottom: 8px;
}

.login-header p {
  font-size: 14px;
  color: #909399;
}

.login-form {
  margin-bottom: 20px;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  background: linear-gradient(135deg, #2d5a45 0%, #1a3d2e 100%);
  border: none;
}

.login-btn:hover {
  opacity: 0.9;
}

.tips-content {
  font-size: 12px;
  line-height: 1.8;
}

.tips-content p {
  margin: 2px 0;
}
</style>
