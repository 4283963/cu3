import request from '@/utils/request';

export const getBlinds = () => {
  return request({
    url: '/blinds',
    method: 'get'
  });
};

export const getBlindDetail = (id) => {
  return request({
    url: `/blinds/${id}`,
    method: 'get'
  });
};

export const getBlindSlots = (id, date) => {
  return request({
    url: `/blinds/${id}/slots`,
    method: 'get',
    params: { date }
  });
};
