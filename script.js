document.addEventListener('DOMContentLoaded', () => {
    // Timer variables
    let timerInterval;
    let timeLeft = 30 * 60; // 30 minutes in seconds
    let isRunning = false;
    let isDarkMode = false;
    let currentGoal = '';

    // Mode durations in seconds
    const modes = {
        pomodoro: 30 * 60,      // 30 minutes
        shortBreak: 5 * 60,     // 5 minutes
        longBreak: 15 * 60      // 15 minutes
    };

    // DOM elements
    const timeDisplay = document.getElementById('time');
    const startPauseBtn = document.getElementById('start-pause');
    const resetBtn = document.getElementById('reset');
    const smileBtn = document.getElementById('smile');
    const emojiContainer = document.getElementById('emoji-container');
    const pomodoroBtn = document.getElementById('pomodoro');
    const shortBreakBtn = document.getElementById('short-break');
    const longBreakBtn = document.getElementById('long-break');
    const goalModal = document.getElementById('goal-modal');
    const goalInput = document.getElementById('goal-input');
    const goalSubmit = document.getElementById('goal-submit');
    const goalCancel = document.getElementById('goal-cancel');
    const goalContainer = document.getElementById('goal-container');
    const currentGoalDisplay = document.getElementById('current-goal');

    // Format time (mm:ss)
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Update timer display
    function updateDisplay() {
        timeDisplay.textContent = formatTime(timeLeft);
        document.title = `(${formatTime(timeLeft)}) Pomodoro Timer`;
    }

    // Show goal modal
    function showGoalModal() {
        goalInput.value = currentGoal;
        goalModal.classList.remove('hidden');
        setTimeout(() => {
            goalInput.focus();
        }, 300);
    }

    // Hide goal modal
    function hideGoalModal() {
        goalModal.classList.add('hidden');
    }

    // Set the current goal
    function setGoal(goal) {
        currentGoal = goal.trim();
        if (currentGoal) {
            currentGoalDisplay.textContent = currentGoal;
            goalContainer.classList.remove('hidden');
        } else {
            goalContainer.classList.add('hidden');
        }
    }

    // Start the timer
    function startTimer() {
        isRunning = true;
        startPauseBtn.textContent = 'Pause';
        startPauseBtn.classList.remove('start');
        startPauseBtn.classList.add('pause');
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            // Timer finished
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                isRunning = false;
                timeLeft = 0;
                startPauseBtn.textContent = 'Start';
                startPauseBtn.classList.remove('pause');
                startPauseBtn.classList.add('start');
                playAlarm();
                
                // Clear the goal when timer finishes
                if (pomodoroBtn.classList.contains('active')) {
                    setGoal('');
                }
            }
        }, 1000);
    }

    // Toggle timer start/pause
    function toggleTimer() {
        if (isRunning) {
            // Pause the timer
            clearInterval(timerInterval);
            isRunning = false;
            startPauseBtn.textContent = 'Start';
            startPauseBtn.classList.remove('pause');
            startPauseBtn.classList.add('start');
        } else {
            // If it's a pomodoro session and not currently running, show goal modal
            if (pomodoroBtn.classList.contains('active') && !currentGoal) {
                showGoalModal();
            } else {
                startTimer();
            }
        }
    }

    // Reset timer
    function resetTimer() {
        // Toggle dark mode
        isDarkMode = !isDarkMode;
        
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // Stop timer
        clearInterval(timerInterval);
        isRunning = false;
        
        // Reset to current selected mode
        if (pomodoroBtn.classList.contains('active')) {
            timeLeft = modes.pomodoro;
            // Clear the goal when resetting a pomodoro
            setGoal('');
        } else if (shortBreakBtn.classList.contains('active')) {
            timeLeft = modes.shortBreak;
        } else if (longBreakBtn.classList.contains('active')) {
            timeLeft = modes.longBreak;
        }
        
        startPauseBtn.textContent = 'Start';
        startPauseBtn.classList.remove('pause');
        startPauseBtn.classList.add('start');
        updateDisplay();
    }

    // Play alarm sound when timer finishes
    function playAlarm() {
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
        audio.play();
    }

    // Show smiley emoji
    function showSmile() {
        emojiContainer.textContent = '😊';
        
        // Emoji disappears after 3 seconds
        setTimeout(() => {
            emojiContainer.textContent = '';
        }, 3000);
    }

    // Set active mode button
    function setActiveMode(button) {
        // Remove active class from all mode buttons
        [pomodoroBtn, shortBreakBtn, longBreakBtn].forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        button.classList.add('active');
    }

    // Event listeners
    startPauseBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);
    smileBtn.addEventListener('click', showSmile);

    // Goal modal event listeners
    goalSubmit.addEventListener('click', () => {
        setGoal(goalInput.value);
        hideGoalModal();
        startTimer();
    });

    goalCancel.addEventListener('click', () => {
        hideGoalModal();
    });

    // Allow submitting the form with Enter key
    goalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            setGoal(goalInput.value);
            hideGoalModal();
            startTimer();
        }
    });

    // Close modal when clicking outside
    goalModal.addEventListener('click', (e) => {
        if (e.target === goalModal) {
            hideGoalModal();
        }
    });

    pomodoroBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        isRunning = false;
        setActiveMode(pomodoroBtn);
        timeLeft = modes.pomodoro;
        startPauseBtn.textContent = 'Start';
        startPauseBtn.classList.remove('pause');
        startPauseBtn.classList.add('start');
        updateDisplay();
    });

    shortBreakBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        isRunning = false;
        setActiveMode(shortBreakBtn);
        timeLeft = modes.shortBreak;
        startPauseBtn.textContent = 'Start';
        startPauseBtn.classList.remove('pause');
        startPauseBtn.classList.add('start');
        updateDisplay();
    });

    longBreakBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        isRunning = false;
        setActiveMode(longBreakBtn);
        timeLeft = modes.longBreak;
        startPauseBtn.textContent = 'Start';
        startPauseBtn.classList.remove('pause');
        startPauseBtn.classList.add('start');
        updateDisplay();
    });

    // Initialize timer display
    updateDisplay();
}); 