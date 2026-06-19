const bookings = [
  {
    id: 'booking-001',
    userId: 'user-002',
    blindId: 'blind-001',
    blindName: '翠鸟专属掩体',
    date: '2024-06-25',
    timeSlotId: 't1',
    timeSlotLabel: '早场 06:00-09:00',
    price: 200,
    status: 'confirmed',
    createdAt: '2024-06-20T10:30:00.000Z'
  },
  {
    id: 'booking-002',
    userId: 'user-002',
    blindId: 'blind-004',
    blindName: '湿地林鸟掩体',
    date: '2024-06-26',
    timeSlotId: 't2',
    timeSlotLabel: '中场 09:30-12:30',
    price: 130,
    status: 'confirmed',
    createdAt: '2024-06-20T11:00:00.000Z'
  },
  {
    id: 'booking-003',
    userId: 'user-003',
    blindId: 'blind-001',
    blindName: '翠鸟专属掩体',
    date: '2024-06-27',
    timeSlotId: 't3',
    timeSlotLabel: '下午场 14:00-17:00',
    price: 180,
    status: 'pending',
    createdAt: '2024-06-21T09:00:00.000Z'
  }
];

module.exports = bookings;
