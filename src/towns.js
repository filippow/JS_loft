var obj = require('./index.js');
var compareFunc = obj.compareFunc;
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

        xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json', true);
        xhr.send();
       
        xhr.onreadystatechange = function() {
            if (this.readyState != 4) {
                return
            }

            if (xhr.status != 200) {
                reject(xhr.status);
            } else {
                towns = JSON.parse(xhr.responseText).sort(compareFunc);
                resolve(towns); 
            }
        }
    })
}

function isMatching(full, chunk) {
    return full.toLowerCase().indexOf(chunk.toLowerCase()) > -1
}

const loadingBlock = homeworkContainer.querySelector('#loading-block');
const filterBlock = homeworkContainer.querySelector('#filter-block');
const filterInput = homeworkContainer.querySelector('#filter-input');
const filterResult = homeworkContainer.querySelector('#filter-result');

let Towns = function() {
    let towns = [];

    return {
        setAll: function(arr) {
            towns = arr;
        },

        getAll: function() {
            return towns
        }
    }
}();

function start() {
    filterInput.addEventListener('keyup', onKeyup);
    setLoadingBlock('loading');
    loadTowns().then(towns => {
        setLoadingBlock('init');
        Towns.setAll(towns);
        showInput();
    }).catch( err => {
        setLoadingBlock('error');
    })
}

start();

function onKeyup() {
    let towns = Towns.getAll(),
        fragment = document.createDocumentFragment(),
        value = filterInput.value,
        div;

    clearResultBlock();
    if (value && towns.length != 0) {
        towns.forEach(town => {
            if (isMatching(town.name, value)) {
                div = createElement('div', town.name);
                fragment.appendChild(div);
            }
        })

        setLoadingBlock(fragment.children.length === 0 ? 'nothing' : 'init');
        filterResult.appendChild(fragment);
    } 
}

function onError() {
    setLoadingBlock('loading');
    loadTowns().then((towns)=> {
        Towns.setAll(towns);
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
    filterBlock.style.display = 'block';
    filterInput.style.display = 'block';
}

export {
    loadTowns,
    isMatching
};
