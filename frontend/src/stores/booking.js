import { defineStore } from 'pinia';
import { getBookings, createBooking, cancelBooking } from '@/api/bookings';
import { getBlinds, getBlindDetail, getBlindSlots } from '@/api/blinds';

export const useBookingStore = defineStore('booking', {
  state: () => ({
    blinds: [],
    bookings: [],
    currentBlind: null,
    currentSlots: [],
    loading: false
  }),

  getters: {
    confirmedBookings: (state) => state.bookings.filter(b => b.status === 'confirmed'),
    cancelledBookings: (state) => state.bookings.filter(b => b.status === 'cancelled')
  },

  actions: {
    async fetchBlinds() {
      this.loading = true;
      try {
        const res = await getBlinds();
        this.blinds = res.data;
        return res.data;
      } finally {
        this.loading = false;
      }
    },

    async fetchBlindDetail(id) {
      this.loading = true;
      try {
        const res = await getBlindDetail(id);
        this.currentBlind = res.data;
        return res.data;
      } finally {
        this.loading = false;
      }
    },

    async fetchBlindSlots(id, date) {
      this.loading = true;
      try {
        const res = await getBlindSlots(id, date);
        this.currentSlots = res.data.slots;
        return res.data;
      } finally {
        this.loading = false;
      }
    },

    async fetchBookings() {
      this.loading = true;
      try {
        const res = await getBookings();
        this.bookings = res.data;
        return res.data;
      } finally {
        this.loading = false;
      }
    },

    async createNewBooking(data) {
      this.loading = true;
      try {
        const res = await createBooking(data);
        this.bookings.unshift(res.data);
        return res.data;
      } finally {
        this.loading = false;
      }
    },

    async cancelBookingById(id) {
      this.loading = true;
      try {
        const res = await cancelBooking(id);
        const index = this.bookings.findIndex(b => b.id === id);
        if (index !== -1) {
          this.bookings[index] = res.data;
        }
        return res.data;
      } finally {
        this.loading = false;
      }
    }
  }
});
