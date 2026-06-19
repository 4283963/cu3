const blinds = [
  {
    id: 'blind-001',
    name: '翠鸟专属掩体',
    code: 'KINGFISHER',
    description: '位于池塘东侧，专业拍摄翠鸟捕鱼',
    location: 'A区-1号点位',
    minLevel: 'BASIC',
    image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400',
    features: ['单向透视玻璃', '专业三脚架位', '自动喂食器'],
    timeSlots: [
      { id: 't1', label: '早场 06:00-09:00', start: '06:00', end: '09:00', price: 200 },
      { id: 't2', label: '上午场 09:00-12:00', start: '09:00', end: '12:00', price: 180 },
      { id: 't3', label: '下午场 14:00-17:00', start: '14:00', end: '17:00', price: 180 },
      { id: 't4', label: '晚场 17:00-20:00', start: '17:00', end: '20:00', price: 220 }
    ]
  },
  {
    id: 'blind-002',
    name: '鹭鸟观测塔',
    code: 'HERON',
    description: '高架观测塔，俯瞰鹭鸟栖息地',
    location: 'B区-制高点',
    minLevel: 'PRO',
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400',
    features: ['360度全景视野', '高空拍摄平台', '望远镜共享'],
    timeSlots: [
      { id: 't1', label: '清晨专场 05:00-08:00', start: '05:00', end: '08:00', price: 350 },
      { id: 't2', label: '日出场 08:00-11:00', start: '08:00', end: '11:00', price: 300 },
      { id: 't3', label: '归巢场 16:00-19:00', start: '16:00', end: '19:00', price: 320 }
    ]
  },
  {
    id: 'blind-003',
    name: '猛禽摄影棚',
    code: 'RAPTOR',
    description: '专业猛禽拍摄点，配备诱饵系统',
    location: 'C区-山地林区',
    minLevel: 'VIP',
    image: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=400',
    features: ['远程控制系统', '专业灯光设备', '诱饵投放系统', '私人助理'],
    timeSlots: [
      { id: 't1', label: '全日场 06:00-18:00', start: '06:00', end: '18:00', price: 1200 }
    ]
  },
  {
    id: 'blind-004',
    name: '湿地林鸟掩体',
    code: 'WETLAND',
    description: '湿地边缘林鸟观测点，种类丰富',
    location: 'D区-湿地边缘',
    minLevel: 'BASIC',
    image: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=400',
    features: ['隐蔽式掩体', '多重背景选择', '饮水装置'],
    timeSlots: [
      { id: 't1', label: '早场 06:30-09:30', start: '06:30', end: '09:30', price: 150 },
      { id: 't2', label: '中场 09:30-12:30', start: '09:30', end: '12:30', price: 130 },
      { id: 't3', label: '午场 13:30-16:30', start: '13:30', end: '16:30', price: 130 },
      { id: 't4', label: '晚场 16:30-19:30', start: '16:30', end: '19:30', price: 160 }
    ]
  },
  {
    id: 'blind-005',
    name: 'VIP专属棚',
    code: 'VIP_EXCLUSIVE',
    description: '顶级独立摄影棚，专属服务',
    location: 'E区-VIP专区',
    minLevel: 'VIP',
    image: 'https://images.unsplash.com/photo-1507666405895-422eee7d517f?w=400',
    features: ['独立休息区', '专业设备出租', '专属导摄', '餐饮服务', '无线网络'],
    timeSlots: [
      { id: 't1', label: '半日场 06:00-12:00', start: '06:00', end: '12:00', price: 800 },
      { id: 't2', label: '半日场 12:00-18:00', start: '12:00', end: '18:00', price: 800 },
      { id: 't3', label: '全日场 06:00-18:00', start: '06:00', end: '18:00', price: 1500 }
    ]
  }
];

module.exports = blinds;
