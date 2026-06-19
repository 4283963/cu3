const Router = require('koa-router');
const bookingService = require('../services/bookingService');
const { authMiddleware } = require('../middleware/auth');

const router = new Router({ prefix: '/api/bookings' });

router.get('/', authMiddleware, async (ctx) => {
  const bookings = bookingService.getUserBookings(ctx.state.user.id);

  ctx.body = {
    code: 200,
    message: '获取预约列表成功',
    data: bookings
  };
});

router.get('/:id', authMiddleware, async (ctx) => {
  const booking = bookingService.getBookingById(ctx.params.id, ctx.state.user.id);

  if (!booking) {
    ctx.status = 404;
    ctx.body = { code: 404, message: '预约不存在' };
    return;
  }

  ctx.body = {
    code: 200,
    data: booking
  };
});

router.post('/', authMiddleware, async (ctx) => {
  const { blindId, date, timeSlotId } = ctx.request.body;

  if (!blindId || !date || !timeSlotId) {
    ctx.status = 400;
    ctx.body = { code: 400, message: '机位ID、日期和时段ID不能为空' };
    return;
  }

  const result = bookingService.createBooking(
    ctx.state.user.id,
    { blindId, date, timeSlotId },
    ctx.state.user.level
  );

  if (!result.success) {
    ctx.status = 400;
    ctx.body = { code: 400, message: result.message };
    return;
  }

  ctx.status = 201;
  ctx.body = {
    code: 201,
    message: '预约成功',
    data: result.booking
  };
});

router.post('/:id/cancel', authMiddleware, async (ctx) => {
  const result = bookingService.cancelBooking(ctx.params.id, ctx.state.user.id);

  if (!result.success) {
    ctx.status = 400;
    ctx.body = { code: 400, message: result.message };
    return;
  }

  ctx.body = {
    code: 200,
    message: '取消预约成功',
    data: result.booking
  };
});

module.exports = router;
