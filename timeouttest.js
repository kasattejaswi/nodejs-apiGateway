const intervals = [];
const timeouts = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000];

setTimeout(() => {
    intervals.forEach((interval) => {
        clearInterval(interval);
    });
}, 15000);

timeouts.forEach((timeout, index) => {
    intervals.push(
        setInterval(() => {
            console.log(`I am running from interval ${index}`);
        }, timeout)
    );
});
console.log(intervals);
