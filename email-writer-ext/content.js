console.log("Email Writer Extension - Content Script Loaded");

function createAIButton() {
   const button = document.createElement('div');
   button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
   button.style.marginRight = '8px';
   button.innerHTML = 'AI Reply';
   button.setAttribute('role','button');
   button.setAttribute('data-tooltip','Generate AI Reply');
   return button;
}

function getEmailContent() {
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trim();
        }
        return '';
    }
}


function findComposeToolbar() {
    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
        return null;
    }
}

function injectButton() {
    const existingButton = document.querySelector('.ai-reply-button');
    if (existingButton) existingButton.remove();

    const existingDropdown = document.querySelector('.ai-tone-select');
    if (existingDropdown) existingDropdown.remove();

    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log("Toolbar not found");
        return;
    }

    console.log("Toolbar found, creating AI button");

    const button = createAIButton();
    button.classList.add('ai-reply-button');

    // Create tone selector dropdown but keep it hidden initially
    const toneSelect = document.createElement('select');
    toneSelect.className = 'ai-tone-select';
    toneSelect.style.marginLeft = '8px';
    toneSelect.style.height = '28px';
    toneSelect.style.borderRadius = '4px';
    toneSelect.style.border = '1px solid #dadce0';
    toneSelect.style.background = '#fff';
    toneSelect.style.fontSize = '13px';
    toneSelect.style.color = '#202124';
    toneSelect.style.padding = '0 6px';
    toneSelect.title = 'Select tone for AI reply';
    toneSelect.style.display = 'none'; // hidden initially

    const tones = [
        { value: 'professional', label: 'Professional' },
        { value: 'casual', label: 'Casual' },
        { value: 'friendly', label: 'Friendly' }
    ];

    tones.forEach(tone => {
        const option = document.createElement('option');
        option.value = tone.value;
        option.textContent = tone.label;
        toneSelect.appendChild(option);
    });

    // Append the button and dropdown to the toolbar
    toolbar.insertBefore(button, toolbar.firstChild);
    toolbar.insertBefore(toneSelect, button.nextSibling);

    // Flag to track if dropdown is visible
    let dropdownVisible = false;

    button.addEventListener('click', () => {
        if (!dropdownVisible) {
            toneSelect.style.display = 'inline-block';
            dropdownVisible = true;
            toneSelect.focus();
        } else {
            toneSelect.style.display = 'none';
            dropdownVisible = false;
        }
    });

    toneSelect.addEventListener('change', async () => {
        const selectedTone = toneSelect.value;
        toneSelect.style.display = 'none';
        dropdownVisible = false;

        button.innerHTML = 'Generating...';
        button.disabled = true;

        try {
            const emailContent = getEmailContent();

            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: selectedTone
                })
            });

            if (!response.ok) {
                throw new Error('API Request Failed');
            }

            const generatedReply = await response.text();
            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');

            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            } else {
                console.error('Compose box was not found');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to generate reply');
        } finally {
            button.innerHTML = 'AI Reply';
            button.disabled = false;
        }
    });
}

const observer = new MutationObserver((mutations) => {
    for(const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE && 
            (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]'))
        );

        if (hasComposeElements) {
            console.log("Compose Window Detected");
            setTimeout(injectButton, 500);
        }
    }
});


observer.observe(document.body, {
    childList: true,
    subtree: true
});