import { defineStore } from 'pinia';
import { getBookings, createBooking, cancelBooking } from '@/api/bookings';
import { getBlinds, getBlindDetail, getBlindSlots } from '@/api/blinds';

export const useBookingStore = defineStore('booking', {
  state: () => ({
    blinds: [],
    bookings: [],
    currentBlind: null,
    currentSlots: [],
    loading: {
      blinds: false,
      blindDetail: false,
      slots: false,
      bookings: false,
      createBooking: false,
      cancelBooking: false
    }
  }),

  getters: {
    confirmedBookings: (state) => state.bookings.filter(b => b.status === 'confirmed'),
    cancelledBookings: (state) => state.bookings.filter(b => b.status === 'cancelled'),
    isLoading: (state) => Object.values(state.loading).some(v => v)
  },

  actions: {
    async fetchBlinds() {
      this.loading.blinds = true;
      try {
        const res = await getBlinds();
        this.blinds = res.data;
        return res.data;
      } finally {
        this.loading.blinds = false;
      }
    },

    async fetchBlindDetail(id) {
      this.loading.blindDetail = true;
      try {
        const res = await getBlindDetail(id);
        this.currentBlind = res.data;
        return res.data;
      } finally {
        this.loading.blindDetail = false;
      }
    },

    async fetchBlindSlots(id, date) {
      this.loading.slots = true;
      try {
        const res = await getBlindSlots(id, date);
        this.currentSlots = res.data.slots;
        return res.data;
      } finally {
        this.loading.slots = false;
      }
    },

    async fetchBookings() {
      this.loading.bookings = true;
      try {
        const res = await getBookings();
        this.bookings = res.data;
        return res.data;
      } finally {
        this.loading.bookings = false;
      }
    },

    async createNewBooking(data) {
      this.loading.createBooking = true;
      try {
        const res = await createBooking(data);
        this.bookings = [res.data, ...this.bookings];
        return res.data;
      } finally {
        this.loading.createBooking = false;
      }
    },

    async cancelBookingById(id) {
      this.loading.cancelBooking = true;
      try {
        const res = await cancelBooking(id);
        this.bookings = this.bookings.map(b => b.id === id ? res.data : b);
        return res.data;
      } finally {
        this.loading.cancelBooking = false;
      }
    }
  }
});
