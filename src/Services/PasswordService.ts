import bcrypt from "bcrypt";

export async function HashPassword(
    password: string)
{
    return await bcrypt.hash(
        password,
        10);
}

export async function VerifyPassword(
    password: string,
    hash: string)
{
    return await bcrypt.compare(
        password,
        hash);
}