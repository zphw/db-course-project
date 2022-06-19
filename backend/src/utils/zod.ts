export const toDateString = (v: unknown) => {
    try {
        return v ? new Date(v as string).toISOString().split('T')[0] : undefined;
    } catch (e) {
        return -1;
    }
};
