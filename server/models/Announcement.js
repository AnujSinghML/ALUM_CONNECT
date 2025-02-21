const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  type: { type: String, enum: ['event', 'achievement'], required: true }, // Type: event or achievement
  title: { type: String, required: true }, // Name of event or person
  description: { type: String }, // Only for events
  imageUrl: { type: String, required: true }, // Event image or profile photo
  createdAt: { type: Date, default: Date.now } // Timestamp
});

module.exports = mongoose.model('Announcement', announcementSchema);
