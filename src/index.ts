import Fastify
    from "fastify";

import rateLimit
    from "@fastify/rate-limit";

import "./Database/Database";

import {
    RegisterRoute
}
    from "./Routes/RegisterRoute";

import {
    LoginRoute
}
    from "./Routes/LoginRoute";

import {
    ValidateSessionRoute
}
    from "./Routes/ValidateSessionRoute";

import {
    GameDataRoute
}
    from "./Routes/GameDataRoute";

const server =
    Fastify({
        logger: true
    });

// Rate limit all routes: 10 attempts per minute per IP.
// Internal endpoints opt out via config: { rateLimit: false } on their route.
server.register(rateLimit, {
    max:        10,
    timeWindow: "1 minute"
});

server.register(RegisterRoute);
server.register(LoginRoute);
server.register(ValidateSessionRoute);
server.register(GameDataRoute);

server
    .listen({
        port: 3000,
        host: "0.0.0.0"
    })
    .then(() =>
    {
        console.log("Auth Server Ready");
    });