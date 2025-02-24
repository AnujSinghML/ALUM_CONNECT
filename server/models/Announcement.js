const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  type: { type: String, enum: ['event', 'achievement'], required: true }, // Type: event or achievement
  
  // Fields for events
  title: { type: String, required: function () { return this.type === 'event'; } }, // Required for events
  description: { type: String, required: function () { return this.type === 'event'; } }, // Only for events

  // Fields for achievements
  name: { type: String, required: function () { return this.type === 'achievement'; } }, // Required for achievements

  // Image for event or profile photo for achievement
  imageUrl: { type: String, required: function () { return this.type === 'event'; } }, 

  createdAt: { type: Date, default: Date.now } // Timestamp
});

module.exports = mongoose.model('Announcement', announcementSchema);

