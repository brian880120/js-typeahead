(function() {
    'use strict';

    let input = document.querySelector('input');
    let container = document.getElementsByClassName('result')[0];
    let currentFocusIndex;
    let cachedResult = {};

    input.addEventListener('input', (e) => {
        const value = e.target.value;

        if (!value) {
            container.style.display = 'none';
        }

        if (cachedResult[value[0]] !== undefined) {
            const result = cachedResult[value[0]].filter(item => item.startsWith(value));
            if (result.length) {
                buildResult(result, value);
            } else {
                container.style.display = 'none';
            }
        }
    });

    input.addEventListener('input', debounce((e) => {
        const value = e.target.value;
        if (value) {
            currentFocusIndex = -1;

            if (cachedResult[value[0]] === undefined) {
                fetch(`http://localhost:8081/search?q=${value}`).then(res => res.json()).then(res => {
                    const result = res.result;
                    if (result.length) {
                        if (value.length === 1) {
                            if (cachedResult[value] === undefined) {
                                cachedResult[value] = result;
                            }
                        }
                        buildResult(result, value);
                    } else {
                        container.style.display = 'none';
                    }
                });
            }
        }
    }, 500));

    input.addEventListener('keydown', (e) => {
        if (container.style.display === 'none') {
            return;
        }
        switch(e.keyCode) {
            case 40:
                currentFocusIndex++;
                updateTargetNode();
                break;
            case 38:
                currentFocusIndex--;
                updateTargetNode();
                break;
            case 13:
                if (currentFocusIndex >= 0) {
                    input.value = container.childNodes[currentFocusIndex].innerText;
                    cleanResult();
                }
            default:
                break;
        }
    });

    function buildResult(result, value) {
        cleanResult();
    
        let content = document.createDocumentFragment();
        result.forEach(item => {
            let div = document.createElement('div');
            div.style.padding = '5px';
            div.innerHTML = `<strong>${value}</strong>${item.slice(value.length)}`;
            div.addEventListener('click', () => {
                input.value = item;
            });
            content.appendChild(div);
        });

        container.style.display = 'block';
        container.appendChild(content);
    }

    function updateTargetNode() {
        const children = container.childNodes;
        const childNodeCount = container.childElementCount;
        if (currentFocusIndex < 0) {
            currentFocusIndex = childNodeCount - 1;
        }
        if (currentFocusIndex >= childNodeCount) {
            currentFocusIndex = 0;
        }
        children.forEach((child, idx) => {
            child.style.backgroundColor = idx === currentFocusIndex ? 'lightblue' : 'white';
        });
    }

    function debounce(fn, delay) {
        let timer;

        return function() {
            let context = this;
            let args = arguments;

            clearTimeout(timer);

            timer = setTimeout(() => {
                fn.apply(context, args);
            }, delay);
        }
    }

    function cleanResult() {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }        
        container.style.display = 'none';
    }

    document.addEventListener('click', () => {
        cleanResult();
    });

    // function test1() {
    //     for (let i = 0; i < 1000; i++) {
    //         document.getElementById('container').innerHTML += '<span>this is a test</span>';
    //     }
    // }

    // function test2() {
    //     let container = document.getElementById('container');
    //     for (let i = 0; i < 1000; i++) {
    //         container.innerHTML += '<span>this is a test</span>';
    //     }
    // }

    // function test3() {
    //     let container = document.getElementById('container');
    //     let content = '';
    //     for (let i = 0; i < 10000; i++) {
    //         content += '<span>this is a test</span>';
    //     }

    //     container.innerHTML = content;
    // }

    // function test4() {
    //     let container = document.getElementById('container');
    //     let content = document.createDocumentFragment();
    //     for (let i = 0; i < 10000; i++) {
    //         let oSpan = document.createElement('span');
    //         oSpan.innerHTML = 'this is a test';
    //         content.appendChild(oSpan);
    //     }

    //     container.appendChild(content);
    // }

    // function requestAnimationFrame() {
    //     setTimeout(() => {
    //         const total = 100;
    //         const once = 20;
    //         const loopCount = total / once;
    //         let countOfRender = 0;
    //         let ul = document.querySelector('ul');

    //         function add() {
    //             const fragment = document.createDocumentFragment();
    //             for (let i = 0; i < once; i++) {
    //                 const li = document.createElement('li');
    //                 li.innerText = Math.floor(Math.random * total);
    //                 fragment.appendChild(li);
    //             }

    //             ul.appendChild(fragment);
    //             countOfRender += 1;

    //             loop();
    //         }

    //         function loop() {
    //             if (countOfRender < loopCount) {
    //                 window.requestAnimationFrame(add);
    //             }
    //         }

    //         loop();
    //     }, 0);
    // }
})();