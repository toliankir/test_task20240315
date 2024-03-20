export const parseToken = (token: string | null): {
    email: string,
    exp: Date,
} | null => {
    const obj = token ? JSON.parse(atob(token.split(".")[1])) : null;
    return obj ? {
        email: obj.email,
        exp: new Date(obj.exp * 1000)
    }
        : null;
}
