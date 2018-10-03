 var app = new Vue({
      el: '#app',
      data: {
        message: 'Hello Vue!'
      }
    })
var app3 = new Vue({
  el: '#app-3',
  data: {
    seen: true
  }
})
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: 'Изучить JavaScript' },
      { text: 'Изучить Vue' },
      { text: 'Создать что-нибудь классное' }
    ]
  }
})
app4.todos.push({ text: 'Profit' })

