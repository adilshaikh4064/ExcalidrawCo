import { z } from "zod";

const UserSchema = z.object({
    email: z.string().email({ message: "Invalid email" }),
    name: z
        .string()
        .min(3, { message: "Name must have at least 3 characters" })
        .max(20, { message: "Name must not exceed 20 characters" }),
    password: z
        .string()
        .min(8, { message: "Password must contain at least 8 characters" }),
});

const SigninSchema = z.object({
    email: z.string().email({ message: "Invalid email" }),
    password: z
        .string()
        .min(8, { message: "Password must contain at least 8 characters" }),
});

export { UserSchema, SigninSchema };
