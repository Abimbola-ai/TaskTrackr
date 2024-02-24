// Todo: create a function to generate a unique task id
function generateTaskId() {
  var taskIdCounter = parseInt(localStorage.getItem('taskIdCounter')) || 0
  //   console.log('Current taskIdCounter:', taskIdCounter)
  taskIdCounter++
  localStorage.setItem('taskIdCounter', taskIdCounter)
  //   console.log('New taskIdCounter:', taskIdCounter)
  return taskIdCounter
}

// Todo: create a function to create a task card
function createTaskCard(title, dueDate, description) {
  //Create a unique id for each task card
  let taskId = generateTaskId()

  // Create card container
  let card = document.createElement('div')
  card.classList.add('card', 'border', 'mb-3')
  //Create the Individual task body
  let cardBody = document.createElement('div')
  cardBody.classList.add('card-body')
  //Create Task title
  let cardTitle = document.createElement('h5')
  cardTitle.classList.add('card-title')
  cardTitle.textContent = title
  //Task Due date
  let cardDate = document.createElement('p')
  cardDate.classList.add('card-date')
  cardDate.textContent = dueDate

  //Task Description
  let cardDescription = document.createElement('p')
  cardDescription.classList.add('card-description', 'card-text')
  cardDescription.textContent = description

  //Delete button
  let cardButton = document.createElement('button')
  cardButton.classList.add('btn', 'btn-primary')
  cardButton.innerHTML = 'Delete'
  //   cardButton.textContent = Delete

  //Append elements
  cardBody.appendChild(cardTitle)
  cardBody.appendChild(cardDate)
  cardBody.appendChild(cardDescription)
  cardBody.appendChild(cardButton)
  card.appendChild(cardBody)

  return card
}

//Function to render tasks for a specific category from local storage
function renderTaskList(category) {
  let tasks = JSON.parse(localStorage.getItem(category)) || []
  let containerId = '#' + category.toLowerCase().replace(' ', '-') + '-cards' // Adjusted to append '-cards' to the ID
  let container = $(containerId)

  container.empty()

  //Render tasks in the container
  //   tasks.forEach((task) => {
  //     let taskCard = $('<div>').addClass('task-card card border mb-3')
  //     taskCard.append(
  //       $('<div>')
  //         .addClass('card-body')
  //         .append(
  //           $('<h5>').addClass('card-title').text(task.title),
  //           $('<p>').addClass('card-date').text(task.dueDate),
  //           $('<p>')
  //             .addClass('card-description card-text')
  //             .text(task.description),
  //           $('<button>').addClass('btn btn-primary').text('Delete')
  //         )
  //     )

  //     taskCard.data('task-id', task.id)
  //     taskCard.data('task-category', category)
  //     taskCard.data('task-title', task.title)
  //     taskCard.data('task-due-date', task.dueDate)
  //     taskCard.data('task-description', task.description)

  //     container.append(taskCard)
  //   })
  //Render tasks in the container
  tasks.forEach((task) => {
    container.append(createTaskCard(task.title, task.dueDate, task.description))
  })

  // Make task cards draggable
  makeTaskCardDraggable()
}

//Function to make a container draggable into different categories
function makeTaskCardDraggable() {
  $('.task-card').draggable({
    revert: 'invalid',
    containment: '.container',
    zIndex: 100,
    start: function (event, ui) {
      $(this).css('z-index', 101)
    },
    stop: function (event, ui) {
      $(this).css('z-index', '')
    },
  })
}

//Function to make a container droppable into different categories
function makeContainersDroppable() {
  $('.lane').droppable({
    accept: '.task-card',
    drop: function (event, ui) {
      let taskId = ui.draggable.data('task-id')
      let taskCategory = ui.draggable.data('task-category')
      let newCategory = $(this).attr('id') // Get the ID of the new category container

      // Move task to new category
      moveTask(taskId, taskCategory, newCategory)

      // Re-render task lists for both categories
      renderTaskList(taskCategory)
      renderTaskList(newCategory)
    },
  })
}

function addTask(category, task) {
  var tasks = JSON.parse(localStorage.getItem(category)) || []
  tasks.push(task)
  localStorage.setItem(category, JSON.stringify(tasks))
}

//Function to add a new task to the To Do category and generate corresponding card
function addTaskToTodoList(title, dueDate, description) {
  // Create task object
  var task = {
    id: generateTaskId(),
    title: title,
    dueDate: dueDate,
    description: description,
  }

  // Add task to the To Do category in local storage
  addTask('To Do', task)

  // Generate task card
  var taskCard = createTaskCard(task.title, task.dueDate, task.description)

  // Append task card to the #todo-cards div
  $('#todo-cards').append(taskCard)
}

//Function to move tasks form one category to another
function moveTask(taskId, fromCategory, toCategory) {
  var tasksFrom = JSON.parse(localStorage.getItem(fromCategory)) || []
  var tasksTo = JSON.parse(localStorage.getItem(toCategory)) || []
  var taskToMove = tasksFrom.find((task) => task.id === taskId)
  if (taskToMove) {
    tasksFrom = tasksFrom.filter((task) => task.id !== taskId)
    taskToMove.category = toCategory
    tasksTo.push(taskToMove)
    localStorage.setItem(fromCategory, JSON.stringify(tasksFrom))
    localStorage.setItem(toCategory, JSON.stringify(tasksTo))
  }
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
// console.log(JSON.parse(localStorage.getItem('To Do')))

// $(document).ready(function () {
//   //   console.log(JSON.parse(localStorage.getItem('To Do')))

//   // Logic to pop up form modal
//   let modal = $('#add-task')
//   let btnOpen = $('#create-task')
//   let btnClose = $('.close')

//   btnOpen.on('click', function () {
//     modal.show()
//   })

//   btnClose.on('click', function () {
//     modal.fadeOut()
//   })
//   renderTaskList('To Do')
//   renderTaskList('In Progress')
//   renderTaskList('Done')

//   // Make containers droppable
//   makeContainersDroppable()

//   //Create an event listener to the form submission process
//   $('form').on('submit', function (event) {
//     event.preventDefault() //Prevents form submission default behaviour
//     //Get user input values
//     let title = $('#task-title').val()
//     let dueDate = $('#task-due-date').val()
//     let description = $('#task-description').val()

//     //Generate task card by caling the create task function
//     addTaskToTodoList(title, dueDate, description)

//     //Clear user input values
//     $('#task-title').val('')
//     $('#task-due-date').val('')
//     $('#task-description').val('')

//     modal.fadeOut()
//   })
// })
$(document).ready(function () {
  // Logic to pop up form modal
  let modal = $('#add-task')
  let btnOpen = $('#create-task')
  let btnClose = $('.close')

  btnOpen.on('click', function () {
    modal.show()
  })

  btnClose.on('click', function () {
    modal.fadeOut()
  })

  // Make containers droppable
  makeContainersDroppable()

  // Render task lists after the DOM is fully loaded
  renderTaskList('To Do')
  renderTaskList('In Progress')
  renderTaskList('Done')

  // Create an event listener for the form submission process
  $('form').on('submit', function (event) {
    event.preventDefault() //Prevents form submission default behavior
    //Get user input values
    let title = $('#task-title').val()
    let dueDate = $('#task-due-date').val()
    let description = $('#task-description').val()

    //Generate task card by calling the create task function
    addTaskToTodoList(title, dueDate, description)

    //Clear user input values
    $('#task-title').val('')
    $('#task-due-date').val('')
    $('#task-description').val('')

    modal.fadeOut()
  })
})