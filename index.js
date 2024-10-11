import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDb from './src/utils/connectDb.js';
import adminRouter from './src/routers/admin.js';
import router from './src/routers/index.js';
import { Server as SocketIo } from 'socket.io';
import { config } from './src/config/index.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = http.createServer(app);

// Port sozlamasi
const PORT = 8080 || process.env.PORT;

// Static fayllar uchun yo'l
app.use(express.static(path.join(__dirname, 'public')));

// favicon.ico uchun endpoint
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

// CORS sozlamalari
const corsOptions = {
    origin: [
        'http://localhost:5173', 
        'https://client.yashnabodmadaniyat.uz', 
        'http://localhost:5174', 
        'http://admin.yashnabodmadaniyat.uz', 
        'http://localhost:5175', 
        'https://teacher.yashnabodmadaniyat.uz'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // OPTIONS methodini qo'shdik
    allowedHeaders: ['Content-Type', 'Authorization', 'token', 'X-Requested-With'], // Qo'shimcha sarlavhalar
    credentials: true // cookies va authentifikatsiya uchun
};

// CORS middleware
app.use(cors(corsOptions));

// Custom headers - Qo'shimcha CORS headlar uchun
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', corsOptions.origin); // Originni sozlaymiz
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        return res.status(200).json({});
    }
    next();
});

// JSON formatda ma'lumotlarni o'qish uchun middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routerlar
app.use('/api/admin', adminRouter);
app.use('/api', router);

// Database bilan ulanish
connectDb();

// Socket.io konfiguratsiyasi
const io = new SocketIo(server, { 
    pingTimeout: 1000, 
    cors: { 
        origin: corsOptions.origin, 
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
        allowedHeaders: ['Content-Type', 'Authorization', 'token'],
        credentials: true 
    }
});

// Socket.io hodisalarini boshqarish
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
