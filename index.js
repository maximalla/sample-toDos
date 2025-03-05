const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const todoForm = document.getElementById('todoForm');
const todoError = document.getElementById('error');
const todosZero = document.getElementById('zeroTasks');
const todosSelected = document.getElementById('taskSelect');
const sortCheck = document.getElementById('sort');

const storageKey = 'todos';
let todos = [];
let tempTodos = [];
let fail = false;
const errorMessage = 'Fill in the text field!';
init();


sortCheck.addEventListener('click',renderData);
todosSelected.addEventListener('change', renderData);
todoInput.addEventListener('input', inputHandler);
todoForm.addEventListener('submit', createTodo);
todoList.addEventListener('click', e => {
  if (e.target.classList.contains('delete')) toggleDeleteTodo(e.target);
  if (e.target.classList.contains('complete')) toggleCompleteTodo(e.target);
	if (e.target.classList.contains('edit')) editTodo(e.target);
});


function sort(){
	/*let sortTodos = [];
	for (const todo of todos) {
		sortTodos.push(todo);
	}
 	sortTodos.sort((a,b) => a.completed - b.completed);
 
	for (const todo of todos) {
		if(todo.completed === false && todo.deleted === false)
					sortTodos.push(todo);
	}
	for (const todo of todos) {
		if(todo.completed === true)
					sortTodos.push(todo);
	}
	for (const todo of todos) {
		if(todo.deleted === true)
					sortTodos.push(todo);
	}
	console.log(sortTodos);  */

	tempTodos.splice(0,tempTodos.length);
	for (const todo of todos) {
		tempTodos.push(todo);
	}
	return ;
}

function editTodo(target){
	const id = target.parentNode.id;
	const targetTodo = todos.find(todo => todo.id === Number(id));

	targetTodo.edited = true;
	renderData();
	const inputElement =  document.getElementById('editInput');
	inputElement.select();

	inputElement.addEventListener('blur', () => {
		const newText = inputElement.value.trim();
		targetTodo.edited = false;
		if (newText) {
			targetTodo.text = newText;
			storeData();
		}
		renderData();
	});
}

function emptyTodos()
{
	if(todos.length) todosZero.innerHTML = null;
	else todosZero.innerHTML = "Add your first task";
}

function inputHandler(){
	if(fail) { fail = false; error.innerHTML = null;}
}

function toggleDeleteTodo(target) {
  const id = target.parentNode.id;
	const targetTodo = todos.find(todo => todo.id === Number(id)); 
	
	if(targetTodo.status === 'deleted') targetTodo.status = 'active'
	else targetTodo.status = 'deleted'

	storeData();
  renderData();
}

function toggleCompleteTodo(target) {
  const id = target.parentNode.id;
  const targetTodo = todos.find(todo => todo.id === Number(id));

	if(targetTodo.status === 'active') targetTodo.status = 'completed'
	else targetTodo.status = 'active'

	storeData();
  renderData();
}

function filter(){
	/*tempTodos.splice(0,tempTodos.length);
	 if(todosSelected.value === 'active')
		for (const todo of todos) {
			if(todo.completed === false && todo.deleted === false)
				tempTodos.push(todo);
		}
	else
		for (const todo of todos) {
			if(todo[todosSelected.value] === true)
				tempTodos.push(todo);
		} */
	return	todos.filter(todo => todo.status === todosSelected.value);
}

function createTodo(e) {
  e.preventDefault();
	if(todoInput.value.trim()) {
		todos = [new Todo({ text: todoInput.value }), ...todos];
		storeData();
		renderData();
		todoInput.value = '';
		todoInput.focus(); 
	}
	else {fail = true; error.innerHTML = errorMessage;}
	
}

function storeData() {
  localStorage.setItem(storageKey, JSON.stringify(todos));
}

function renderData() {
	if(todosSelected.value === 'all')
		 if(!sortCheck.checked) todoList.innerHTML = todos.map(todo => todo.toHtml()).join('');
		 else todoList.innerHTML = sort().map(todo => todo.toHtml()).join('');
	else todoList.innerHTML = filter().map(todo => todo.toHtml()).join('');
	emptyTodos();
}

function init() {
  const storedData = JSON.parse(localStorage.getItem(storageKey));
  todos = storedData ? storedData.map(item => new Todo(item)) : [];
  renderData();
}

function Todo({text, id, status}) {
  this.id = id || Date.now();
  this.text = text;
  this.status = status || 'active';
  this.toHtml = () => {
		if(this.status !== 'deleted')
    return `
      <div class="todo${this.status === 'completed' ? ' completed' : ''}" id="${this.id}">
			${this.edited ? `<input type="text" class="editInput" id="editInput" value="${this.text}">` 
			: `<span class="text">${this.text}</span>`}
        <input type="checkbox" ${this.status === 'completed' ? 'checked' : ''} class="complete">
        <button class="edit"></button>
				<button class="delete">delete</button>
      </div>
    `;
		else
		return `
      <div class="todo deletedTask" id="${this.id}">
        <span class="text">${this.text}</span>
        <button class="delete restore">restore</button>
      </div>
    `;
  }
  return this;
}