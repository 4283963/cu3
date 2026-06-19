const Router = require('koa-router');
const blindService = require('../services/blindService');
const { optionalAuthMiddleware } = require('../middleware/auth');

const router = new Router({ prefix: '/api/blinds' });

router.get('/', optionalAuthMiddleware, async (ctx) => {
  const userLevel = ctx.state.user?.level || 'GUEST';
  const blinds = blindService.getAllBlinds(userLevel);

  ctx.body = {
    code: 200,
    message: '获取机位列表成功',
    data: blinds
  };
});

router.get('/:id', optionalAuthMiddleware, async (ctx) => {
  const userLevel = ctx.state.user?.level || 'GUEST';
  const blind = blindService.getBlindById(ctx.params.id, userLevel);

  if (!blind) {
    ctx.status = 404;
    ctx.body = { code: 404, message: '机位不存在或无权限访问' };
    return;
  }

  ctx.body = {
    code: 200,
    data: blind
  };
});

router.get('/:id/slots', optionalAuthMiddleware, async (ctx) => {
  const { date } = ctx.query;
  const userLevel = ctx.state.user?.level || 'GUEST';
  
  const blind = blindService.getBlindById(ctx.params.id, userLevel);
  if (!blind) {
    ctx.status = 404;
    ctx.body = { code: 404, message: '机位不存在或无权限访问' };
    return;
  }

  const bookings = require('../data/bookings');
  const targetDate = date || new Date().toISOString().split('T')[0];
  const slots = blindService.getAvailableSlots(ctx.params.id, targetDate, bookings);

  ctx.body = {
    code: 200,
    data: {
      date: targetDate,
      slots
    }
  };
});

module.exports = router;
