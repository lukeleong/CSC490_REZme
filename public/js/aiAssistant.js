function initAiAssistant() {
    console.log("AI Assistant initialization starting...");
    
    // Create a simple fixed position div for the AI assistant
    const assistantHTML = `
    <div id="fitnessAiAssistant" style="display: none; position: fixed; right: 20px; bottom: 20px; width: 350px; 
         background: white; box-shadow: 0 0 10px rgba(0,0,0,0.2); border-radius: 8px; padding: 15px; z-index: 1000;">
        <h3 style="margin-top: 0; color: #0066cc;">Fitness Recovery Assistant</h3>
        <textarea id="fitnessAiQuestion" placeholder="Ask about exercises, recovery, or injuries..." 
               style="width: 100%; padding: 8px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; height: 60px; resize: none;"></textarea>
        <div id="fitnessAiResponse" style="margin-top: 10px; max-height: 200px; overflow-y: auto; display: none; background: #f7f9fc; padding: 10px; border-radius: 4px; border: 1px solid #e1e5eb;"></div>
        <div style="margin-top: 10px; display: flex; justify-content: space-between;">
            <button id="askFitnessAiBtn" style="padding: 8px 15px; background: #0066cc; color: white; border: none; 
                    border-radius: 4px; cursor: pointer;">Ask</button>
            <button id="closeFitnessAiBtn" style="padding: 8px 15px; background: #f0f0f0; border: none; 
                    border-radius: 4px; cursor: pointer;">Close</button>
        </div>
    </div>`;
    
    // Add the HTML to the page
    document.body.insertAdjacentHTML('beforeend', assistantHTML);
    
    // Add the button to the navbar
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
      if (!document.getElementById('toggleFitnessAiButton')) {
        const aiButton = document.createElement('a');
        aiButton.href = '#';
        aiButton.id = 'toggleFitnessAiButton';
        aiButton.textContent = 'Recovery Assistant';
        aiButton.style.marginLeft = '15px';
        aiButton.style.color = '#0066cc';
        aiButton.style.fontWeight = 'bold';
        
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
          navLinks.insertBefore(aiButton, logoutButton);
        } else {
          navLinks.appendChild(aiButton);
        }
      }
    } else {
      // Code for adding if no navbar
      const aiButton = document.createElement('button');
      aiButton.id = 'toggleFitnessAiButton';
      aiButton.textContent = 'Recovery Assistant';
      aiButton.style.position = 'fixed';
      aiButton.style.top = '20px';
      aiButton.style.right = '20px';
      aiButton.style.padding = '8px 15px';
      aiButton.style.background = '#0066cc';
      aiButton.style.color = 'white';
      aiButton.style.border = 'none';
      aiButton.style.borderRadius = '4px';
      aiButton.style.cursor = 'pointer';
      aiButton.style.zIndex = '999';
      document.body.appendChild(aiButton);
    }
    
    // Set up event listeners
    const toggleButton = document.getElementById('toggleFitnessAiButton');
    const assistantDiv = document.getElementById('fitnessAiAssistant');
    const closeButton = document.getElementById('closeFitnessAiBtn');
    const askButton = document.getElementById('askFitnessAiBtn');
    const questionInput = document.getElementById('fitnessAiQuestion');
    const responseDiv = document.getElementById('fitnessAiResponse');
    
    toggleButton.addEventListener('click', function(e) {
      e.preventDefault();
      assistantDiv.style.display = assistantDiv.style.display === 'none' ? 'block' : 'none';
      if (assistantDiv.style.display === 'block') {
        questionInput.focus();
      }
    });
    
    closeButton.addEventListener('click', function() {
      assistantDiv.style.display = 'none';
      questionInput.value = '';
      responseDiv.style.display = 'none';
    });
    
    askButton.addEventListener('click', askFitnessQuestion);
    
    questionInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        askFitnessQuestion();
      }
    });
    
    async function askFitnessQuestion() {
      const question = questionInput.value.trim();
      const token = localStorage.getItem('token');
      
      if (!question) {
        alert('Please enter a question');
        return;
      }
      
      responseDiv.innerHTML = '<div style="text-align: center;"><div style="display: inline-block; width: 20px; height: 20px; border: 3px solid #f3f3f3; border-radius: 50%; border-top: 3px solid #0066cc; animation: spin 1s linear infinite;"></div> Getting your answer...</div>';
      responseDiv.style.display = 'block';
      
      try {
        const response = await fetch('/users/ask-hf-ai', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ question })
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
            return;
          }
          throw new Error('Failed to get answer');
        }
        
        const data = await response.json();
        
        if (data.error) {
          responseDiv.innerHTML = `<p style="color: #721c24;">${data.error}</p>`;
        } else {
          responseDiv.innerHTML = `<p><strong>Your question:</strong> ${question}</p><p><strong>Answer:</strong> ${data.answer || 'Sorry, I couldn\'t find an answer to that question.'}</p>`;
        }
        
      } catch (error) {
        console.error('Error asking AI:', error);
        responseDiv.innerHTML = '<p style="color: #721c24;">Sorry, there was an error processing your question. Please try again.</p>';
      }
    }
  
    // Add animation for fidget spinner
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleSheet);
  
    console.log("AI Assistant initialization complete");
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAiAssistant);
  } else {
    initAiAssistant();
  }