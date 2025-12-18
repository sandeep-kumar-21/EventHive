const Event = require('../models/Event');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "FALLBACK_KEY");

// @desc    Get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email'); // Populate creator details
    if (event) res.json(event);
    else res.status(404).json({ message: 'Event not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create event
const createEvent = async (req, res) => {
  const { title, description, date, time, location, category, capacity, imageUrl } = req.body;
  try {
    const event = await Event.create({
      title, description, date, time, location, category, capacity, imageUrl,
      createdBy: req.user._id
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update Event
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete Event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    RSVP to Event (Critical Business Logic)
const rsvpEvent = async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user._id;

  try {
    // ATOMIC OPERATION:
    // 1. Check if user is NOT already in attendees ($ne: userId) -> Enforces "No Duplicates"
    // 2. Check if attendees count is LESS than capacity ($expr: $lt) -> Enforces "Capacity" & "Concurrency"
    
    const updatedEvent = await Event.findOneAndUpdate(
      { 
        _id: eventId, 
        attendees: { $ne: userId }, 
        $expr: { $lt: [{ $size: "$attendees" }, "$capacity"] } 
      },
      { 
        $push: { attendees: userId } 
      },
      { new: true }
    );

    // If no document was updated, it means either:
    // a) The user already RSVPed
    // b) The event is full
    if (!updatedEvent) {
      // Let's check specifically why it failed to give a good error message
      const event = await Event.findById(eventId);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      
      if (event.attendees.includes(userId)) {
        return res.status(400).json({ message: 'You have already RSVPed to this event' });
      } else if (event.attendees.length >= event.capacity) {
        return res.status(400).json({ message: 'Event is at full capacity' });
      }
    }

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel RSVP
const cancelRsvp = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $pull: { attendees: req.user._id } },
      { new: true }
    );
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate AI Description
// @route   POST /api/events/ai-generate
const generateAIDescription = async (req, res) => {
  const { title, category, location, date } = req.body;

  if (!title || !category) {
    return res.status(400).json({ message: 'Title and Category are required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Write an engaging, professional, and exciting event description for a ${category} event titled "${title}".
      The event is happening at ${location || 'a TBD location'} on ${date || 'an upcoming date'}.
      Keep the tone enthusiastic but professional.
      Limit the response to maximum 3 short paragraphs.
      Do not include markdown formatting (like **bold**), just plain text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ description: text });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: 'Failed to generate description' });
  }
};

module.exports = { 
  getEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  rsvpEvent, 
  cancelRsvp,
  generateAIDescription 
};