import express from "express"
import morgan from "morgan"
import cors from "cors"
import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"
import servicesRoutes from "./routes/services.routes"
import walletRoutes from "./routes/wallet.routes"
import hookRoutes from "./routes/hook.routes"
import adminRoutes from "./routes/admin.routes"
const app  = express()

app.use(cors({
    origin:"*"
    // credentials: true
}))

app.use(morgan("dev"))
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use(`/wallet`, walletRoutes)
app.use('/services', servicesRoutes)
app.use('/hook', hookRoutes)
app.use('/admin', adminRoutes)
app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Welcome to Sharp Money APIs' });
});

app.all('*', (req, res) => {
    return res.status(404).json({ message: 'Route not found' });
});

export default app