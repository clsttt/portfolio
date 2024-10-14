document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('form')
    const input = document.getElementById('console-input')
    const output = document.getElementById('console-area')

    const lineHeight = 35;
    let maxLines = calculateMaxLines();

    let isAtBottom = true

    const aliases = {
        h: 'help',
        cfg: 'config',
        c: 'clear'
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const inputValue = input.value.trim().toLowerCase()

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
        if (!command.startsWith('/>')) {
            display(command)
        } else {
            const trimmedCommand = command.slice(2).trim()
            const parts = trimmedCommand.split(' ')
            const cmd = parts[0]

            const mainCommand = aliases[cmd] || cmd;

            switch (mainCommand) {
                case 'help':
                    display(`/>[help / h]  -  Display list of commands.\n/>[config / cfg]\n       L color [w / y / r / g / b]  -  Change main color.\n       L theme [dark / light]  -  Change theme color.\n/>[clear / c]  -  Clear the console.`);
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
                                b: '#0000ff'
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
                    } else {
                        display('Error : unknown configuration.');
                    }
                break;
                case 'clear':
                    output.innerHTML = '';
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