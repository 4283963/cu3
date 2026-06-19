const Koa = require('koa');
const cors = require('koa-cors');
const bodyParser = require('koa-bodyparser');
const config = require('./config');

const authRoutes = require('./routes/auth');
const blindRoutes = require('./routes/blinds');
const bookingRoutes = require('./routes/bookings');

const app = new Koa();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  headers: ['Content-Type', 'Authorization']
}));

app.use(bodyParser());

app.use(async (ctx, next) => {
  console.log(`[${new Date().toISOString()}] ${ctx.method} ${ctx.url}`);
  try {
    await next();
  } catch (err) {
    console.error('Server Error:', err);
    ctx.status = err.status || 500;
    ctx.body = {
      code: ctx.status,
      message: err.message || '服务器内部错误'
    };
  }
});

app.use(authRoutes.routes()).use(authRoutes.allowedMethods());
app.use(blindRoutes.routes()).use(blindRoutes.allowedMethods());
app.use(bookingRoutes.routes()).use(bookingRoutes.allowedMethods());

app.use(async (ctx) => {
  if (ctx.path === '/') {
    ctx.body = {
      name: '鸟类摄影基地掩体预约与链路控制网关系统',
      version: '1.0.0',
      status: 'running',
      docs: {
        auth: '/api/auth/*',
        blinds: '/api/blinds/*',
        bookings: '/api/bookings/*'
      }
    };
  } else if (ctx.status === 404) {
    ctx.body = { code: 404, message: '接口不存在' };
  }
});

app.listen(config.port, () => {
  console.log(`\n🦅 鸟类摄影基地网关系统已启动`);
  console.log(`📍 服务地址: http://localhost:${config.port}`);
  console.log(`📋 测试账号:`);
  console.log(`   - admin / 123456 (VIP会员)`);
  console.log(`   - photographer_pro / 123456 (专业会员)`);
  console.log(`   - photographer_basic / 123456 (基础会员)\n`);
});
