const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const users = require('../data/users');
const routeConfig = require('../config/routes');

const findUserByUsername = (username) => {
  return users.find(u => u.username === username);
};

const findUserById = (id) => {
  return users.find(u => u.id === id);
};

const login = async (username, password) => {
  const user = findUserByUsername(username);
  
  if (!user) {
    return { success: false, message: '用户名或密码错误' };
  }

  const isValid = await bcrypt.compare(password, user.password);
  
  if (!isValid) {
    return { success: false, message: '用户名或密码错误' };
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      level: user.level,
      nickname: user.nickname
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  const userInfo = {
    id: user.id,
    username: user.username,
    nickname: user.nickname,
    avatar: user.avatar,
    level: user.level,
    levelName: config.memberLevels[user.level].name,
    maxBlinds: config.memberLevels[user.level].maxBlinds,
    createdAt: user.createdAt
  };

  return {
    success: true,
    token,
    user: userInfo
  };
};

const getRoutesByLevel = (level) => {
  return routeConfig[level] || routeConfig.GUEST;
};

const verifyLevelAccess = (userLevel, requiredLevel) => {
  if (!requiredLevel) return true;
  const userLevelValue = config.memberLevels[userLevel]?.level ?? 0;
  const requiredLevelValue = config.memberLevels[requiredLevel]?.level ?? 0;
  return userLevelValue >= requiredLevelValue;
};

module.exports = {
  findUserByUsername,
  findUserById,
  login,
  getRoutesByLevel,
  verifyLevelAccess
};
