import request from '@/utils/request';

export const getBookings = () => {
  return request({
    url: '/bookings',
    method: 'get'
  });
};

export const getBookingDetail = (id) => {
  return request({
    url: `/bookings/${id}`,
    method: 'get'
  });
};

export const createBooking = (data) => {
  return request({
    url: '/bookings',
    method: 'post',
    data
  });
};

export const cancelBooking = (id) => {
  return request({
    url: `/bookings/${id}/cancel`,
    method: 'post'
  });
};
