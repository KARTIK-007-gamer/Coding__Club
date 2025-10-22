// Coding Club Website JavaScript
// Handles navigation, form submissions, dynamic content, and localStorage

// --- Navigation Highlight ---
document.addEventListener('DOMContentLoaded', function() {
    // --- User Action Select (Dashboard) ---
    const userActionSelect = document.getElementById('user-action-select');
    if (userActionSelect) {
        userActionSelect.addEventListener('change', function() {
            if (this.value === 'logout') {
                // Remove all user related data
                localStorage.removeItem('clubUserDetails');
                localStorage.removeItem('submittedTasks');
                localStorage.removeItem('testScores');
                localStorage.removeItem('clubStudentName');
                
                // Show logout message
                const logoutMessage = document.createElement('div');
                logoutMessage.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #1abc9c;
                    color: white;
                    padding: 1rem 2rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    z-index: 1000;
                `;
                logoutMessage.textContent = 'Successfully logged out. Redirecting...';
                document.body.appendChild(logoutMessage);
                
                // Redirect after showing message
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else if (this.value === 'login') {
                window.location.href = 'login.html';
            }
            this.value = '';
        });
    }
    // --- Logout Button ---
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('clubStudentName');
            window.location.href = 'login.html';
        });
    }
    // Platform courses data
    const platformCourses = {
        udemy: [
            { title: 'Python for Beginners', url: 'https://www.udemy.com/course/pythonforbeginners/' },
            { title: 'Web Development Bootcamp', url: 'https://www.udemy.com/course/the-web-developer-bootcamp/' },
            { title: 'React - The Complete Guide', url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/' }
        ],
        letsupgrade: [
            { title: 'Full Stack Web Development', url: 'https://letsupgrade.in/web-development-bootcamp' },
            { title: 'Data Science Bootcamp', url: 'https://letsupgrade.in/data-science-bootcamp' }
        ],
        springboard: [
            { title: 'Data Science Career Track', url: 'https://www.springboard.com/workshops/data-science-career-track/' },
            { title: 'Machine Learning Foundations', url: 'https://www.springboard.com/workshops/machine-learning/' },
            { title: 'Software Engineering Career Track', url: 'https://www.springboard.com/workshops/software-engineering-career-track/' }
        ],
        linkedin: [
            { title: 'JavaScript Essentials', url: 'https://www.linkedin.com/learning/javascript-essential-training-3' },
            { title: 'HTML & CSS Fundamentals', url: 'https://www.linkedin.com/learning/html-essential-training-4' },
            { title: 'SQL for Data Analysis', url: 'https://www.linkedin.com/learning/sql-for-data-analysis' }
        ]
    };

    // No longer needed: showCourses function for inline display
    // --- Login Page ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = loginForm.username.value.trim();
            const password = loginForm.password.value.trim();
            // Password must have one capital, one number, one special character
            const passwordValid = /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
            if (!passwordValid) {
                document.getElementById('login-error').textContent = 'Password must include one capital letter, one number, and one special character.';
                document.getElementById('login-error').style.display = 'block';
                document.getElementById('login-success').style.display = 'none';
                return;
            }
            const userDetails = {
                fullName: loginForm.fullName.value.trim(),
                email: loginForm.email.value.trim(),
                college: loginForm.college.value.trim(),
                year: loginForm.year.value,
                username: username,
                joinedDate: new Date().toISOString()
            };

            if (username && password) {
                localStorage.setItem('clubUserDetails', JSON.stringify(userDetails));
                document.getElementById('login-success').style.display = 'block';
                document.getElementById('login-error').style.display = 'none';
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1200);
            } else {
                document.getElementById('login-error').textContent = 'Invalid username or password.';
                document.getElementById('login-error').style.display = 'block';
                document.getElementById('login-success').style.display = 'none';
            }
        });
    }
    const navLinks = document.querySelectorAll('#nav-menu a');
    const currentPage = location.pathname.split('/').pop();
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // --- Contact Form ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            document.getElementById('contact-success').style.display = 'block';
            contactForm.reset();
        });
    }

    // --- Progress Tracking System ---
    const progressTracker = {
        tasks: {
            getSubmittedTasks() {
                return JSON.parse(localStorage.getItem('submittedTasks') || '[]');
            },
            getTotalTasks() {
                return 20; // Total number of tasks in the curriculum
            },
            addTaskSubmission(taskId, status, score) {
                const submissions = this.getSubmittedTasks();
                const submission = {
                    taskId,
                    status,
                    score, // Score out of 100
                    submittedAt: new Date().toISOString()
                };
                
                // Update existing submission or add new one
                const existingIndex = submissions.findIndex(s => s.taskId === taskId);
                if (existingIndex !== -1) {
                    submissions[existingIndex] = submission;
                } else {
                    submissions.push(submission);
                }
                
                localStorage.setItem('submittedTasks', JSON.stringify(submissions));
                this.updateTaskProgress();
                updateDashboard();
            },
            getCompletionRate() {
                const submissions = this.getSubmittedTasks();
                const completedTasks = submissions.filter(task => task.status === 'completed');
                return (completedTasks.length / this.getTotalTasks()) * 100;
            },
            getAverageScore() {
                const submissions = this.getSubmittedTasks();
                const completedTasks = submissions.filter(task => task.status === 'completed');
                if (completedTasks.length === 0) return 0;
                
                const totalScore = completedTasks.reduce((sum, task) => sum + task.score, 0);
                return totalScore / completedTasks.length;
            },
            updateTaskProgress() {
                const submissions = this.getSubmittedTasks();
                const taskProgress = {
                    total: this.getTotalTasks(),
                    completed: submissions.filter(t => t.status === 'completed').length,
                    inProgress: submissions.filter(t => t.status === 'in-progress').length,
                    avgScore: this.getAverageScore()
                };
                localStorage.setItem('taskProgress', JSON.stringify(taskProgress));
            }
        },
        tests: {
            getTestScores() {
                return JSON.parse(localStorage.getItem('testScores') || '[]');
            },
            getTotalTests() {
                return 12; // Total number of tests in the curriculum
            },
            addTestScore(weekNumber, topics) {
                const scores = this.getTestScores();
                const totalScore = topics.reduce((sum, topic) => sum + topic.score, 0);
                const maxScore = topics.reduce((sum, topic) => sum + topic.maxScore, 0);
                const percentageScore = (totalScore / maxScore) * 100;
                
                const testResult = {
                    weekNumber,
                    topics,
                    totalScore,
                    maxScore,
                    percentageScore,
                    submittedAt: new Date().toISOString()
                };
                
                // Update existing test score or add new one
                const existingIndex = scores.findIndex(s => s.weekNumber === weekNumber);
                if (existingIndex !== -1) {
                    scores[existingIndex] = testResult;
                } else {
                    scores.push(testResult);
                }
                
                localStorage.setItem('testScores', JSON.stringify(scores));
                this.updateTestProgress();
                updateDashboard();
            },
            getAverageScore() {
                const scores = this.getTestScores();
                if (scores.length === 0) return 0;
                return scores.reduce((sum, test) => sum + test.percentageScore, 0) / scores.length;
            },
            getCompletionRate() {
                return (this.getTestScores().length / this.getTotalTests()) * 100;
            },
            updateTestProgress() {
                const scores = this.getTestScores();
                const testProgress = {
                    total: this.getTotalTests(),
                    completed: scores.length,
                    avgScore: this.getAverageScore(),
                    lastTest: scores[scores.length - 1]
                };
                localStorage.setItem('testProgress', JSON.stringify(testProgress));
            }
        },
        weights: {
            tasks: 0.6, // Tasks are 60% of overall progress
            tests: 0.4  // Tests are 40% of overall progress
        },
        getOverallProgress() {
            const taskProgress = {
                completion: this.tasks.getCompletionRate() * 0.7, // Task completion is 70% of task progress
                performance: this.tasks.getAverageScore() * 0.3  // Task performance is 30% of task progress
            };
            
            const testProgress = {
                completion: this.tests.getCompletionRate() * 0.3, // Test completion is 30% of test progress
                performance: this.tests.getAverageScore() * 0.7  // Test performance is 70% of test progress
            };
            
            const weightedTaskProgress = 
                (taskProgress.completion + taskProgress.performance) * this.weights.tasks;
            const weightedTestProgress = 
                (testProgress.completion + testProgress.performance) * this.weights.tests;
            
            return weightedTaskProgress + weightedTestProgress;
        },
        getDetailedProgress() {
            return {
                overall: this.getOverallProgress(),
                tasks: {
                    completion: this.tasks.getCompletionRate(),
                    avgScore: this.tasks.getAverageScore(),
                    submitted: this.tasks.getSubmittedTasks().length,
                    total: this.tasks.getTotalTasks()
                },
                tests: {
                    completion: this.tests.getCompletionRate(),
                    avgScore: this.tests.getAverageScore(),
                    completed: this.tests.getTestScores().length,
                    total: this.tests.getTotalTests()
                }
            };
        }
    };

    // --- Dashboard Updates ---
    function updateDashboard() {
        const dashboard = document.getElementById('student-dashboard');
        if (!dashboard) return;

        const progress = progressTracker.getDetailedProgress();

        // Update overall progress
        const overallProgress = document.getElementById('overall-progress');
        if (overallProgress) {
            const overallValue = Math.round(progress.overall);
            overallProgress.textContent = overallValue + '%';
            overallProgress.parentElement.style.background = 
                `conic-gradient(#1abc9c ${overallValue * 3.6}deg, #ecf0f1 0deg)`;
        }

        // Update tasks progress
        const tasksProgress = document.getElementById('tasks-progress');
        if (tasksProgress) {
            const taskCompletionRate = Math.round(progress.tasks.completion);
            tasksProgress.style.width = taskCompletionRate + '%';
            document.querySelector('.stats-detail').textContent = 
                `${progress.tasks.submitted}/${progress.tasks.total} Tasks`;
            
            // Add task performance details
            const taskDetails = document.querySelector('.task-performance');
            if (taskDetails) {
                taskDetails.innerHTML = `
                    <div class="performance-stat">
                        <label>Average Score</label>
                        <span>${Math.round(progress.tasks.avgScore)}%</span>
                    </div>
                    <div class="performance-stat">
                        <label>Completion Rate</label>
                        <span>${taskCompletionRate}%</span>
                    </div>
                `;
            }
        }

        // Update test scores
        const avgScore = document.getElementById('avg-score');
        if (avgScore) {
            const testAvg = Math.round(progress.tests.avgScore);
            avgScore.textContent = testAvg;
            
            // Add test performance details
            const testDetails = document.querySelector('.test-performance');
            if (testDetails) {
                testDetails.innerHTML = `
                    <div class="performance-stat">
                        <label>Tests Completed</label>
                        <span>${progress.tests.completed}/${progress.tests.total}</span>
                    </div>
                    <div class="performance-stat">
                        <label>Average Score</label>
                        <span>${testAvg}%</span>
                    </div>
                `;
            }
        }

        // Update recent tasks list
        const recentTasks = document.getElementById('recent-tasks');
        if (recentTasks) {
            const tasks = progressTracker.tasks.getSubmittedTasks()
                .slice(-3)
                .reverse();
            recentTasks.innerHTML = tasks.map(task => `
                <div class="task-item ${task.status}">
                    <span class="task-name">Task ${task.taskId}</span>
                    <span class="task-status">${task.status}</span>
                </div>
            `).join('') || '<p>No tasks submitted yet</p>';
        }

        // Update test results
        const testResults = document.getElementById('test-results');
        if (testResults) {
            const tests = progressTracker.tests.getTestScores()
                .slice(-2)
                .reverse();
            testResults.innerHTML = tests.map(test => `
                <div class="test-item">
                    <div class="test-header">
                        <span class="test-name">Week ${test.weekNumber} Test</span>
                        <span class="test-score">${test.totalScore}/${test.maxScore}</span>
                    </div>
                    <div class="test-details">
                        ${test.topics.map(topic => `
                            <div class="detail-item">
                                <span>${topic.name}</span>
                                <span>${topic.score}/${topic.maxScore}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('') || '<p>No test results yet</p>';
        }
    }

    // Initialize dashboard if on dashboard page
    if (document.querySelector('.dashboard')) {
        updateDashboard();
        
        // Update user profile
        const userDetails = JSON.parse(localStorage.getItem('clubUserDetails') || '{}');
        if (userDetails.fullName) {
            // Set user avatar with initials
            const initials = userDetails.fullName
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase();
            document.getElementById('user-avatar').textContent = initials;
            
            // Update user information
            document.getElementById('user-name').textContent = userDetails.fullName;
            document.getElementById('user-email').textContent = userDetails.email;
            document.getElementById('user-college').textContent = userDetails.college;
            document.getElementById('user-year').textContent = `${userDetails.year}${getYearSuffix(userDetails.year)} Year`;
            document.getElementById('user-joined').textContent = new Date(userDetails.joinedDate).toLocaleDateString();
        } else {
            window.location.href = 'login.html';
        }
    }

    // Helper function for year suffix
    function getYearSuffix(year) {
        switch(year) {
            case '1': return 'st';
            case '2': return 'nd';
            case '3': return 'rd';
            default: return 'th';
        }
    }

    // --- Test Schedule and Countdown System ---
    const testScheduler = {
        upcomingTests: [
            {
                id: 1,
                title: 'C Programming Fundamentals',
                date: '2025-09-30T10:00:00',
                topics: ['Variables & Data Types', 'Control Structures', 'Functions'],
                duration: 120 // minutes
            },
            {
                id: 2,
                title: 'Arrays and Pointers',
                date: '2025-10-07T10:00:00',
                topics: ['Array Manipulation', 'Pointer Basics', 'Memory Management'],
                duration: 120
            }
        ],
        
        getNextTest() {
            const now = new Date();
            return this.upcomingTests
                .filter(test => new Date(test.date) > now)
                .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
        },

        updateCountdown() {
            const nextTest = this.getNextTest();
            if (!nextTest) return;

            const now = new Date().getTime();
            const testTime = new Date(nextTest.date).getTime();
            const distance = testTime - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Update countdown display with smooth transition
            const updateDigit = (id, value) => {
                const element = document.getElementById(id);
                if (element && element.textContent !== String(value).padStart(2, '0')) {
                    element.style.transform = 'translateY(-20px)';
                    element.style.opacity = '0';
                    setTimeout(() => {
                        element.textContent = String(value).padStart(2, '0');
                        element.style.transform = 'translateY(20px)';
                        requestAnimationFrame(() => {
                            element.style.transform = 'translateY(0)';
                            element.style.opacity = '1';
                        });
                    }, 200);
                }
            };

            updateDigit('days', days);
            updateDigit('hours', hours);
            updateDigit('minutes', minutes);
            updateDigit('seconds', seconds);

            // Update next test information
            document.getElementById('next-test-title').textContent = nextTest.title;
            document.getElementById('next-test-date').textContent = 
                new Date(nextTest.date).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            document.getElementById('next-test-topics').textContent = 
                'Topics: ' + nextTest.topics.join(', ');
        },

        updateTestSchedule() {
            const scheduleList = document.getElementById('test-schedule-list');
            if (!scheduleList) return;

            const now = new Date();
            const upcomingTests = this.upcomingTests
                .filter(test => new Date(test.date) > now)
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            scheduleList.innerHTML = upcomingTests.map(test => `
                <div class="test-card">
                    <div class="test-date">
                        ${new Date(test.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </div>
                    <h3 class="test-title">${test.title}</h3>
                    <div class="test-topics">
                        ${test.topics.map(topic => `<span>${topic}</span>`).join(', ')}
                    </div>
                    <div class="test-status status-upcoming">
                        Duration: ${test.duration} minutes
                    </div>
                </div>
            `).join('');
        },

        updatePastTests() {
            const pastTestsList = document.getElementById('past-tests-list');
            if (!pastTestsList) return;

            const now = new Date();
            const pastTests = this.upcomingTests
                .filter(test => new Date(test.date) < now)
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            pastTestsList.innerHTML = pastTests.map(test => `
                <div class="test-card">
                    <div class="test-date">
                        ${new Date(test.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </div>
                    <h3 class="test-title">${test.title}</h3>
                    <div class="test-topics">
                        ${test.topics.map(topic => `<span>${topic}</span>`).join(', ')}
                    </div>
                    <div class="test-status status-completed">
                        Completed
                    </div>
                </div>
            `).join('');
        },

        setupTabNavigation() {
            const tabBtns = document.querySelectorAll('.tab-btn');
            const testContents = document.querySelectorAll('.test-content');

            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Remove active class from all buttons and contents
                    tabBtns.forEach(b => b.classList.remove('active'));
                    testContents.forEach(c => c.classList.remove('active'));

                    // Add active class to clicked button and corresponding content
                    btn.classList.add('active');
                    const tabId = btn.dataset.tab + '-tests';
                    document.getElementById(tabId).classList.add('active');
                });
            });
        },

        init() {
            if (document.querySelector('.tests')) {
                this.updateCountdown();
                this.updateTestSchedule();
                this.updatePastTests();
                this.setupTabNavigation();
                
                // Update countdown every second
                setInterval(() => this.updateCountdown(), 1000);
                
                // Update schedules every minute
                setInterval(() => {
                    this.updateTestSchedule();
                    this.updatePastTests();
                }, 60000);

                // Add smooth animation to clock
                requestAnimationFrame(() => {
                    document.querySelector('.clock-circle').style.transition = 'transform 0.5s ease';
                });
            }
        }
    };

    // Initialize test scheduler if on tests page
    testScheduler.init();

    // --- Lectures Page ---
    const lectures = [
        { title: 'Python for Beginners', url: 'https://www.udemy.com/course/pythonforbeginners/', source: 'Udemy' },
        { title: 'Web Development Bootcamp', url: 'https://www.udemy.com/course/the-web-developer-bootcamp/', source: 'Udemy' },
        { title: 'JavaScript Essentials', url: 'https://www.linkedin.com/learning/javascript-essential-training-3', source: 'LinkedIn' },
        { title: 'Springboard Data Science Career Track', url: 'https://www.springboard.com/workshops/data-science-career-track/', source: 'Springboard' },
        { title: 'HTML & CSS Fundamentals', url: 'https://www.linkedin.com/learning/html-essential-training-4', source: 'LinkedIn' },
        { title: 'Machine Learning Foundations', url: 'https://www.springboard.com/workshops/machine-learning/', source: 'Springboard' },
        { title: 'React - The Complete Guide', url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', source: 'Udemy' },
        { title: 'SQL for Data Analysis', url: 'https://www.linkedin.com/learning/sql-for-data-analysis', source: 'LinkedIn' },
        { title: 'Springboard Software Engineering', url: 'https://www.springboard.com/workshops/software-engineering-career-track/', source: 'Springboard' },
        { title: 'Full Stack Web Development', url: 'https://letsupgrade.in/web-development-bootcamp', source: 'LetsUpgrade' },
        { title: 'Data Science Bootcamp', url: 'https://letsupgrade.in/data-science-bootcamp', source: 'LetsUpgrade' }
    ];
    const lectureList = document.getElementById('lecture-list');
    if (lectureList) {
        lectures.forEach(lec => {
            const div = document.createElement('div');
            div.className = 'lecture-item course-card';
            div.innerHTML = `
                <span class="course-title">${lec.title}</span>
                <span class="course-source ${lec.source.toLowerCase()}-badge">${lec.source}</span>
                <a href="${lec.url}" target="_blank" class="lecture-link-btn">Go to Course</a>
            `;
            lectureList.appendChild(div);
        });
    }
    const lectureSelect = document.getElementById('lecture-select');
    if (lectureSelect) {
        lectures.forEach(lec => {
            const opt = document.createElement('option');
            opt.value = lec.title;
            opt.textContent = lec.title;
            lectureSelect.appendChild(opt);
        });
    }
    const lectureRegisterForm = document.getElementById('lecture-register-form');
    if (lectureRegisterForm) {
        lectureRegisterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            document.getElementById('register-success').style.display = 'block';
            lectureRegisterForm.reset();
        });
    }

    // --- Notes Page ---
    const notes = [
        { topic: 'Python Basics', pdf: 'assets/notes/python-basics-sample-chapters.pdf' },
        { topic: 'C Programming', pdf: 'assets/notes/html-css.pdf' },
        { topic: 'C++', pdf: 'assets/notes/js-fundamentals.pdf' },
        // { topic: 'Algorithms', pdf: 'assets/notes/algorithms.pdf' }
    ];
    const notesList = document.getElementById('notes-list');
    if (notesList) {
        notes.forEach(note => {
            const div = document.createElement('div');
            div.className = 'note-item';
            div.innerHTML = `<strong>${note.topic}</strong> - <a href="${note.pdf}" download>Download PDF</a>`;
            notesList.appendChild(div);
        });
    }

    // --- Daily Tasks Page ---
    const providedTasks = [
        { id: 1, title: 'Available Soon', details: '' },
        { id: 2, title: 'Available Soon', details: '' },
        { id: 3, title: 'Available Soon', details: ''}
    ];
    const providedTasksDiv = document.getElementById('provided-tasks');
    if (providedTasksDiv) {
        providedTasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'provided-task';
            taskDiv.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.details}</p>
                <button onclick="openTaskSubmission(${task.id}, '${task.title.replace(/'/g, "\'")}')">Submit Task</button>
                <div id="submission-form-${task.id}" class="submission-form" style="display:none;">
                    <form onsubmit="return submitProvidedTask(event, ${task.id}, '${task.title.replace(/'/g, "\'")}')">
                        <input type='text' name='studentName' placeholder='Your Name' required>
                        <textarea name='taskContent' placeholder='Paste your work or link here' required></textarea>
                        <button type='submit'>Submit</button>
                    </form>
                </div>
            `;
            providedTasksDiv.appendChild(taskDiv);
        });
    }
    window.openTaskSubmission = function(id, title) {
        document.querySelectorAll('.submission-form').forEach(f => f.style.display = 'none');
        document.getElementById('submission-form-' + id).style.display = 'block';
    }
    window.submitProvidedTask = function(e, id, title) {
        e.preventDefault();
        const form = e.target;
        const name = form.studentName.value.trim();
        const content = form.taskContent.value.trim();
        if (!name || !content) return false;
        // Bonus points calculation
        const now = new Date();
        let bonus = 0;
        if (now.getHours() < 12) bonus = 5;
        else if (now.getHours() < 18) bonus = 2;
        // Save to localStorage
        const tasks = JSON.parse(localStorage.getItem('clubTasks') || '[]');
        tasks.push({ name, title, content, status: 'Completed', bonus });
        localStorage.setItem('clubTasks', JSON.stringify(tasks));
        document.getElementById('task-success').style.display = 'block';
        form.reset();
        form.parentElement.style.display = 'none';
        renderProgressTable();
        return false;
    }
    renderProgressTable();
    function renderProgressTable() {
        const tableBody = document.querySelector('#progress-table tbody');
        if (!tableBody) return;
        tableBody.innerHTML = '';
        const tasks = JSON.parse(localStorage.getItem('clubTasks') || '[]');
        tasks.forEach(task => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${task.name}</td><td>${task.title}</td><td>${task.status}</td><td>${task.bonus}</td>`;
            tableBody.appendChild(tr);
        });
    }

    // --- Weekly Tests Page ---
    const testSchedule = [
        { date: '2025-09-20', topic: 'Python Basics' },
        { date: '2025-09-27', topic: 'Web Development' },
        { date: '2025-10-04', topic: 'Algorithms' }
    ];
    const testScheduleList = document.getElementById('test-schedule-list');
    if (testScheduleList) {
        testSchedule.forEach(test => {
            const li = document.createElement('li');
            li.textContent = `${test.date}: ${test.topic}`;
            testScheduleList.appendChild(li);
        });
    }
    // Leaderboard
    function getLeaderboard() {
        // Simulate test scores from localStorage
        const scores = JSON.parse(localStorage.getItem('clubScores') || '[]');
        // Aggregate by student name
        const scoreMap = {};
        scores.forEach(s => {
            if (!scoreMap[s.name]) scoreMap[s.name] = 0;
            scoreMap[s.name] += s.score;
        });
        // Convert to array and sort
        const leaderboard = Object.entries(scoreMap).map(([name, score]) => ({ name, score })).sort((a, b) => b.score - a.score).slice(0, 10);
        return leaderboard;
    }
    function renderLeaderboard() {
        const tbody = document.querySelector('#leaderboard-table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        const leaderboard = getLeaderboard();
        leaderboard.forEach((entry, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${idx + 1}</td><td>${entry.name}</td><td>${entry.score}</td>`;
            tbody.appendChild(tr);
        });
    }
    renderLeaderboard();

    // --- Student Dashboard Page ---
    function renderDashboard() {
        const dash = document.getElementById('student-dashboard');
        if (!dash) return;
        // Get student name from localStorage
        let studentName = localStorage.getItem('clubStudentName');
        if (!studentName) {
            dash.innerHTML = '<p>Please login to view your dashboard.</p>';
            return;
        }
        // Get tasks
        const tasks = JSON.parse(localStorage.getItem('clubTasks') || '[]').filter(t => t.name === studentName);
        // Get scores
        const scores = JSON.parse(localStorage.getItem('clubScores') || '[]').filter(s => s.name === studentName);
        // Bonus points
        const bonus = tasks.reduce((sum, t) => sum + (t.bonus || 0), 0);
        // Overall progress
        dash.innerHTML = `
            <h2>Hello, ${studentName}!</h2>
            <div><strong>Completed Tasks:</strong> ${tasks.length}</div>
            <div><strong>Test Scores:</strong> ${scores.map(s => s.score).join(', ') || 'None'}</div>
            <div><strong>Bonus Points Earned:</strong> ${bonus}</div>
            <div><strong>Overall Progress:</strong> ${(tasks.length + scores.length) ? 'Active' : 'Getting Started'}</div>
        `;
    }
    renderDashboard();
});

// --- Simulate test score submission for demo ---
// Uncomment below to add test scores for demo purposes
// localStorage.setItem('clubScores', JSON.stringify([
//     { name: 'Alice', score: 95 },
//     { name: 'Bob', score: 88 },
//     { name: 'Charlie', score: 92 },
//     { name: 'Alice', score: 90 },
//     { name: 'Bob', score: 85 }
// ]));
