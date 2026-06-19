# 鸟类摄影基地 - 掩体预约与链路控制网关系统

一个专业的鸟类摄影基地预约管理系统，包含**网关与权限控管层**和**机位控制层**两大核心系统。

## 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                    前端 (Vue 3 + Pinia)                  │
│  ┌──────────────┐  ┌──────────────────────────────────┐  │
│  │ 动态路由注册  │  │    机位JSON配置动态渲染组件      │  │
│  └──────────────┘  └──────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   后端网关层 (Koa + JWT)                 │
│  ┌────────────────────────────────────────────────────┐  │
│  │  网关与权限控管层：根据会员级别动态下发路由表        │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  机位控制层：基于JSON配置的时段选择与预约管理        │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 技术栈

### 前端
- **Vue 3** - 渐进式 JavaScript 框架
- **Pinia** - Vue 状态管理库
- **Vue Router 4** - 路由管理（支持动态注册）
- **Element Plus** - UI 组件库
- **Axios** - HTTP 请求库
- **Vite** - 下一代前端构建工具

### 后端
- **Koa 2** - 下一代 Node.js Web 框架
- **koa-router** - Koa 路由中间件
- **JWT (jsonwebtoken)** - 身份认证令牌
- **bcryptjs** - 密码加密
- **uuid** - 唯一 ID 生成

## 项目结构

```
cu3/
├── backend/                          # 后端项目
│   ├── package.json
│   └── src/
│       ├── app.js                    # 应用入口
│       ├── config/
│       │   ├── index.js              # 全局配置
│       │   └── routes.js             # 路由配置表（按会员级别）
│       ├── middleware/
│       │   └── auth.js               # JWT 鉴权中间件
│       ├── services/
│       │   ├── authService.js        # 认证与路由下发服务
│       │   ├── blindService.js       # 机位管理服务
│       │   └── bookingService.js     # 预约管理服务
│       ├── routes/
│       │   ├── auth.js               # 认证相关接口
│       │   ├── blinds.js             # 机位相关接口
│       │   └── bookings.js           # 预约相关接口
│       └── data/
│           ├── users.js              # 用户数据（模拟）
│           ├── blinds.js             # 机位配置（JSON）
│           └── bookings.js           # 预约数据（模拟）
│
└── frontend/                         # 前端项目
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.js                   # 应用入口
        ├── App.vue
        ├── styles/
        │   └── global.css
        ├── api/                      # API 接口层
        │   ├── auth.js
        │   ├── blinds.js
        │   └── bookings.js
        ├── utils/
        │   └── request.js            # Axios 封装
        ├── stores/                   # Pinia 状态管理
        │   ├── user.js               # 用户与动态路由管理
        │   └── booking.js            # 预约与机位状态管理
        ├── router/
        │   └── index.js              # 路由实例与守卫
        ├── layouts/
        │   └── MainLayout.vue        # 主布局组件
        └── views/                    # 页面组件
            ├── Home.vue              # 首页
            ├── Login.vue             # 登录页
            ├── Blinds.vue            # 机位预约（核心：动态时段选择）
            ├── MyBookings.vue        # 我的预约
            ├── Profile.vue           # 个人中心
            ├── Gallery.vue           # 作品展示（PRO+）
            ├── VIPLounge.vue         # VIP专区（VIP专属）
            ├── Admin.vue             # 系统管理（VIP专属）
            └── NotFound.vue          # 404页面
```

## 核心功能详解

### 1. 网关与权限控管层

**动态路由下发机制：**

后端根据用户的会员级别返回不同的路由表：

| 会员级别 | 可用路由 | 说明 |
|---------|---------|------|
| GUEST（游客） | Home、Login、Blinds | 仅浏览 |
| BASIC（基础） | Home、Blinds、MyBookings、Profile | 2个机位预约上限 |
| PRO（专业） | 基础+Gallery | 4个机位预约上限 |
| VIP | 全部+VIPLounge、Admin | 无限预约 |

**实现流程：**
1. 用户登录 → 后端返回 JWT Token + 用户信息
2. 前端调用 `/api/auth/routes` 获取该级别对应的路由表
3. 通过 `import.meta.glob` 动态加载组件
4. 调用 `router.addRoute()` 动态注册路由
5. 路由守卫中根据 `meta.requiresAuth` 进行权限校验

### 2. 机位控制层

**基于 JSON 配置的动态时段渲染：**

机位配置完全由 JSON 驱动，每个机位可独立配置时段方案：

```javascript
{
  id: 'blind-001',
  name: '翠鸟专属掩体',
  minLevel: 'BASIC',
  timeSlots: [
    { id: 't1', label: '早场 06:00-09:00', start: '06:00', end: '09:00', price: 200 },
    { id: 't2', label: '上午场 09:00-12:00', start: '09:00', end: '12:00', price: 180 },
    // 可根据不同机位灵活配置不同数量、价格的时段
  ]
}
```

前端 `Blinds.vue` 根据返回的 `timeSlots` 数组动态渲染时段选择卡片，
自动处理可用状态、价格显示、预约冲突检测。

## 快速开始

### 启动后端服务

```bash
cd backend
npm install
npm run dev
```

后端服务运行在 `http://localhost:3000`

### 启动前端服务

```bash
cd frontend
npm install
npm run dev
```

前端服务运行在 `http://localhost:5173`

## 测试账号

| 用户名 | 密码 | 会员级别 | 可访问机位 |
|-------|------|---------|-----------|
| admin | 123456 | VIP会员 | 全部5个机位 |
| photographer_pro | 123456 | 专业会员 | 翠鸟、鹭鸟、湿地 |
| photographer_basic | 123456 | 基础会员 | 翠鸟、湿地 |

## API 接口文档

### 认证接口

| 方法 | 路径 | 说明 | 鉴权 |
|-----|------|------|------|
| POST | /api/auth/login | 用户登录 | 否 |
| GET | /api/auth/routes | 获取当前用户路由表 | 是 |
| GET | /api/auth/routes/guest | 获取游客路由表 | 否 |
| GET | /api/auth/profile | 获取用户信息 | 是 |

### 机位接口

| 方法 | 路径 | 说明 | 鉴权 |
|-----|------|------|------|
| GET | /api/blinds | 获取机位列表（按权限过滤） | 可选 |
| GET | /api/blinds/:id | 获取机位详情 | 可选 |
| GET | /api/blinds/:id/slots | 获取机位某日可用时段 | 可选 |

### 预约接口

| 方法 | 路径 | 说明 | 鉴权 |
|-----|------|------|------|
| GET | /api/bookings | 获取当前用户预约列表 | 是 |
| GET | /api/bookings/:id | 获取预约详情 | 是 |
| POST | /api/bookings | 创建新预约 | 是 |
| POST | /api/bookings/:id/cancel | 取消预约 | 是 |

## 设计亮点

1. **真正的动态路由**：路由完全由后端下发，前端无需硬编码权限路由表
2. **组件动态加载**：使用 Vite 的 `import.meta.glob` 实现组件按需加载映射
3. **配置驱动的机位**：新增机位只需修改 JSON，无需改动前端代码
4. **时段灵活配置**：每个机位可独立设置时段数量、时长、价格
5. **多级别会员体系**：4级权限体系，路由、机位、预约数全面隔离
6. **多文件架构**：前后端均按职责分层，services/middleware/routes 清晰分离
