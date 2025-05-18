import { Request, Response } from "express";

interface CustomRequest extends Request {
    email?: string;
}

export type { CustomRequest };
