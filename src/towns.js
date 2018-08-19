/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загруки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
function loadTowns() {
    return new Promise( function( resolve, reject) {
        var xhr = new XMLHttpRequest(),
            towns = [];

        function compareFunc(a, b) {
            a = a.name.toLowerCase();
            b = b.name.toLowerCase();

            return a > b ? 1 : (a < b ? -1 : 0)
        }
        // debugger;
        setLoadingBlock('loading');
        xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json', true);
        xhr.send();
       
        xhr.onreadystatechange = function() {
            if (this.readyState != 4) {
                return
            }

            if (xhr.status != 200) {
                reject();
            } else {
                towns = JSON.parse(xhr.responseText).sort(compareFunc);
                resolve(towns); 
            }
        }
    })
}

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
    return full.toLowerCase().indexOf(chunk.toLowerCase()) > -1
}

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
// /* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
// /* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
// /* Блок с результатами поиска */ 
const filterResult = homeworkContainer.querySelector('#filter-result');

function setLoadingBlock(loadingBlockState) {
    let obj = {
        init: clearLoadigBlock,
        loading: setLoadOnLoadingBlock,
        nothing: setNotFoundOnLoadingBlock,
        error: setErrorOnLoadingBlock
    };

    obj[loadingBlockState]();
}

function clearLoadigBlock() {
    loadingBlock.textContent = '';
}

function setLoadOnLoadingBlock() {
    loadingBlock.textContent = 'Загрузка...';
}

function setNotFoundOnLoadingBlock() {
    loadingBlock.textContent = 'Ничего не найдено';
}

function setErrorOnLoadingBlock() {
    loadingBlock.textContent = 'Произошла ошибка при загрузке...';
    loadingBlock.appendChild(getErrorButton());
    filterInput.style.display = 'none'
}

function getErrorButton() {
    return createElement('button', 'Повторить загрузку', { event: 'click', func: onError })
}

function clearResultBlock() {
    filterResult.textContent = '';
}

function showInput() {
    filterInput.style.display = 'block';
}

function onError() {
    setLoadingBlock('loading');
    loadTowns().then(()=> {
        setLoadingBlock('init');
        showInput();
        onKeyup();
    }).catch(()=> {
        setLoadingBlock('error');
    })
}

function createElement(type, text, listener) {
    let element = document.createElement(type);

    element.textContent = text;
    if (listener) {
        element.addEventListener(listener.event, listener.func);
    }
  
    return element;
}

function onKeyup() {
    let value = filterInput.value,
        fragment = document.createDocumentFragment(),
        div;

    clearResultBlock();
    setLoadingBlock(value ? 'loading' : 'init');
    if (value) {
        loadTowns().then(towns => {
            towns.forEach( town => {
                if (isMatching(town.name, value)) {
                    div = createElement('div', town.name);
                    fragment.appendChild(div);
                }
            });
            
            filterBlock.style.display = 'block';
            setLoadingBlock(fragment.children.length === 0 ? 'nothing' : 'init');
            filterResult.appendChild(fragment);
        })
            .catch(() => {
                setLoadingBlock('error')
            })     
    } 
}

filterInput.addEventListener('keyup', onKeyup);

export {
    loadTowns,
    isMatching
};
