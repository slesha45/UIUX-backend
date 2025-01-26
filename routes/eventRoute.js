const router = require('express').Router();
const eventController = require('../controllers/eventControllers');
const { authGuard } = require("../middleware/authGuard");


router.post('/create', authGuard, eventController.createEvent)
router.get('/get_all_event', eventController.getAllEvents)
router.get('/get_single_event/:id', eventController.getSingleEvent)
router.delete('/delete_event/:id', authGuard, eventController.deleteEvent)
router.put('/update_event/:id', eventController.updateEvent)
router.get('/pagination', eventController.paginationEvent)
router.get('/get_event_count', eventController.getEventCount)

module.exports = router