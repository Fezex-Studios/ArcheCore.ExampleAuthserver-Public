import { FastifyInstance }
    from "fastify";

import { db }
    from "../Database/Database";

export async function ValidateSessionRoute(
    fastify: FastifyInstance)
{
    fastify.post(
        "/validate-session",
        {
            // Internal endpoint — called by the world server only, not clients.
            config: { rateLimit: false }
        },
        async request =>
        {
            const body =
                request.body as any;

            const session: any =
                db.prepare(`
                    SELECT *
                    FROM sessions
                    WHERE token = ?
                `).get(
                    body.Token);

            if (!session)
            {
                return {
                    Valid: false
                };
            }

            if (new Date(session.expires_at) < new Date())
            {
                db.prepare(`
                    DELETE FROM sessions
                    WHERE token = ?
                `).run(body.Token);

                return {
                    Valid: false
                };
            }

            return {
                Valid:     true,
                AccountId: session.account_id
            };
        });
}