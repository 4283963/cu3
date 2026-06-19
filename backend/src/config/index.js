module.exports = {
  port: process.env.PORT || 3000,
  jwt: {
    secret: 'bird-photography-secret-key-2024',
    expiresIn: '24h'
  },
  memberLevels: {
    GUEST: { level: 0, name: '游客', maxBlinds: 0 },
    BASIC: { level: 1, name: '基础会员', maxBlinds: 2 },
    PRO: { level: 2, name: '专业会员', maxBlinds: 4 },
    VIP: { level: 3, name: 'VIP会员', maxBlinds: 99 }
  }
};
