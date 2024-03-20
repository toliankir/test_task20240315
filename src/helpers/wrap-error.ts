export const wrapError = (e: unknown): string => {
    return (typeof e === 'object' && e && 'message' in e) ? e.message : (e as any).toString();
}