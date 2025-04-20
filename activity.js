
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Check and apply sign-up bonus if not already given
    if (!currentUser.bonusReceived) {
        currentUser.balance = (parseFloat(currentUser.balance) + 10000).toString();
        currentUser.bonusReceived = true;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Update users array
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.uid === currentUser.uid);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Add to activity history
        addActivity('Welcome Bonus Received', '₹10,000', 'bonus');
    }

    displayActivities();
});

function addActivity(description, amount, type) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    
    activities.unshift({
        userId: currentUser.uid,
        description,
        amount,
        type,
        timestamp: new Date().toISOString()
    });

    localStorage.setItem('activities', JSON.stringify(activities));
    displayActivities();
}

function displayActivities() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    const userActivities = activities.filter(a => a.userId === currentUser.uid);
    
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = userActivities.map(activity => `
        <div class="activity-item ${activity.type}">
            <div class="activity-info">
                <span class="activity-desc">${activity.description}</span>
                <span class="activity-time">${new Date(activity.timestamp).toLocaleString()}</span>
            </div>
            <div class="activity-amount">${activity.amount}</div>
        </div>
    `).join('') || '<p class="no-activity">No recent activity</p>';
}
