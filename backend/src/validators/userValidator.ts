import { email, z } from "zod";

export const userValidator = z.object({
    username: z.string()
        .min(3, "Username must have atleast 3 characters")
        .max(10, "Username cannot be longer then 10 characters"),
    email:z.email(),
    password: z.string()
        .min(8, "Password must have atleast 8 characters")
        .max(20, "Password cannot be more then 20 Characters")
        .regex(/[A-Z]/, "Password should atleast have a upperCase letter")
        .regex(/[a-z]/, "Password should atleast have a LowerCase letter")
        .regex(/[!@#$%^&*?]/, "Password must contain at least one special character (@, $, !, %, *, ?, &, ^, #)")
        .regex(/\d/, 'Password must contain at least one number')
})