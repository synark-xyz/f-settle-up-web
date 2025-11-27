// Dev mode detection utility
export const isDevMode = () => {
    const hostname = window.location.hostname;
    return (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '192.168.3.163' ||
        hostname.startsWith('192.168.') // Allow any local network IP
    );
};
