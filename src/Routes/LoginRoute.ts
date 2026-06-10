import { FastifyInstance }
    from "fastify";

import { db }
    from "../Database/Database";

import { AccountRow }
    from "../Interfaces/AccountRow";

import {
    VerifyPassword
}
    from "../Services/PasswordService";

import {
    CreateToken
}
    from "../Services/SessionService";

export async function LoginRoute(
    fastify: FastifyInstance)
{
    fastify.post(
        "/login",
        async request =>
        {
            const body =
                request.body as any;

            const account =
                (
                    db.prepare(`
                        SELECT *
                        FROM accounts
                        WHERE username = ?
                    `).get(
                        body.Username)
                ) as AccountRow | undefined;

            if(!account)
            {
                return {
                    Success: false
                };
            }

            const valid =
                await VerifyPassword(
                    body.Password,
                    account.password_hash);

            if(!valid)
            {
                return {
                    Success: false
                };
            }

            const token =
                CreateToken();

            db.prepare(`
                INSERT INTO sessions
                (
                    token,
                    account_id,
                    expires_at
                )
                VALUES (?, ?, ?)
            `).run(
                token,
                account.account_id,
                new Date(
                    Date.now() +
                    86400000
                ).toISOString()
            );

            return {
                Success: true,
                Token: token
            };
        });
}