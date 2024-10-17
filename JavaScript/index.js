document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('form')
    const input = document.getElementById('console-input')
    const output = document.getElementById('console-area')

    const gameTab = document.getElementById('game-tab');
    const gameContainer = document.getElementById('game-container');

    if (!gameTab || !gameContainer) {
        console.error("Les éléments 'game-tab' ou 'game-container' sont introuvables dans le DOM.");
        return;
    }

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    gameTab.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - gameContainer.offsetLeft;
        offsetY = e.clientY - gameContainer.offsetTop;
        gameTab.style.cursor = "grabbing";
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            gameContainer.style.left = e.clientX - offsetX + 'px';
            gameContainer.style.top = e.clientY - offsetY + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        gameTab.style.cursor = "move";
    });

    const closeButton = document.getElementById('game-close');
    closeButton.addEventListener('click', function () {
        gameContainer.classList.add('hidden')
        input.style.display = 'flex'
        display('> Game closed !')
    });

    const resizeButton = document.getElementById('game-size')
    let sized = false
    resizeButton.addEventListener('click', function () {
        if (sized === false) {
            sized = true
            gameContainer.classList.add('full')
            gameContainer.classList.remove('nfull')

            gameContainer.style.width = '100vw';
            gameContainer.style.height = '100vh';
            gameContainer.style.left = '0';
            gameContainer.style.top = '0';
            gameContainer.style.transform = 'none';
        } else {
            sized = false
            gameContainer.classList.add('nfull')
            gameContainer.classList.remove('full')

            gameContainer.style.width = '500px';
            gameContainer.style.height = '400px';
            gameContainer.style.left = '50%';
            gameContainer.style.top = '50%';
            gameContainer.style.transform = 'translateX(-50%) translateY(-50%)';
        }
    })

    const lineHeight = 35;
    let maxLines = calculateMaxLines();

    let isAtBottom = true

    let rpsWin = 0

    const aliases = {
        h: 'help',
        cfg: 'config',
        cl: 'clear',
        calc: 'calculate',
        d: 'date',
        tm: 'timer',
        clstg: 'celeste-game'
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const inputValue = input.value.trim()

        if (inputValue) {
            process(inputValue)
            input.value = ''
        }
    })

    function display(text) {
        const textLine = document.createElement("p");
        textLine.textContent = text;
        output.appendChild(textLine);

        if (isAtBottom) {
            output.scrollTop = output.scrollHeight;
        }
    }

    function calculateMaxLines() {
        const consoleHeight = output.clientHeight;
        return Math.floor(consoleHeight / lineHeight);
    }

    function process(command) {
        if (!command.startsWith('/')) {
            display(command)
        } else {
            const trimmedCommand = command.slice(1).trim()
            const parts = trimmedCommand.split(' ')
            const cmd = parts[0]

            const mainCommand = aliases[cmd] || cmd;

            switch (mainCommand) {
                case 'help':
                    display(`/help - /h  -  Display list of commands.
                        \n/config - /cfg
                        \n       L color [w/y/r/g/b]  -  Change main color.
                        \n       L theme [dark/light]  -  Change theme color.
                        \n       L bg [dark/light]  -  Change background color.
                        \n/clear - /cl  -  Clear the console.
                        \n/calculate - /calc (expression)  -  Calculate an expression.
                        \n/date - /d  -  Display today's date and current hour.
                        \n/timer - /tm (timer)  -  Start a countdown.
                        \n/rps
                        \n       L [rock/paper/scissors]  -  Play your choice against the computer.
                        \n       L score  -  Check your rps score.
                        \n/celeste-game - /clstg  -  Play my Portfolio (NOT FINISHED !).`);
                    break;

                case 'config':
                    if (!parts[1]) {
                        display('Error : missing argument.');
                    } else if (parts[1] === 'color') {
                        if (!parts[2]) {
                            display('Error : missing argument.');
                        } else {
                            const colors = {
                                w: '#ffffff',
                                y: '#ffff00',
                                r: '#ff0000',
                                g: '#00ff00',
                                b: '#0000ff',
                                k: '#000000'
                            };
                            if (colors[parts[2]]) {
                                document.documentElement.style.setProperty('--console-color', colors[parts[2]]);
                                display(`> Color changed to ${parts[2]}.`);
                            } else {
                                display('Error : unknown color.');
                            }
                        }
                    } else if (parts[1] === 'theme') {
                        if (!parts[2]) {
                            display('Error : missing argument.');
                        } else {
                            const themes = {
                                light: '#ddd',
                                dark: '#151515'
                            };
                            if (themes[parts[2]]) {
                                document.documentElement.style.setProperty('--theme', themes[parts[2]]);
                                display(`> Theme changed to ${parts[2]}.`);
                            } else {
                                display('Error : unknown theme.');
                            }
                        }
                    } else if (parts[1] === 'bg') {
                        if (!parts[2]) {
                            display('Error : missing argument.');
                        } else {
                            const bg = {
                                light: '#ffffff',
                                dark: '#000000'
                            };
                            const nbg = {
                                light: '#000000',
                                dark: '#ffffff'
                            }
                            if (bg[parts[2]]) {
                                document.documentElement.style.setProperty('--console-bg', bg[parts[2]]);
                                document.documentElement.style.setProperty('--nconsole-bg', nbg[parts[2]]);
                                display(`> Background changed to ${parts[2]}.`);
                            } else {
                                display('Error : unknown theme.');
                            }
                        }
                    } else {
                        display('Error : unknown configuration.');
                    }
                    break;
                case 'clear':
                    output.innerHTML = '';
                    break;
                case 'calculate':
                    if (!parts[1]) {
                        display('Error : missing expression.');
                    } else {
                        const expression = trimmedCommand.slice(cmd.length + 1).replace(/\^/g, '**')

                        try {
                            const result = eval(expression)
                            display(`> ${expression} = ${result}`)
                        } catch (error) {
                            display('Error : invalid expression provided.')
                        }
                    }
                    break;
                case 'date' :
                    const now = new Date();
                    const formattedDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                    display(`> ${formattedDate}`)

                    break;
                case 'timer':
                    let count = parseInt(parts[1]);
                    if (!isNaN(count) && count > 0 && count <= 60) {
                        let countdownInterval = setInterval(() => {
                            display(`> ${count}`);
                            count--;
                            if (count < 0) {
                                clearInterval(countdownInterval);
                                display('> Timer finished !');
                            }
                        }, 1000);
                    } else {
                        display('Error : invalid number provided.');
                    }
                    break;
                case 'rps' :
                    const choices = ['rock', 'paper', 'scissors']
                    const playerChoice = parts[1];
                    if (choices.includes(playerChoice)) {
                        const computerChoice = choices[Math.floor(Math.random() * 3)];
                        let result = '';
                        if (playerChoice === computerChoice) {
                            result = "Tie.";
                        } else if (
                            (playerChoice === 'rock' && computerChoice === 'scissors') ||
                            (playerChoice === 'scissors' && computerChoice === 'paper') ||
                            (playerChoice === 'paper' && computerChoice === 'rock')
                        ) {
                            rpsWin += 1
                            result = "Win.";
                        } else {
                            result = "Lose.";
                        }
                        display(`> You : ${playerChoice}.\n> Computer : ${computerChoice}.\n> ${result}`);
                    } else if (playerChoice === 'score') {
                        display(`> Rock-Paper-Scissors Score : ${rpsWin}`)
                    } else {
                        display('Error : invalid play.');
                    }
                    break;

                case 'celeste-game' :
                    removeConsole()
                    display('> Removing console access...')
                    setTimeout(() => {
                        display('> Recovering data...')
                    }, 1500)
                    setTimeout(() => {
                        display('> Game is starting !')
                    }, 3500)
                    setTimeout(() => {
                        launchGame()
                    }, 4000);
                    break;
                default:
                    display(`> No "/${cmd}" command found.`);
            }
        }
    }

    function launchGame () {
        gameContainer.classList.remove('hidden')
    }
    
    function removeConsole () {
        input.style.display = 'none'
    }

    output.addEventListener('scroll', () => {
        const atBottom = output.scrollHeight - output.clientHeight <= output.scrollTop + 1;
        isAtBottom = atBottom;
    });


    window.addEventListener('resize', () => {
        maxLines = calculateMaxLines();
    });
});
