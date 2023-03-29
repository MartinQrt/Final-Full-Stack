import { config } from "dotenv";
config();
import { connectToDb } from "./config/dbConfig";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./routes";
import { UserModel } from "./models/users";
import { hashPassword } from "./utils/passwordUtils";

connectToDb();

const app = express();
const PORT = process.env.port || 8080;

const seedInitialAdmin =async () => {
    const user = await UserModel.findOne({email: 'admin@admin.com'});
    if (user) {
    return;
    }

    console.log('Seeding initial admin');

    const initialAdmin = new UserModel({
        email: 'admin@admin.lt',
        password: await hashPassword('admin'),
        full_name: 'Admin administrator',
        reg_timestamp: Date.now(),
    });

    initialAdmin.save();

    console.log('Seeding successful');
}

app.use(cors(), express.json(), cookieParser());
app.use(router);

app.listen(PORT, () => console.log(`Server is running on: ${PORT}`));

seedInitialAdmin();