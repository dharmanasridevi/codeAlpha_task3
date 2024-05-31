document.addEventListener('DOMContentLoaded', () => {
    const activityForm = document.getElementById('activityForm');
    const activityType = document.getElementById('activityType');
    const duration = document.getElementById('duration');
    const caloriesBurned = document.getElementById('caloriesBurned');
    const activitiesList = document.getElementById('activities');

    const goalForm = document.getElementById('goalForm');
    const goalType = document.getElementById('goalType');
    const goalTarget = document.getElementById('goalTarget');
    const progressContainer = document.getElementById('progress');

    // Load activities from local storage
    const loadActivities = () => {
        const activities = JSON.parse(localStorage.getItem('activities')) || [];
        activitiesList.innerHTML = '';
        activities.forEach((activity, index) => {
            const li = document.createElement('li');
            li.textContent = `${activity.type}: ${activity.duration} minutes, ${activity.caloriesBurned} calories burned`;
            activitiesList.appendChild(li);
        });
    };

    // Add activity
    activityForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const type = activityType.value;
        const durationValue = duration.value;
        const calories = caloriesBurned.value;

        if (type && durationValue && calories) {
            const activities = JSON.parse(localStorage.getItem('activities')) || [];
            activities.push({ type, duration: durationValue, caloriesBurned: calories });
            localStorage.setItem('activities', JSON.stringify(activities));

            // Clear form
            activityType.value = '';
            duration.value = '';
            caloriesBurned.value = '';

            // Reload activities
            loadActivities();
            updateProgress();
        }
    });

    // Load goal from local storage
    const loadGoal = () => {
        const goal = JSON.parse(localStorage.getItem('goal'));
        if (goal) {
            goalType.value = goal.type;
            goalTarget.value = goal.target;
        }
    };

    // Update progress
    const updateProgress = () => {
        const activities = JSON.parse(localStorage.getItem('activities')) || [];
        const goal = JSON.parse(localStorage.getItem('goal'));
        if (!goal) {
            progressContainer.textContent = 'No goal set.';
            return;
        }

        let total = 0;
        if (goal.type.toLowerCase() === 'minutes') {
            total = activities.reduce((sum, activity) => sum + parseInt(activity.duration), 0);
        } else if (goal.type.toLowerCase() === 'calories') {
            total = activities.reduce((sum, activity) => sum + parseInt(activity.caloriesBurned), 0);
        }

        progressContainer.textContent = `Progress: ${total}/${goal.target} ${goal.type}`;
    };

    // Set goal
    goalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const type = goalType.value;
        const target = goalTarget.value;

        if (type && target) {
            const goal = { type, target };
            localStorage.setItem('goal', JSON.stringify(goal));

            // Update progress
            updateProgress();
        }
    });

    // Initial load
    loadActivities();
    loadGoal();
    updateProgress();
});
