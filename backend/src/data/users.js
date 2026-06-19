const bcrypt = require('bcryptjs');

const users = [
  {
    id: 'user-001',
    username: 'admin',
    password: bcrypt.hashSync('123456', 10),
    nickname: '系统管理员',
    level: 'VIP',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'user-002',
    username: 'photographer_pro',
    password: bcrypt.hashSync('123456', 10),
    nickname: '专业摄影师老王',
    level: 'PRO',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pro',
    createdAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: 'user-003',
    username: 'photographer_basic',
    password: bcrypt.hashSync('123456', 10),
    nickname: '摄影爱好者小李',
    level: 'BASIC',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=basic',
    createdAt: '2024-02-01T00:00:00.000Z'
  }
];

module.exports = users;
