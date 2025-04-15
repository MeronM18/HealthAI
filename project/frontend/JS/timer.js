class FastingTimer {
    constructor() {
        this.remainingTime = 0;
        this.timerId = null;
        this.isPaused = false;
        this.endTime = null;
        
        //DOM Elements
        this.durationInput = document.getElementById('fasting-duration');
        this.unitSelect = document.getElementById('duration-unit');
        this.startBtn = document.getElementById('start-fasting');
        this.pauseBtn = document.getElementById('pause-fasting');
        this.resetBtn = document.getElementById('reset-fasting');
        this.display = document.getElementById('timer-display');

        //Bind event listeners
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());

        //Load saved timer state
        this.loadSavedState();

        //Handle visibility change
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
        
        //Add event listener for page unload to save state
        window.addEventListener('beforeunload', () => this.saveState());
    }

    loadSavedState() {
        const savedEndTime = localStorage.getItem('timerEndTime');
        const savedIsPaused = localStorage.getItem('timerIsPaused') === 'true';
        const savedRemainingTime = localStorage.getItem('timerRemainingTime');

        if (savedEndTime && savedRemainingTime) {
            this.endTime = parseInt(savedEndTime);
            this.isPaused = savedIsPaused;
            
            //Calculate remaining time based on end time
            const now = Date.now();
            if (this.endTime > now && !this.isPaused) {
                this.remainingTime = Math.ceil((this.endTime - now) / 1000);
            } else {
                this.remainingTime = parseInt(savedRemainingTime);
            }
            
            //Update UI state
            this.durationInput.disabled = true;
            this.unitSelect.disabled = true;
            
            if (!this.isPaused) {
                //Timer is running
                this.startBtn.style.display = 'none';
                this.pauseBtn.style.display = 'inline-block';
                this.resetBtn.style.display = 'inline-block';
                this.pauseBtn.textContent = 'Pause';
                this.startTimer();
            } else {
                //Timer is paused
                this.startBtn.style.display = 'none';
                this.pauseBtn.style.display = 'inline-block';
                this.resetBtn.style.display = 'inline-block';
                this.pauseBtn.textContent = 'Resume';
                this.updateDisplay();
            }
        }
    }

    saveState() {
        if (this.endTime) {
            localStorage.setItem('timerEndTime', this.endTime.toString());
            localStorage.setItem('timerIsPaused', this.isPaused.toString());
            localStorage.setItem('timerRemainingTime', this.remainingTime.toString());
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            //Tab is hidden, save current state
            this.saveState();
        } else {
            //Tab is visible, restore state if needed
            this.loadSavedState();
        }
    }

    start() {
        const duration = parseInt(this.durationInput.value);
        const unit = this.unitSelect.value;
        
        if (!duration || duration <= 0) {
            alert('Please enter a valid duration');
            return;
        }

        //Convert duration to seconds
        this.remainingTime = this.convertToSeconds(duration, unit);
        this.endTime = Date.now() + (this.remainingTime * 1000);
        
        //Update display immediately
        this.updateDisplay();
        
        //Start the timer
        this.startTimer();
        
        //Update UI
        this.startBtn.style.display = 'none';
        this.pauseBtn.style.display = 'inline-block';
        this.resetBtn.style.display = 'inline-block';
        this.durationInput.disabled = true;
        this.unitSelect.disabled = true;

        //Save initial state
        this.saveState();
    }

    startTimer() {
        if (this.timerId) {
            clearInterval(this.timerId);
        }
        
        //Start interval for countdown
        this.timerId = setInterval(() => {
            if (!this.isPaused) {
                //Calculate remaining time based on end time
                const now = Date.now();
                if (this.endTime > now) {
                    this.remainingTime = Math.ceil((this.endTime - now) / 1000);
                    this.updateDisplay();
                } else {
                    this.timerComplete();
                }
            }
        }, 1000);
    }

    pause() {
        this.isPaused = !this.isPaused;
        this.pauseBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
        
        if (this.isPaused) {
            //When pausing, update the end time to be further in the future
            this.endTime = Date.now() + (this.remainingTime * 1000);
        }
        
        this.saveState();
    }

    reset() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
        
        this.remainingTime = 0;
        this.isPaused = false;
        this.endTime = null;
        
        //Update UI
        this.startBtn.style.display = 'inline-block';
        this.pauseBtn.style.display = 'none';
        this.resetBtn.style.display = 'none';
        this.durationInput.disabled = false;
        this.unitSelect.disabled = false;
        this.display.textContent = '00:00';
        this.pauseBtn.textContent = 'Pause';

        //Clear saved state
        localStorage.removeItem('timerEndTime');
        localStorage.removeItem('timerIsPaused');
        localStorage.removeItem('timerRemainingTime');
    }

    timerComplete() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
        
        //Play notification sound
        const audio = new Audio('/sounds/timer-complete.mp3');
        audio.play();
        
        //Show notification
        if (Notification.permission === 'granted') {
            new Notification('Timer Complete!', {
                body: 'Your timer has ended.',
                icon: '/images/logo1.png'
            });
        }
        
        this.reset();
    }

    updateDisplay() {
        const hours = Math.floor(this.remainingTime / 3600);
        const minutes = Math.floor((this.remainingTime % 3600) / 60);
        const seconds = this.remainingTime % 60;
        
        if (hours > 0) {
            this.display.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            this.display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    convertToSeconds(duration, unit) {
        switch (unit) {
            case 'seconds':
                return duration;
            case 'minutes':
                return duration * 60;
            case 'hours':
                return duration * 60 * 60;
            default:
                return duration;
        }
    }
}

//Initialize timer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    //Request notification permission
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
    
    //Initialize timer
    new FastingTimer();
}); 