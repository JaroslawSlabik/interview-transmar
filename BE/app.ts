import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import './config/redis';
import { authMiddleware } from './middleware/auth.middleware';
import productRoutes from './routes/product.routes';
import assemblyLineRoutes from './routes/assemblyLine.routes';
import workstationRoutes from './routes/workstation.routes';
import allocationRoutes from './routes/allocation.routes';
import authRoutes from './routes/auth.routes';

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://0.0.0.0:4200',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Authentication', 'Referer', 'User-Agent'],
  credentials: true
}));

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use('/auth', authRoutes);
app.use('/products', authMiddleware, productRoutes);
app.use('/assemblylines', authMiddleware, assemblyLineRoutes);
app.use('/workstations', authMiddleware, workstationRoutes);
app.use('/allocations', authMiddleware, allocationRoutes);

const HOST = process.env.HOST || '0.0.0.0';
const PORT = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, HOST, () => {
    console.log(`Backend deweloperski działa na ${HOST}:${PORT}`);
});

export default app;
