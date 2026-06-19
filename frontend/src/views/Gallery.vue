<template>
  <div class="gallery-page page-container">
    <div class="page-header">
      <h2><el-icon><Picture /></el-icon>作品展示</h2>
      <p class="page-desc">专业会员及以上专享 · 摄影师优秀鸟类作品欣赏</p>
    </div>

    <div class="gallery-grid">
      <el-card
        v-for="(photo, idx) in galleryPhotos"
        :key="idx"
        shadow="hover"
        class="photo-card"
      >
        <img :src="photo.url" :alt="photo.title" class="photo-image" />
        <div class="photo-info">
          <h4>{{ photo.title }}</h4>
          <div class="photo-meta">
            <span><el-icon><User /></el-icon>{{ photo.author }}</span>
            <span><el-icon><Location /></el-icon>{{ photo.location }}</span>
          </div>
          <div class="photo-tags">
            <el-tag v-for="(tag, i) in photo.tags" :key="i" size="small" type="info">
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const galleryPhotos = ref([
  {
    title: '翠鸟捕鱼瞬间',
    author: '专业摄影师老王',
    location: '翠鸟专属掩体',
    tags: ['翠鸟', '飞行', '捕食'],
    url: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600'
  },
  {
    title: '鹭鸟晨光',
    author: 'VIP会员张先生',
    location: '鹭鸟观测塔',
    tags: ['白鹭', '日出', '剪影'],
    url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600'
  },
  {
    title: '猛禽翱翔',
    author: 'VIP会员李先生',
    location: '猛禽摄影棚',
    tags: ['雄鹰', '高空', '翱翔'],
    url: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=600'
  },
  {
    title: '林鸟枝头',
    author: '专业摄影师老王',
    location: '湿地林鸟掩体',
    tags: ['林鸟', '栖息', '特写'],
    url: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=600'
  },
  {
    title: '水鸟群飞',
    author: 'VIP会员赵女士',
    location: 'VIP专属棚',
    tags: ['水鸟', '群飞', '湿地'],
    url: 'https://images.unsplash.com/photo-1507666405895-422eee7d517f?w=600'
  },
  {
    title: '珍稀鸟类',
    author: 'VIP会员王先生',
    location: 'VIP专属棚',
    tags: ['珍稀', '保护', '记录'],
    url: 'https://images.unsplash.com/photo-1522858547137-f1dcec554f55?w=600'
  }
]);
</script>

<style scoped>
.gallery-page {
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

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.photo-card {
  overflow: hidden;
}

.photo-image {
  width: calc(100% + 40px);
  height: 220px;
  object-fit: cover;
  margin: -20px -20px 0;
  transition: transform 0.3s;
}

.photo-card:hover .photo-image {
  transform: scale(1.05);
}

.photo-info {
  padding-top: 16px;
}

.photo-info h4 {
  margin: 0 0 10px;
  font-size: 16px;
  color: #303133;
}

.photo-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.photo-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
}

.photo-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
