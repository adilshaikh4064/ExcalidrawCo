import express from "express";
import bcrypt from "bcrypt";
import { SigninSchema, UserSchema } from "@repo/common/types";
import prismaClient from "@repo/db/client";
import { config } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import middleware from "./middleware";
import { CustomRequest } from "./types";
import cors from "cors";

const app = express();
const port = config.HTTP_PORT;
const saltRounds = config.SALT_ROUNDS;
const jwtSecret = config.JWT_SECRET;

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.send("server is responding");
});

app.post("/signup", async (req, res) => {
    try {
        const parseResult = UserSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({
                message: "Bad request, invalid input/s.",
                error: parseResult.error.errors,
            });
            return;
        }

        const user = parseResult.data;
        const existingUser = await prismaClient.user.findUnique({
            where: { email: user.email },
        });
        if (existingUser) {
            res.status(409).json({
                message: "Bad request, user already exists",
                error: "please try signing in",
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        const newUser = await prismaClient.user.create({
            data: {
                email: user.email,
                name: user.name,
                password: hashedPassword,
            },
            select: {
                email: true,
                name: true,
                id: true,
            },
        });

        const token = jwt.sign(
            {
                email: newUser.email,
                id: newUser.id,
            },
            jwtSecret,
            { expiresIn: "12h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // for development and testing only
            sameSite: "lax",
            maxAge: 3600000,
        });
        res.status(201).json({
            message: "User created.",
            user: newUser,
            token,
        });
    } catch (err) {
        res.status(500).json({
            message: "Server error, unable to create user.",
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
});

app.post("/signin", async (req, res) => {
    try {
        const parseResult = await SigninSchema.safeParseAsync(req.body);
        if (!parseResult.success) {
            res.status(400).json({
                message: "Bad request, invalid input/s.",
                error: parseResult.error.errors,
            });
            return;
        }

        const user = parseResult.data;
        const existingUser = await prismaClient.user.findUnique({
            where: { email: user.email },
            select: {
                email: true,
                name: true,
                password: true,
                id: true,
            },
        });
        if (!existingUser) {
            res.status(401).json({
                message: "Bad request, unauthorised!",
                error: "user is not registered. please, sign up first!",
            });
            return;
        }
        const hashedPassword = existingUser!.password;

        const isPasswordCorrect = await bcrypt.compare(
            user.password,
            hashedPassword
        );
        if (!isPasswordCorrect) {
            res.status(401).json({
                message: "Bad request, unauthorised.",
                error: "password is incorrect. please, try again!",
            });
            return;
        }

        const token = jwt.sign(
            {
                email: existingUser.email,
                id: existingUser.id,
            },
            jwtSecret,
            { expiresIn: "12h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 3600000,
        });
        res.status(200).json({
            message: "user signed in",
            user: {
                email: existingUser.email,
                name: existingUser.name,
                id: existingUser.id,
            },
            token,
        });
    } catch (err) {
        res.status(500).json({
            message: "Server error, unable to log in user.",
            errror: err instanceof Error ? err.message : "Unknown error",
        });
    }
});

app.post("/room", middleware, async (req: CustomRequest, res) => {
    try {
        const { roomName } = req.body;
        const email = req.email;
        if (roomName.trim().length === 0) {
            res.status(400).json({
                message:
                    "Bad request, room name can not be empty or just a space.",
            });
            return;
        }

        const roomSlug = `${roomName
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "-")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")}@${Date.now()}`;

        const adminUser = await prismaClient.user.findUnique({
            where: { email: email },
        });
        if (!adminUser?.id) {
            res.status(400).json({
                message: "Bad request, admin user not found.",
            });
            return;
        }

        const newRoom = await prismaClient.room.create({
            data: {
                slug: roomSlug,
                adminId: adminUser.id,
            },
            select: {
                slug: true,
                id: true,
            },
        });

        res.status(201).json({
            message: "room created.",
            room: {
                newRoom,
                roomName,
            },
        });
    } catch (err) {
        res.status(500).json({
            message: "Server error, unable to create room.",
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
});

app.get("/chat/:roomId", middleware, async (req: CustomRequest, res) => {
    try {
        const roomId = Number(req.params.roomId);
        if (!roomId) {
            res.status(400).json({
                message: "Bad request, roomId is not present.",
            });
            return;
        }

        const chats = await prismaClient.chat.findMany({
            where: {
                roomId,
            },
            orderBy: {
                id: "desc",
            },
            take: 50,
        });

        res.status(200).json({
            messages: chats,
        });
    } catch (err) {
        res.status(500).json({
            message: "Server error while fetching data.",
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
});

app.post("/room/:roomId", middleware, async (req: CustomRequest, res) => {
    try {
        const roomId = Number(req.params.roomId);
        if (!roomId) {
            res.status(400).json({
                message: "Bad request, roomId is missing.",
            });
        }

        const room = await prismaClient.room.findUnique({
            where: {
                id: roomId,
            },
        });

        res.status(200).json({
            room,
        });
    } catch (err) {
        res.status(500).json({
            message: "Server error while getting room details",
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
});

app.post("/signout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        message: "user logged out.",
    });
});

app.listen(port, () => {
    console.log(`http server is listening on port: ${port}`);
});
