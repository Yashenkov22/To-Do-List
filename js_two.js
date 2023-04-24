(function(){

    let storage = [];
//------------------------------------------------------
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }
//------------------------------------------------------

    function inputDisabled(input, btn) {
        input.addEventListener('input', function() {
            btn.disabled = !input.value.length;
        })
    }

//------------------------------------------------------

    function SaveJSON(key) {
        localStorage.setItem(key, JSON.stringify(storage));
    }

//------------------------------------------------------

    function getId() {
        if (storage.length == 0) {
            return 1;
        }
        let counter = [];
        for (let i of storage) {
            counter.push(i.id);
        }
        return Math.max.apply(null,counter) + 1;
    }
//------------------------------------------------------

    function deleteBtnAction(btn, item, key) {
        btn.addEventListener('click', function() {
            if (confirm('Вы уверены?')) {
                storage = storage.filter(el => el.id !== item.id);
                item.remove();
                SaveJSON(key);
                }
            })
    }

//------------------------------------------------------

    function doneBtnAction(btn, item, key) {
        btn.addEventListener('click', function() {
            item.classList.toggle('list-group-item-success');
            let date = storage.find(el => el.id === item.id)
            date.done = !date.done;
            SaveJSON(key);
        })
    }

//------------------------------------------------------

    function createToDoItemFormAction(form, input, todoList, key) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            if (!input.value.length) {
                return;
            }
            
            let { item, doneBtn, deleteBtn } = createTodoItem(input.value, '', false);

            let date = {
                name : input.value,
                id : item.id,
                done : false,
            }

            storage.push(date);
            SaveJSON(key);

            doneBtnAction(doneBtn, item, key);
            deleteBtnAction(deleteBtn, item, key);

            input.value = '';
            todoList.append(item);

        })
    }

//------------------------------------------------------

    function createToDoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let btnWrapper = document.createElement('div');
        let btn = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';        
        btnWrapper.classList.add('input-group-append');
        btn.classList.add('btn', 'btn-primary');
        btn.textContent = 'Добавить дело';
        btn.disabled = true;

        btnWrapper.append(btn);
        form.append(input);
        form.append(btnWrapper);
        
        return {
            form,
            input,
            btn,
        }
    }
// ------------------------------------------------------

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

// ------------------------------------------------------    

    function createTodoItem(name, id, done) {
        let item = document.createElement('li');
        let BtnGroup = document.createElement('div');
        let doneBtn = document.createElement('button');
        let deleteBtn = document.createElement('button');
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;
        item.id = id || getId();

        BtnGroup.classList.add('btn-group', 'btn-group-sm');
        doneBtn.classList.add('btn', 'btn-success');
        doneBtn.textContent = 'Готово';
        deleteBtn.classList.add('btn', 'btn-danger');
        deleteBtn.textContent = 'Удалить';

        if (done) {
            item.classList.toggle('list-group-item-success');
        }
        
        BtnGroup.append(doneBtn);
        BtnGroup.append(deleteBtn);
        item.append(BtnGroup);
     
        return {
            item,
            doneBtn,
            deleteBtn,
        }
    }

//------------------------------------------------------

    function createTodoApp(container, title = 'Список дел', key) {
                
        let todoAppTitle = createAppTitle(title);
        let { form, input, btn } = createToDoItemForm();
        let todoList = createTodoList();

        let serverStorage = JSON.parse(localStorage.getItem(key));

        storage = serverStorage || [];

        for (let el of storage) {
            let { name, id, done } = el;
            let { item, doneBtn, deleteBtn } = createTodoItem(name, id, done);
            todoList.append(item);

            doneBtnAction(doneBtn, item, key);
            deleteBtnAction(deleteBtn, item, key)
        }

        inputDisabled(input, btn);
        createToDoItemFormAction(form, input, todoList, key);

        container.append(todoAppTitle);
        container.append(form);
        container.append(todoList);
    }

    window.createTodoApp = createTodoApp;  
})();

