const { v4: uuidv4 } = require('uuid');
let bookings = require('../data/bookings');
const config = require('../config');
const blindService = require('./blindService');

const getUserBookings = (userId) => {
  return bookings
    .filter(b => b.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const getBookingById = (id, userId = null) => {
  const booking = bookings.find(b => b.id === id);
  if (!booking) return null;
  if (userId && booking.userId !== userId) return null;
  return booking;
};

const createBooking = (userId, bookingData, userLevel) => {
  const { blindId, date, timeSlotId } = bookingData;

  const blind = blindService.getBlindById(blindId, userLevel);
  if (!blind) {
    return { success: false, message: '机位不存在或无权限访问' };
  }

  const timeSlot = blind.timeSlots.find(t => t.id === timeSlotId);
  if (!timeSlot) {
    return { success: false, message: '时段不存在' };
  }

  const conflict = bookings.find(
    b => b.blindId === blindId && 
         b.date === date && 
         b.timeSlotId === timeSlotId && 
         b.status !== 'cancelled'
  );

  if (conflict) {
    return { success: false, message: '该时段已被预约' };
  }

  const userConfirmedBookings = bookings.filter(
    b => b.userId === userId && b.status === 'confirmed'
  );
  const maxBlinds = config.memberLevels[userLevel]?.maxBlinds ?? 0;
  
  if (userConfirmedBookings.length >= maxBlinds) {
    return { 
      success: false, 
      message: `您的会员等级最多同时预约 ${maxBlinds} 个机位` 
    };
  }

  const newBooking = {
    id: 'booking-' + uuidv4().split('-')[0],
    userId,
    blindId,
    blindName: blind.name,
    date,
    timeSlotId,
    timeSlotLabel: timeSlot.label,
    price: timeSlot.price,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  bookings.push(newBooking);
  return { success: true, booking: newBooking };
};

const cancelBooking = (id, userId) => {
  const index = bookings.findIndex(b => b.id === id && b.userId === userId);
  
  if (index === -1) {
    return { success: false, message: '预约不存在' };
  }

  if (bookings[index].status === 'cancelled') {
    return { success: false, message: '预约已取消' };
  }

  bookings[index].status = 'cancelled';
  bookings[index].cancelledAt = new Date().toISOString();
  
  return { success: true, booking: bookings[index] };
};

module.exports = {
  getUserBookings,
  getBookingById,
  createBooking,
  cancelBooking
};
