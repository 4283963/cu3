const jwt = require('jsonwebtoken');
const config = require('../config');

const authMiddleware = async (ctx, next) => {
  const authHeader = ctx.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ctx.status = 401;
    ctx.body = { code: 401, message: '未提供认证令牌' };
    return;
  }

  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    ctx.state.user = decoded;
    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = { code: 401, message: '令牌无效或已过期' };
  }
};

const optionalAuthMiddleware = async (ctx, next) => {
  const authHeader = ctx.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      ctx.state.user = decoded;
    } catch (err) {
      ctx.state.user = null;
    }
  } else {
    ctx.state.user = null;
  }
  
  await next();
};

module.exports = { authMiddleware, optionalAuthMiddleware };
