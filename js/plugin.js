const Timer = function () {
    let timer_container;
    let end_time_container;
    let countdown;
    /**
     * init - инициализировать наш модуль
     */
    function init(settings) {
        timer_container = document.querySelector(settings.timer_container);
        end_time_container = document.querySelector(settings.timer_end_date_container);
        return this;
    }

    /**
     * start - запускать таймер на указанное время в секундах
     */
    function start(seconds) {
        if (!seconds || typeof seconds !== "number") return console.log("Please provide seconds");

        clearInterval(countdown);

        const now = Date.now();
        const end = now + seconds * 1000;

        _display_time_left(seconds);
        _display_end_time(end);

        // вывести в разметку таймер и дату окончания работы таймера
        countdown = setInterval(() => {
            const second_left = Math.round((end - Date.now()) / 1000);
            
            if (second_left < 0) return clearInterval(countdown);
            
            _display_time_left(second_left);
        }, 1000);
    } 

    /**
     * stop - принудительно останавливать таймер
     */
    function stop() {
        clearInterval(countdown);
        timer_container.textContent = "";
        end_time_container.textContent = "";
    }

    function _display_time_left(seconds) {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor( (seconds % 86400) / 3600);
        const minutes = Math.floor( (seconds % 3600) / 60);
        const reminder_seconds = Math.floor( seconds % 60 );
        const display = `${days === 1 ? days + ' day ' : ''}${days > 1 ? days + ' days ' : ''} ${hours ? hours + ':' : '' }${minutes < 10 ? '0' : ''}${minutes}:${reminder_seconds < 10 ? '0' : ''}${reminder_seconds}`;    
        timer_container.textContent = display;
        document.title = display;
    }

    function _display_end_time(timestamp) {
        const end_date = new Date(timestamp);
        const end_date_day = `${end_date.getDate()} ${end_date.getMonth()}` ;
        const current_date = new Date();
        const current_date_day = `${current_date.getDate()} ${current_date.getMonth()}`;
        
        const timeOptions = {
            weekday: 'long',
            month: 'long',
            year: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        };

        const display = end_date_day !== current_date_day ? `Be back on ${end_date.toLocaleString('en-EN', timeOptions)}` : `Be back at ${end_date.getHours()}:${end_date.getMinutes() < 10 ? "0" : ""}${end_date.getMinutes()}`;
        end_time_container.textContent = display;
    }

    return  {
        init,
        start, 
        stop
    }
}

// UI elements
const btns = document.querySelectorAll("[data-time]");
const reset_btn = document.querySelector(".stop__button");
const form = document.forms['customForm'];

const my_timer1 = Timer().init({
    timer_container: ".display__time-left",
    timer_end_date_container: ".display__end-time"
});

function onClickHandler(e) {
    let seconds = Number(this.dataset.time);
    my_timer1.start(seconds);
}

function onSubmitHandler(e) {
    e.preventDefault();
    let seconds = Number(this.elements['minutes'].value * 60);
    my_timer1.start(seconds);
    form.reset();
}


btns.forEach(btn => btn.addEventListener("click", onClickHandler));
reset_btn.addEventListener("click", my_timer1.stop);
form.addEventListener('submit', onSubmitHandler);