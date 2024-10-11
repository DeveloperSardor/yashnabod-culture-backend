import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDb from "./src/utils/connectDb.js";
import adminRouter from './src/routers/admin.js';
import router from './src/routers/index.js';
import { Server as SocketIo } from 'socket.io';
import { config } from './src/config/index.js';
const app = express();
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const server = http.createServer(app);

const PORT = 8080;

app.use(express.static(path.join(__dirname, 'public')));


app.get('/favicon.ico', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'favicon.ico'))
})
// CORS sozlamalari
const corsOptions = {
  origin: ['http://localhost:5173', 'https://client.yashnabodmadaniyat.uz', 'http://localhost:5174', 'http://admin.yashnabodmadaniyat.uz', 'http://localhost:5175', 'https://teacher.yashnabodmadaniyat.uz'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add methods as needed
  allowedHeaders: ['Content-Type', 'Authorization', 'token'], // Add necessary headers
  credentials: true // If cookies or HTTP authentication are required
};




app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routerlar
app.use('/api/admin', adminRouter);
app.use('/api', router);

// DB bilan ulanish
connectDb();

// Socket.io
const io = new SocketIo(server, { pingTimeout: 1000, cors: { origin: corsOptions.origin, credentials: true } });

// Socket.io uchun sozlamalar
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Serverni ishga tushirish
server.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});
