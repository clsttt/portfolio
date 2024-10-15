document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('form')
    const input = document.getElementById('console-input')
    const output = document.getElementById('console-area')

    const lineHeight = 35;
    let maxLines = calculateMaxLines();

    let isAtBottom = true

    let rpsWin = 0

    const aliases = {
        h: 'help',
        cfg: 'config',
        cl: 'clear',
        calc: 'calculate',
        cd: 'countdown'
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
                    display(`/help  -  Display list of commands.
                        \n/config
                        \n       L color [w/y/r/g/b]  -  Change main color.
                        \n       L theme [dark/light]  -  Change theme color.
                        \n       L bg [dark/light]  -  Change background color.
                        \n/clear  -  Clear the console.
                        \n/calculate  -  Calculate an expression.
                        \n/countdown  -  Start a countdown.
                        \n/rps
                        \n       L [rock/paper/scissors]  -  Play against the computer.
                        \n       L score  -  See your RPS score.`);
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
                                dark: '#050505'
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
                            display(`> Result : ${result}`)
                        } catch (error) {
                            display('Error : invalid expression provided.')
                        }
                    }
                    break;
                case 'countdown':
                    let count = parseInt(parts[1]);
                    if (!isNaN(count) && count > 0 && count <= 60) {
                        let countdownInterval = setInterval(() => {
                            display(`> ${count}`);
                            count--;
                            if (count < 0) {
                                clearInterval(countdownInterval);
                                display('> Countdown finished !');
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
                default:
                    display(`> No "/>${cmd}" command found.`);
            }
        }
    }

    output.addEventListener('scroll', () => {
        const atBottom = output.scrollHeight - output.clientHeight <= output.scrollTop + 1;
        isAtBottom = atBottom;
    });


    window.addEventListener('resize', () => {
        maxLines = calculateMaxLines();
    });
});
