const express = require("express");
const connectDatabase = require("./database/database");
const dotenv = require("dotenv");
const cors = require("cors");
const acceptFormData = require("express-fileupload")

const app = express();

const corsOptions = {
    origin: true,
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(acceptFormData());
app.use('/public', express.static("./public"));

dotenv.config();

const PORT = process.env.PORT;
connectDatabase();

//Configure routes
app.use('/api/user', require('./routes/userRoute'))
app.use('/api/event', require('./routes/eventRoute'))
app.use('/api/booking', require('./routes/bookingRoute'))
app.use('/api/wishlist', require('./routes/wishlistRoute'))
app.use('/api/review', require('./routes/reviewRoute'))
app.use('/api/contact', require('./routes/contactRoute'))
app.use('/api/plan', require('./routes/planRoute'))
app.use('/api/package', require('./routes/packageRoute'))
app.use('/api/notification', require('./routes/notificationRoutes'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
module.exports = app;