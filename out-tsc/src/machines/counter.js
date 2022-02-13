export const counterInterval = (send, receieve) => {
    const intervalId = setInterval(() => {
        send({ type: 'TICK' });
    }, 1000);
    return () => { clearInterval(intervalId); };
};
//# sourceMappingURL=counter.js.map