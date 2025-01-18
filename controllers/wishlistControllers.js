const Wishlist = require('../models/wishlistModel');
const Event = require('../models/eventModel');

const getUserWishlist = async (req, res) => {
  try {
      const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('events');
      if (!wishlist) {
        return res.status(200).json({
            success: true,
            data: []
        });
    }

    res.status(200).json({
        success: true,
        data: wishlist.events 
    });
} catch (error) {
    console.error('Error fetching user wishlist:', error); 
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
    });
}
};

// Add to wishlist
const addToWishlist = async (req, res) => {
  try {
      const { eventId } = req.body;
      const event = await Event.findById(eventId);
      if (!event) {
          return res.status(404).json({
              success: false,
              message: 'Event not found'
          });
      }

      let wishlist = await Wishlist.findOne({ user: req.user._id });

      if (!wishlist) {
          wishlist = new Wishlist({ user: req.user._id, events: [eventId] });
      }  else {
            if (!wishlist.events.includes(eventId)) {
                wishlist.events.push(eventId);
            } else {
                return res.status(200).json({
                    success: true,
                    message: "Event is already in the wishlist"
                });
            }
        }

      await wishlist.save();
      res.status(200).json({
          success: true,
          message: 'Event added to wishlist',
          data: wishlist
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Internal server error',
          error: error.message
      });
  }
};

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
  try {
      const { eventId } = req.params;
      let wishlist = await Wishlist.findOne({ user: req.user._id });

      if (wishlist) {
        wishlist.events = wishlist.events.filter(
            (id) => id.toString() !== eventId
        );
        await wishlist.save();
    }

      res.status(200).json({
          success: true,
          message: 'Event removed from wishlist',
          data: wishlist
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Internal server error',
          error: error.message
      });
  }
};


module.exports = {
  addToWishlist,
  getUserWishlist,
  removeFromWishlist
};