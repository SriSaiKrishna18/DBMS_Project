// Advanced AI Chatbot for Student Portal using OpenAI API
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input-field');
    const chatbotSendBtn = document.getElementById('chatbot-send-btn');

    // Initial welcome message
    const welcomeMessage = "Hello! I'm your AI Student Assistant. I can help with information about your courses, attendance, results, and more. How can I assist you today?";
    
    // Chat history for context
    let chatHistory = [];
    
    // Add welcome message when chat is opened
    let welcomeShown = false;

    // Toggle chatbot visibility
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.add('active');
        if (!welcomeShown) {
            addBotMessage(welcomeMessage);
            welcomeShown = true;
        }
    });

    // Close chatbot
    chatbotClose.addEventListener('click', () => {
        chatbotContainer.classList.remove('active');
    });

    // Send message on button click
    chatbotSendBtn.addEventListener('click', sendMessage);

    // Send message on Enter key
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Function to send user message
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message !== '') {
            // Add user message to chat
            addUserMessage(message);
            
            // Add to chat history
            chatHistory.push({ role: 'user', content: message });
            
            // Clear input field
            chatbotInput.value = '';
            
            // Show typing indicator
            showTypingIndicator();
            
            // Get AI response
            getAIResponse(message);
        }
    }

    // Function to get AI response
    async function getAIResponse(message) {
        try {
            // Gather context from the website
            const context = gatherWebsiteContext();
            
            // Prepare the prompt with context
            const prompt = `
                You are an AI assistant for a student portal. 
                The student's current information:
                ${context}
                
                Please respond to the following query in a helpful, concise manner:
                ${message}
            `;
            
            // In a real implementation, you would call the OpenAI API here
            // For now, we'll simulate the API call with our own function
            const response = await simulateAIResponse(prompt, message);
            
            // Remove typing indicator
            removeTypingIndicator();
            
            // Add AI response to chat
            addBotMessage(response);
            
            // Add to chat history
            chatHistory.push({ role: 'assistant', content: response });
            
            // Limit chat history length to prevent token limits
            if (chatHistory.length > 10) {
                chatHistory = chatHistory.slice(chatHistory.length - 10);
            }
        } catch (error) {
            console.error('Error getting AI response:', error);
            removeTypingIndicator();
            addBotMessage("I'm sorry, I encountered an error. Please try again later.");
        }
    }

    // Function to gather context from the website
    function gatherWebsiteContext() {
        let context = "";
        
        // Get student profile information
        const studentName = document.querySelector('.student-name')?.textContent || 'Student';
        const studentRoll = document.querySelector('.student-roll')?.textContent || 'Unknown';
        const studentDepartment = document.querySelector('.student-department')?.textContent || 'Unknown';
        const studentSemester = document.querySelector('.student-semester')?.textContent || 'Unknown';
        const studentCGPA = document.querySelector('.student-cgpa')?.textContent || 'Unknown';
        
        // Get attendance information
        const attendanceValue = document.querySelector('.progress-value')?.textContent || 'Unknown';
        
        // Get current page
        const activePage = document.querySelector('.content:not(.hidden)')?.id || 'home';
        
        // Compile context
        context += `Name: ${studentName}\n`;
        context += `Roll Number: ${studentRoll}\n`;
        context += `Department: ${studentDepartment}\n`;
        context += `Current Semester: ${studentSemester}\n`;
        context += `CGPA: ${studentCGPA}\n`;
        context += `Overall Attendance: ${attendanceValue}\n`;
        context += `Current Page: ${activePage}\n`;
        
        // Get course information if available
        const courseElements = document.querySelectorAll('.course-card');
        if (courseElements.length > 0) {
            context += "Courses:\n";
            courseElements.forEach(course => {
                const courseName = course.querySelector('h3')?.textContent || 'Unknown';
                const courseProgress = course.querySelector('.progress-bar')?.getAttribute('data-progress') || 'Unknown';
                context += `- ${courseName}: ${courseProgress}% complete\n`;
            });
        }
        
        return context;
    }

    // Function to simulate AI response (replace with actual API call in production)
    async function simulateAIResponse(prompt, message) {
        // In production, replace this with an actual API call to OpenAI or similar service
        // Example OpenAI API call:
        /*
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${YOUR_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: prompt },
                    ...chatHistory
                ],
                max_tokens: 150,
                temperature: 0.7
            })
        });
        
        const data = await response.json();
        return data.choices[0].message.content;
        */
        
        // For now, simulate responses based on keywords
        return await new Promise(resolve => {
            setTimeout(() => {
                const lowerMessage = message.toLowerCase();
                
                // Get student name from the page
                const studentName = document.querySelector('.student-name')?.textContent || 'Student';
                const studentCGPA = document.querySelector('.student-cgpa')?.textContent || '8.5';
                const attendance = document.querySelector('.progress-value')?.textContent || '87%';
                
                if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
                    resolve(`Hello ${studentName}! How can I help you today?`);
                } 
                else if (lowerMessage.includes('name')) {
                    resolve(`Your name is ${studentName} according to our records.`);
                }
                else if (lowerMessage.includes('attendance')) {
                    resolve(`Your current overall attendance is ${attendance}. The minimum required attendance is 75% to be eligible for exams.`);
                }
                else if (lowerMessage.includes('cgpa') || lowerMessage.includes('gpa')) {
                    resolve(`Your current CGPA is ${studentCGPA}. Keep up the good work!`);
                }
                else if (lowerMessage.includes('result') || lowerMessage.includes('grade') || lowerMessage.includes('marks')) {
                    resolve(`Your results can be viewed on the Results page. Your current CGPA is ${studentCGPA}.`);
                }
                else if (lowerMessage.includes('course') || lowerMessage.includes('subject')) {
                    const activeCourses = document.querySelectorAll('.course-card h3');
                    if (activeCourses.length > 0) {
                        let courseList = "You are currently enrolled in: ";
                        activeCourses.forEach((course, index) => {
                            courseList += course.textContent;
                            if (index < activeCourses.length - 1) {
                                courseList += ", ";
                            }
                        });
                        resolve(courseList);
                    } else {
                        resolve("You can find all your enrolled courses on the Courses page. Each course card shows your progress and important details.");
                    }
                }
                else if (lowerMessage.includes('assignment') || lowerMessage.includes('homework')) {
                    resolve("You have 3 pending assignments: Database Systems (due in 2 days), Computer Networks (due in 5 days), and Software Engineering (due next week).");
                }
                else if (lowerMessage.includes('exam') || lowerMessage.includes('test')) {
                    resolve("Your next exam is scheduled for Database Systems on 15th November. Check the Academic Calendar for the complete exam schedule.");
                }
                else if (lowerMessage.includes('fee') || lowerMessage.includes('payment')) {
                    resolve("Your fee payment for this semester has been completed. The next payment is due on January 15th.");
                }
                else if (lowerMessage.includes('holiday') || lowerMessage.includes('vacation')) {
                    resolve("The upcoming holidays are: Diwali (Nov 12-13) and Winter Break (Dec 20 - Jan 5).");
                }
                else if (lowerMessage.includes('thank')) {
                    resolve("You're welcome! Feel free to ask if you need any more help.");
                }
                else if (lowerMessage.includes('bye')) {
                    resolve("Goodbye! Have a great day!");
                }
                else if (lowerMessage.includes('profile')) {
                    resolve(`I can see your profile information. Your name is ${studentName}, you're in the ${document.querySelector('.student-department')?.textContent} department, and you're currently in semester ${document.querySelector('.student-semester')?.textContent}.`);
                }
                else if (lowerMessage.includes('help')) {
                    resolve("I can help you with information about your attendance, courses, results, profile, assignments, exams, and more. Just ask me what you'd like to know!");
                }
                else {
                    resolve("I'm not sure I understand. Could you please rephrase your question? You can ask about your attendance, results, courses, assignments, exams, or profile information.");
                }
            }, 1500);
        });
    }

    // Function to add user message to chat
    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'user-message');
        messageElement.textContent = message;
        chatbotMessages.appendChild(messageElement);
        scrollToBottom();
    }

    // Function to add bot message to chat
    function addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'bot-message');
        messageElement.textContent = message;
        chatbotMessages.appendChild(messageElement);
        scrollToBottom();
    }

    // Function to show typing indicator
    function showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.classList.add('chatbot-typing');
        typingElement.innerHTML = `
            <span>AI is typing</span>
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        typingElement.id = 'typing-indicator';
        chatbotMessages.appendChild(typingElement);
        scrollToBottom();
    }

    // Function to remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Function to scroll chat to bottom
    function scrollToBottom() {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
});



// Update the getAIResponse function to use our API
async function getAIResponse(message) {
    try {
        // Gather context from the website
        const context = gatherWebsiteContext();
        
        // Show typing indicator
        showTypingIndicator();
        
        // Call our backend API
        const response = await fetch('/api/chatbot/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message,
                context,
                history: chatHistory
            })
        });
        
        // Check if the response is ok
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get AI response');
        }
        
        // Parse the response
        const data = await response.json();
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add AI response to chat
        addBotMessage(data.response);
        
        // Add to chat history
        chatHistory.push({ role: 'assistant', content: data.response });
        
        // Limit chat history length to prevent token limits
        if (chatHistory.length > 10) {
            chatHistory = chatHistory.slice(chatHistory.length - 10);
        }
    } catch (error) {
        console.error('Error getting AI response:', error);
        removeTypingIndicator();
        addBotMessage("I'm sorry, I encountered an error. Please try again later.");
    }
}


// Initialize chat variables
let chatHistory = [];
const studentId = localStorage.getItem('studentId'); // Get student ID from localStorage

// Function to send message to chatbot API
async function sendMessage() {
    const messageInput = document.getElementById('chat-input');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // Clear input
    messageInput.value = '';
    
    // Add user message to chat
    addUserMessage(message);
    
    try {
        // Show typing indicator
        showTypingIndicator();
        
        // Call our backend API
        const response = await fetch('/api/chatbot/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message,
                studentId, // Send student ID with request
                history: chatHistory
            })
        });
        
        // Check if the response is ok
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get AI response');
        }
        
        // Parse the response
        const data = await response.json();
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add AI response to chat
        addBotMessage(data.response);
        
        // Add to chat history
        chatHistory.push({ role: 'user', content: message });
        chatHistory.push({ role: 'assistant', content: data.response });
        
        // Limit chat history length to prevent token limits
        if (chatHistory.length > 20) {
            chatHistory = chatHistory.slice(chatHistory.length - 20);
        }
    } catch (error) {
        console.error('Error getting AI response:', error);
        removeTypingIndicator();
        addBotMessage("I'm sorry, I encountered an error. Please try again later.");
    }
}

// Function to add user message to chat
function addUserMessage(message) {
    const chatMessages = document.querySelector('.chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'user-message');
    messageElement.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(messageElement);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to add bot message to chat
function addBotMessage(message) {
    const chatMessages = document.querySelector('.chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'bot-message');
    
    // Convert markdown-like formatting to HTML
    const formattedMessage = message
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
    
    messageElement.innerHTML = `<p>${formattedMessage}</p>`;
    chatMessages.appendChild(messageElement);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to show typing indicator
function showTypingIndicator() {
    const chatMessages = document.querySelector('.chat-messages');
    const typingElement = document.createElement('div');
    typingElement.classList.add('message', 'bot-message', 'typing-indicator');
    typingElement.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
    typingElement.id = 'typing-indicator';
    chatMessages.appendChild(typingElement);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Load chat history when page loads
async function loadChatHistory() {
    if (!studentId) return;
    
    try {
        const response = await fetch(`/api/chatbot/history/${studentId}`);
        if (!response.ok) return;
        
        const data = await response.json();
        
        // Display previous messages
        data.forEach(msg => {
            if (msg.role === 'user') {
                addUserMessage(msg.content);
            } else {
                addBotMessage(msg.content);
            }
        });
        
        // Update chat history
        chatHistory = data;
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    
    // Load chat history
    loadChatHistory();
    
    // Send message on form submit
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sendMessage();
    });
    
    // Send message on Enter key (but allow Shift+Enter for new line)
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});