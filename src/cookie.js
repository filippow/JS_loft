/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

let Cookies = function() {
    let cookies = [];
    let id = 1;

    return {
        addCookie: function(cookie) {
            cookies.push(cookie);
            document.cookie = `${cookie.name}=${cookie.value}`;
        },

        deleteCookie: function(id) {
            let name = this.getCookieById(id).name;
            let index = this.getCookieIndex(name);

            if (index >= 0) {
                document.cookie = `${cookies[index].name}=${cookies[index].value}; expires=${new Date(0).toUTCString()};`;
                cookies.splice(index, 1);
            }
        },

        updateCookie: function(cookie) {
            let name = cookie.name,
                index = this.getCookieIndex(name);

            if (index >=0) {
                cookies[index].value = cookie.value;
                document.cookie = `${cookie.name}=${cookie.value};`;
            }
        },

        hasName: function(name) {
            return cookies.some((el) => {
                return el.name === name;
            })
        },

        getAllCookies: function() {
            return cookies;
        },

        getCookieIndex: function(name) {
            for (let i=0; i < cookies.length; i++) {
                if (cookies[i].name === name) {
                    return i;
                }
            }

            return null
        },

        getCookieById: function(id) {
            for (let i=0; i < cookies.length; i++) {
                if (cookies[i].id == id) {
                    return cookies[i];
                }
            }
        },

        getCookieByName: function(name) {
            return cookies[this.getCookieIndex(name)]
        },

        getId: function() {
            return ++id;
        },

        clearAllCookies: function() {
            cookies = [];
        }
    }
}()

addButton.addEventListener('click', onAddCookieClick);
filterNameInput.addEventListener('keyup', onFilterKeyup);

function onAddCookieClick() {
    let cookie = {
        name: addNameInput.value,
        value: addValueInput.value, 
    }

// При выполнении тестов каждый раз куки и таблица очищаются, а вот инкапсулированный масиив кук - нет, поэтому проверяем
    checkCookie();
    if (Cookies.hasName(cookie.name)) {
        update(cookie);
    } else {
        add(cookie);
    }
}

function checkCookie() {
    if (!document.cookie) {
        Cookies.clearAllCookies();
    }
}

function update(cookie) {
    let id = Cookies.getCookieByName(cookie.name).id;
    let tr = document.getElementById(id),
        filter = filterNameInput.value;

    if (tr) {
        tr.children[1].textContent = cookie.value;

        if (filter && (!cookie.name.indexOf(filter) > -1 && !cookie.value.indexOf(filter)) > -1) {
            listTable.removeChild(tr);
        } 

        Cookies.updateCookie(cookie);
    }
}

function add(cookie) {
    let id = Cookies.getId(),
        filter = filterNameInput.value,
        row;

    cookie.id = id;
    Cookies.addCookie(cookie);
    row = createRow(cookie);

    if (filter) {
        if (cookie.name.indexOf(filter) > -1 || cookie.value.indexOf(filter) >-1) {
            listTable.appendChild(row);
        } 
    } else {
        listTable.appendChild(row);
    }
}

function createRow(cookie) {
    let tr = createEl('tr'),
        tdName = createEl('td', cookie.name),
        tdValue = createEl('td', cookie.value),
        tdDelete = createEl('td'),
        tdButton = createEl('button', 'Delete', { name: 'click', func: onDeleteButtonClick });
    
    tdDelete.appendChild(tdButton);
    tr.id = cookie.id;
    tr.appendChild(tdName);
    tr.appendChild(tdValue);
    tr.appendChild(tdDelete);

    return tr
}

function createEl(tag, text, event) {
    let el = document.createElement(tag);

    if (text) {
        el.textContent = text;
    }

    if (event) {
        el.addEventListener(event.name, event.func);
    }

    return el
}

function onDeleteButtonClick() {
    let tr = event.target.parentNode.parentNode;

    Cookies.deleteCookie(tr.id);
    listTable.removeChild(tr); 
}

function onFilterKeyup(event) {
    let value = event.target.value,
        cookies = Cookies.getAllCookies();

    listTable.textContent = '';
    for (let i=0; i< cookies.length; i++) {
        if (cookies[i].name.indexOf(value) >-1 || cookies[i].value.indexOf(value) >-1) {
            listTable.appendChild(createRow(cookies[i]));
        }
    }
}