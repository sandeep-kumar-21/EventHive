const express = require('express');
const { getEvents, getEventById, createEvent, rsvpEvent, cancelRsvp, updateEvent, deleteEvent, generateAIDescription } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/ai-generate', protect, generateAIDescription);

router.get('/', getEvents);
router.get('/:id', getEventById);

router.post('/', protect, createEvent);
router.put('/:id', protect, updateEvent);   
router.delete('/:id', protect, deleteEvent);

router.put('/:id/rsvp', protect, rsvpEvent);
router.put('/:id/cancel', protect, cancelRsvp);

module.exports = router;