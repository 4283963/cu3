import request from '@/utils/request';

export const login = (data) => {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  });
};

export const getRoutes = () => {
  return request({
    url: '/auth/routes',
    method: 'get'
  });
};

export const getGuestRoutes = () => {
  return request({
    url: '/auth/routes/guest',
    method: 'get'
  });
};

export const getProfile = () => {
  return request({
    url: '/auth/profile',
    method: 'get'
  });
};
