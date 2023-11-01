import {z} from "zod";

export const Token = z.object({
    class: z.string(),
    lex: z.string(),
    type: z.string().nullable(),
})

export type Token = z.infer<typeof Token>
