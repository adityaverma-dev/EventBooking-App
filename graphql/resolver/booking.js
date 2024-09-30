const Event = require('../../models/event')
const Booking = require('../../models/booking');
const { transformBooking, transformEvent} = require('./merge')



module.exports = {
 
    bookings: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Unauthenticated')

        }
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            })

        }
        catch (err) {
            throw err;
        }
    },

    bookEvent: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Unauthenticated')

        }
        try {
            // Fetch the event by ID
            const fetchedEvent = await Event.findById(args.eventId);


            // Create a new booking with proper ObjectId references
            const booking = new Booking({
                user: "66e8c507ebb075717c82700c", // Use the ObjectId of the user
                event: fetchedEvent
            });

            const result = await booking.save();

            return transformBooking(result);
        } catch (err) {
            throw err;
        }
    },
    cancelBooking: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Unauthenticated')

        }
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking._doc.event);
            await Booking.deleteOne({ _id: args.bookingId });
            return event;

        } catch (err) {
            throw err;
        }
    }
}    