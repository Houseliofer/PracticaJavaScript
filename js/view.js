import AddTodo from './components/add-todo.js';
import Modal from './components/modal.js';
import Filters from './components/filters.js';

export default class View {
  constructor() {
    this.model = null;
    this.table = document.getElementById('table');
    this.addTodoForm = new AddTodo();
    this.modal = new Modal();
    this.filters = new Filters();


    this.addTodoForm.onClick((title, description) => this.addTodo(title, description));
    this.modal.onClick((id, values) => this.editTodo(id, values));
    this.filters.onClick((filters) => this.filter(filters));
  }

  setModel(model) {
    this.model = model;
  }

  render() {
    const todos = this.model.getTodos();
    todos.forEach((todo) => this.createRow(todo));

    // Obtener la fecha actual
    const currentDate = new Date().toLocaleDateString();

    // Actualizar el contenido del elemento HTML con la fecha actual
    //const currentDateElement = document.getElementById('current-date');
    //currentDateElement.textContent = currentDate;
  }

  filter(filters) {
    const { type, words } = filters;
    const [, ...rows] = this.table.getElementsByTagName('tr');
    for (const row of rows) {
      const [title, description, completed] = row.children;
      let shouldHide = false;

      if (words) {
        shouldHide = !title.innerText.includes(words) && !description.innerText.includes(words);
      }

      const shouldBeCompleted = type === 'completed';
      const isCompleted = completed.children[0].checked;

      if (type !== 'all' && shouldBeCompleted !== isCompleted) {
        shouldHide = true;
      }

      if (shouldHide) {
        row.classList.add('d-none');
      } else {
        row.classList.remove('d-none');
      }
    }
  }

  // Dentro de la clase View...
  addTodo(title, description) {
    const deadlineInput = document.getElementById('deadline');
    const deadline = deadlineInput.value;
    const todo = this.model.addTodo(title, description, deadline);
    this.createRow(todo);
    deadlineInput.value = ''; // Limpiar el campo después de agregar la tarea
  }


  toggleCompleted(id) {
    this.model.toggleCompleted(id);
  }

  editTodo(id, values, newDeadline) {
    this.model.editTodo(id, values);
    const row = document.getElementById(id);
    row.children[0].innerText = values.title;
    row.children[1].innerText = values.description;
    const deadlineInput = row.querySelector('input[type="date"]');
    deadlineInput.value = newDeadline;
    row.children[3].children[0].checked = values.completed;
  }
  
  

  removeTodo(id) {
    this.model.removeTodo(id);
    document.getElementById(id).remove();
  }

  createRow(todo) {
    const row = table.insertRow();
    row.setAttribute('id', todo.id);
    row.innerHTML = `
      <td>${todo.title}</td>
      <td>${todo.description}</td>
      <td>${todo.deadline}</td>
      <td class="text-center">

      </td>
      <td class="text-right">

      </td>`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.onclick = () => this.toggleCompleted(todo.id);
    row.children[2].appendChild(checkbox);

    const editBtn = document.createElement('button');
    editBtn.classList.add('btn', 'btn-primary', 'mb-1');
    editBtn.innerHTML = '<i class="fa fa-pencil"></i>';
    editBtn.setAttribute('data-toggle', 'modal');
    editBtn.setAttribute('data-target', '#modal');
    editBtn.onclick = () => this.modal.setValues({
      id: todo.id,
      title: row.children[0].innerText,
      description: row.children[1].innerText,
      completed: row.children[2].children[0].checked,
    });
    row.children[3].appendChild(editBtn);

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('btn', 'btn-danger', 'mb-1', 'ml-1');
    removeBtn.innerHTML = '<i class="fa fa-trash"></i>';
    removeBtn.onclick = () => this.removeTodo(todo.id);
    row.children[3].appendChild(removeBtn);

    const deadlineInput = document.createElement('input');
    deadlineInput.type = 'date';
    deadlineInput.value = todo.deadline; // Establecer el valor inicial de la fecha de vencimiento
    deadlineInput.onchange = (event) => {
      const newDeadline = event.target.value;
      this.updateDeadline(todo.id, newDeadline);
    };
    row.children[2].appendChild(deadlineInput);
  }
}
