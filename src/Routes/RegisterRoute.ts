import { FastifyInstance }
    from "fastify";

import { db }
    from "../Database/Database";

import {
    HashPassword
}
    from "../Services/PasswordService";

export async function RegisterRoute(
    fastify: FastifyInstance)
{
    fastify.post(
        "/register",
        async request =>
        {
            const body =
                request.body as any;

            const existing =
                db.prepare(`
                    SELECT *
                    FROM accounts
                    WHERE username = ?
                `).get(
                    body.Username);

            if(existing)
            {
                return {
                    Success: false
                };
            }

            const hash =
                await HashPassword(
                    body.Password);

            db.prepare(`
                INSERT INTO accounts
                (
                    username,
                    password_hash
                )
                VALUES (?, ?)
            `).run(
                body.Username,
                hash);

            return {
                Success: true
            };
        });
}