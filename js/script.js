const expencesTab = document.getElementById('expences');
const incomeTab = document.getElementById('income');
const allTab = document.getElementById('all');
const expencesList = document.getElementById('list__expences');
const incomeList = document.getElementById('list__income');
const allList = document.getElementById('list__all');
const addBtn = document.getElementById('add__btn');
const inputTitle = document.getElementById('input__title');
const inputMoney = document.getElementById('input__money');
const dashEnd = document.getElementById('dashboard__end');
const income = document.getElementById('income__money');
const outcome = document.getElementById('outcome__money');
const total = document.getElementById('total');
const canvas = document.getElementById('circle');
canvas.height = 50;
canvas.width = 50;
const ctx = canvas.getContext('2d');

//список со вкладками. Так удобнее добираться до листов, т.к. лист и вкладка имеют одинаковые позиции в листах
let Tabs = [expencesTab, incomeTab, allTab];
let Lists = [expencesList, incomeList, allList];//список с содержимым вкладок
let id = 0;
let addedList = []; //хранилище записей расходов
drawList();

//добавление листенеров к вкладкам. Добавление класса активной вкладке, удаление у неактивных
expencesTab.addEventListener('click', () => {
  expencesTab.classList.add('active');
  incomeTab.classList.remove('active');
  allTab.classList.remove('active');
  expencesList.classList.add('active');
  incomeList.classList.remove('active');
  allList.classList.remove('active');
  dashEnd.classList.remove('hide')
});

incomeTab.addEventListener('click', () => {
  expencesTab.classList.remove('active');
  incomeTab.classList.add('active');
  allTab.classList.remove('active');
  expencesList.classList.remove('active');
  incomeList.classList.add('active');
  allList.classList.remove('active');
  dashEnd.classList.remove('hide')
});

allTab.addEventListener('click', () => {
  expencesTab.classList.remove('active');
  incomeTab.classList.remove('active');
  allTab.classList.add('active');
  expencesList.classList.remove('active');
  incomeList.classList.remove('active');
  allList.classList.add('active');
  dashEnd.classList.add('hide')
});

//листенер на кнопку добавления
addBtn.addEventListener('click', () => {
  if (inputTitle.value == '' || inputMoney.value == '' || isNaN(parseInt(inputMoney.value))) {
    alert('Введите название и сумму!');
  }
  else {
    //проверяет каждую вкладку
    for (let t = 0; t < Tabs.length; t++) {
      //проверяет какая вкладка активна
      if (Tabs[t].classList.contains('active')) {
        //создает объект. Объекту присваивается тип активной вкладки
        let obj = {
          type: t,
          title: inputTitle.value,
          money: t == 0 ? -parseInt(inputMoney.value) : parseInt(inputMoney.value),
          id: id
        }
        //опустошение вводов
        inputTitle.value = '';
        inputMoney.value = '';
        //добавление объекта записи расхода в хранилище
        addedList.push(obj);
        //отрисовка в html
        drawList();
        //createDelBtn();
        id++; //счетчик для присваивания уникального id
      }
    }
  }
});

function clearList() {
  let listBlocks = Array.from(document.querySelectorAll('.dashboard__list__item'));
  listBlocks.forEach(block => {
    block.remove();
  })
}

function drawList() {
  clearList();
  count();
  addedList.forEach(obj => {
    const element = `<li id='${obj.id}' class='dashboard__list__item'>
                      <div class='list_${obj.type}'>${obj.title}             ${obj.money}руб.</div>
				              <div id='edit${obj.id}'class='edit'><img src='img/1.png'/></div>
                      <div id='del${obj.id}' class='delete'><div></div><div></div></div>
                    </li>`
    const allElement = `<li id='${obj.id}' class='dashboard__list__item'>
                      <div class='list_${obj.type}'>${obj.title}             ${obj.money}руб.</div>
                      <div id='del${obj.id}' class='delete'><div></div><div></div></div>
                    </li>`
    Lists[obj.type].insertAdjacentHTML('afterbegin', element);
    Lists[2].insertAdjacentHTML('afterbegin', allElement);
  })
  createDelBtn(); //назначает листенеры на кнопки delete
}

function createDelBtn() {
  let delBtns = Array.from(document.querySelectorAll('.delete'));
  let editBtns = Array.from(document.querySelectorAll('.edit'));
  delBtns.forEach(btn => {
    let id = parseInt(btn.id.match(/\d+/));//вытаскивает число из id
    btn.addEventListener('click', () => {
      deleteItem(id);//удаляет объект
      drawList(); //отрисовывает после удаления объекта
    });
    editBtns.forEach(btn => {
      let id = parseInt(btn.id.match(/\d+/));
      btn.addEventListener('click', () => {
        editItem(id);
        drawList();
      });
    })
  })
}

//удаляет объект, у которого одинаковый с нажатой кнопкой id
function deleteItem(id) {
  for (let i = 0; i < addedList.length; i++) {
    if (addedList[i].id == id) {
      addedList.splice(i, 1);
    }
  }
}

function editItem(id) {
  for (let i = 0; i < addedList.length; i++) {
    if (addedList[i].id == id) {
      inputTitle.value = addedList[i].title;
      inputMoney.value = Math.abs(addedList[i].money);
      addedList.splice(i, 1);

    }
  }
}

function count() {
  drawCircle('white', 1);
  let incomeTotal = 0;
  let outcomeTotal = 0;
  addedList.forEach(obj => {
    if (obj.money > 0) {
      incomeTotal += parseInt(obj.money)
    }
    else {
      outcomeTotal += parseInt(obj.money)
    }

    let ratio = outcomeTotal / (incomeTotal - outcomeTotal);

    drawCircle('white', 1); // рисует дугу доходов
    drawCircle('red', ratio); //рисует дугу расходов. Эта дуга перекрывает собой дугу доходов

  })

  income.innerHTML = incomeTotal;
  outcome.innerHTML = outcomeTotal;
  total.innerHTML = incomeTotal + outcomeTotal;
  total.innerHTML += ' руб.';
  income.innerHTML += ' руб.';
  outcome.innerHTML += ' руб.';
}

function drawCircle(color, ratio) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.arc(canvas.width / 2, canvas.height / 2, 20, 0, Math.PI * 2 * ratio, true);
  ctx.lineWidth = 8;
  ctx.stroke();
}
