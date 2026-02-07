import dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT) {
    throw new Error("PORT is missing in environment variables.");
}
if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is mising in enviroment variables.");
}
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is mising in enviroment variables.");
}

const PORT = parseInt(process.env.PORT);
const MONGODB_URL = process.env.MONGODB_URL;
const JWT_SECRET = process.env.JWT_SECRET;
export { PORT, MONGODB_URL, JWT_SECRET };