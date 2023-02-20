//express
const express = require('express');
const app = express();

//packages
require('express-async-errors');

//database
const connect = require('./database/connect');

//routes
const authRouter = require('./routes/authRoutes');
const postRouter = require('./routes/postRoutes');
const commentRouter = require('./routes/commentRoutes');

//environment variables
require('dotenv').config();

//middleware
const errorHandlerMiddleware = require('./middleware/errorHandler');
const notFoundMiddleware = require('./middleware/notFound');
const fileParser = require('express-fileupload');
const authUser = require('./middleware/auth');
const cookieParser = require('cookie-parser');

//express middleware that detects and parses json body
app.use(express.static('./public'));
app.use(express.json())
app.use(fileParser());
app.use(cookieParser(process.env.COOKIE_SECRET));


app.use('/api/auth', authRouter);
app.use('/api/posts', authUser, postRouter);
app.use('/api/comments', authUser, commentRouter);

//error handling middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);



//start function
//attemps to start database connect
//if successful then also start the server
const PORT = process.env.PORT || 3000;
const start = async () => {
    try {
        await connect(process.env.MONGO_URL);
        app.listen(PORT, () => {
            console.log(`server listening on port ${PORT}`);
        })
    } catch (error) {
        console.log(error.message);
    }
}
start();