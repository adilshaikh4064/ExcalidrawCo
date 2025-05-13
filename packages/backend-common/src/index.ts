const JWT_SECRET=process.env.JWT_SECRET || 'a-random-jwt-secret';
const SALT_ROUNDS=Number(process.env.SALT_ROUNDS) || 10;
const HTTP_PORT=Number(process.env.HTTP_PORT) || 3001;

export const config={
    JWT_SECRET,
    SALT_ROUNDS,
    HTTP_PORT
}