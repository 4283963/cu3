const blinds = require('../data/blinds');
const authService = require('./authService');

const getAllBlinds = (userLevel = 'GUEST') => {
  return blinds
    .filter(blind => authService.verifyLevelAccess(userLevel, blind.minLevel))
    .map(blind => ({
      id: blind.id,
      name: blind.name,
      code: blind.code,
      description: blind.description,
      location: blind.location,
      minLevel: blind.minLevel,
      image: blind.image,
      features: blind.features,
      timeSlots: blind.timeSlots
    }));
};

const getBlindById = (id, userLevel = 'GUEST') => {
  const blind = blinds.find(b => b.id === id);
  if (!blind) return null;
  if (!authService.verifyLevelAccess(userLevel, blind.minLevel)) return null;
  return blind;
};

const getAvailableSlots = (blindId, date, existingBookings) => {
  const blind = blinds.find(b => b.id === blindId);
  if (!blind) return [];

  const bookedSlotIds = existingBookings
    .filter(b => b.blindId === blindId && b.date === date && b.status !== 'cancelled')
    .map(b => b.timeSlotId);

  return blind.timeSlots.map(slot => ({
    ...slot,
    available: !bookedSlotIds.includes(slot.id)
  }));
};

module.exports = {
  getAllBlinds,
  getBlindById,
  getAvailableSlots
};
