import express from "express"
import morgan from "morgan"
import cors from "cors"
import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"
const app  = express()

app.use(cors({
    origin:"*"
    // credentials: true
}))

app.use(morgan("dev"))
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/user', userRoutes)

app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Welcome to Sharp Money APIs' });
});

app.all('*', (req, res) => {
    return res.status(404).json({ message: 'Route not found' });
});

export default app