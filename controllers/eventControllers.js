const path = require("path");
const eventModel = require("../models/eventModel");
const fs = require("fs");

const createEvent = async (req, res) => {
    const {
        eventTitle,
        eventPrice,
        eventCategory,
        eventDescription
    } = req.body;

    if (!eventTitle || !eventPrice || !eventCategory || !eventDescription) {
        return res.status(400).json({
            "success": false,
            "message": "Please enter all fields"
        })
    }

    if (!req.files || !req.files.eventImage) {
        return res.status(400).json({
            "success": false,
            "message": "Image not found"
        })
    }

    const { eventImage } = req.files;

    const imageName = `${Date.now()}-${eventImage.name}`
    const imageUploadPath = path.join(__dirname, `../public/eventMain/${imageName}`)

    try {
        await eventImage.mv(imageUploadPath)

        const newEvent = new eventModel({
            eventTitle: eventTitle,
            eventPrice: eventPrice,
            eventCategory: eventCategory,
            eventDescription: eventDescription,
            eventImage: imageName
        })
        const event = await newEvent.save()
        res.status(201).json({
            "success": true,
            "message": "Event created successfully",
            "data": event
        })
    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": "Internal server error",
            "error": error
        })
    }
};

const getAllEvents = async (req, res) => {

    try {
        const allEvent = await eventModel.find({});
        res.status(201).json({
            "success": true,
            "message": "Event fetched successfully",
            "Event": allEvent
        })
    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": "Internal server error",
            "error": error
        })
    }
}

const getSingleEvent = async (req, res) => {
    const eventId = req.params.id;

    try {
        const event = await eventModel.findById(eventId);
        if (!event) {
            return res.status(400).json({
                "success": false,
                "message": "Event not found"
            })
        }

        event.views++;
        await event.save();

        res.status(201).json({
            "success": true,
            "message": "Event fetched successfully",
            "Event": event
        })
    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": "Internal server error",
            "error": error
        })
    }
}

const deleteEvent = async (req, res) => {
    try {
        await eventModel.findByIdAndDelete(req.params.id);
        res.status(201).json({
            "success": true,
            "message": "Event deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": "Internal server error",
            "error": error
        })
    }
}

const updateEvent = async (req, res) => {
    try {
        if (req.files && req.files.eventImage) {
            const { eventImage } = req.files;
            const imageName = `${Date.now()}-${eventImage.name}`
            const imageUploadPath = path.join(__dirname, `../public/eventMain/${imageName}`)

            await eventImage.mv(imageUploadPath)
            req.body.eventImage = imageName;

            if (req.body.eventImage) {
                const existingEvent = await eventModel.findById(req.params.id);
                const oldImagePath = path.join(__dirname, `../public/eventMain/${existingEvent.eventImage}`);
                fs.unlinkSync(oldImagePath);
            }
        }

        const updateEvent = await eventModel.findByIdAndUpdate(req.params.id, req.body);
        res.status(201).json({
            success: true,
            message: "Event updated successfully",
            event: updateEvent
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        })
    }
}

const paginationEvent = async (req, res) => {
    try {

        const PageNo = parseInt(req.query.page) || 1;
        const resultPerPage = parseInt(req.query.limit) || 2;

        // Search query
        const searchQuery = req.query.q || '';
        const sortOrder = req.query.sort || 'asc';

        const filter = {};
        if (searchQuery) {
            filter.eventTitle = { $regex: searchQuery, $options: 'i' };
        }

        const sort = sortOrder === 'asc' ? { eventPrice: 1 } : { eventPrice: -1 };

        const events = await eventModel
            .find(filter)
            .skip((PageNo - 1) * resultPerPage)
            .limit(resultPerPage)
            .sort(sort);

        if (events.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No events found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Events fetched successfully",
            event: events,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error,
        });
    }
}

const getEventCount = async (req, res) => {
    try {
        const eventCount = await eventModel.countDocuments({});
        res.status(200).json({
            success: true,
            message: "Event count fetched successfully",
            eventCount: eventCount,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error,
        });
    }
}

module.exports = {
    createEvent,
    getAllEvents,
    getSingleEvent,
    deleteEvent,
    updateEvent,
    paginationEvent,
    getEventCount
};