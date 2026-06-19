const Router = require('koa-router');
const authService = require('../services/authService');
const { authMiddleware } = require('../middleware/auth');

const router = new Router({ prefix: '/api/auth' });

router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    ctx.status = 400;
    ctx.body = { code: 400, message: '用户名和密码不能为空' };
    return;
  }

  const result = await authService.login(username, password);

  if (!result.success) {
    ctx.status = 401;
    ctx.body = { code: 401, message: result.message };
    return;
  }

  ctx.body = {
    code: 200,
    message: '登录成功',
    data: {
      token: result.token,
      user: result.user
    }
  };
});

router.get('/routes', authMiddleware, async (ctx) => {
  const user = ctx.state.user;
  const routes = authService.getRoutesByLevel(user.level);

  ctx.body = {
    code: 200,
    message: '获取路由成功',
    data: {
      routes,
      userLevel: user.level
    }
  };
});

router.get('/routes/guest', async (ctx) => {
  const routes = authService.getRoutesByLevel('GUEST');

  ctx.body = {
    code: 200,
    message: '获取路由成功',
    data: {
      routes,
      userLevel: 'GUEST'
    }
  };
});

router.get('/profile', authMiddleware, async (ctx) => {
  const user = authService.findUserById(ctx.state.user.id);

  if (!user) {
    ctx.status = 404;
    ctx.body = { code: 404, message: '用户不存在' };
    return;
  }

  const config = require('../config');

  ctx.body = {
    code: 200,
    data: {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar,
      level: user.level,
      levelName: config.memberLevels[user.level].name,
      maxBlinds: config.memberLevels[user.level].maxBlinds,
      createdAt: user.createdAt
    }
  };
});

module.exports = router;
