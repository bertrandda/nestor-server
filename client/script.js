/**
 * Insert bot response in terminal
 * @param {*} data bot response
 */
function insertResponse(reply) {
    let terminal = document.getElementById('history');

    reply.forEach(element => {
        if (element.type === 'text') {        
            terminal.innerHTML += `<p class="response">${element.content}</p>`;
        }
    });
}

/**
 * Auto focus on input
 */
function autoFocus() {
    document.getElementById('input').focus();
}

/**
 * Avoid wrong contentEditable caret position with '>' character
 */
function initInput() {
    let input = document.getElementById('input');
    if (input.innerText.length === 0)
        input.innerHTML = '&#20';
}

/**
 * Confirm request with enter
 * @param {*} event current event
 */
function onKeyPressInput(event) {
    if (event.keyCode == 13) {  // If key 'Enter'
        event.preventDefault();
        const input = document.getElementById('input');
        requestBot();
        document.getElementById('history').innerHTML += `<p class="command">${input.innerHTML}</p>`;
        input.innerHTML = ' ';
        setTimeout(input.scrollIntoView(), 500);
    }
}