document.addEventListener('DOMContentLoaded', () => {
    const countdown = () => {
        const countDate = new Date('October 25, 2025 14:00:00').getTime();
        const now = new Date().getTime();
        const gap = countDate - now;

        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        const textDay = Math.floor(gap / day);
        const textHour = Math.floor((gap % day) / hour);
        const textMinute = Math.floor((gap % hour) / minute);
        const textSecond = Math.floor((gap % minute) / second);

        document.getElementById('timer').innerText = `${textDay}d ${textHour}h ${textMinute}m ${textSecond}s`;

        if (gap < 0) {
            clearInterval(interval);
            document.getElementById('timer').innerText = "The day is here!";
        }
    };

    const interval = setInterval(countdown, 1000);
});
