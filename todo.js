// Tüm Elementlerin Seçimi
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");


eventListeners();

function eventListeners(){ // Tüm Event Listenerlar
    form.addEventListener("submit",addTodo); // form submit edildiğinde
    document.addEventListener("DOMContentLoaded",loadAllTodosToUl); // localstorage kaydedilen verileri sayfada gösterme
    secondCardBody.addEventListener("click",deleteTodo); // silme işlemi için event
    filter.addEventListener("keyup",filterTodos); // filtreleme işlemi için event
    clearButton.addEventListener("click",clearAllTodos); // tümünü sil işlemi için evet
}

// Tümünü sil fonksiyonu
function clearAllTodos(e){
    if(confirm("Tümünü silmek istediğinize emin misiniz?")){
        // Arayüzden temizleme
        // todoList.innerHTML = ""; // Yavaş olduğu söyleniyor
        while(todoList.firstElementChild != null){
            todoList.removeChild(todoList.firstElementChild); // Hiçbir eleman kalmayana kadar döngü devam edip siliyor
        }

        // Local Storage'ten silme
        localStorage.removeItem("todos");
    }
}


// Filter fonksiyonu
function filterTodos(e){
    const filterValue = e.target.value.toLowerCase(); // değerleri küçük harfe çevirme
    const listItems = document.querySelectorAll(".list-group-item"); // tüm li'ler seçiliyor

    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLocaleLowerCase(); // li değerini alıp küçük harfe çevirme
        if(text.indexOf(filterValue) === -1){ // bulunamadı ise
            listItem.setAttribute("style","display:none !important"); // css ile gizleme
        } else { // bulundu ise
            listItem.setAttribute("style","display:block"); // css ile gösterme
        }

    });

}



// Arayüzden Silme fonksiyonu
function deleteTodo(e){
    if(e.target.className === "fa fa-remove"){
        e.target.parentElement.parentElement.remove(); // i iconuna tıklanınca bir üstü a ve onun üstü li gidip siliyor
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent); // silnen elementin text'i local storage fonsiyonuna yollanıyor ki isimden yakalanın oradan da silinsin diye
        showAlert("warning","Todo başarıyla silindi...");
    }
}
// Local Storage'ten Silme fonksiyonu
function deleteTodoFromStorage(deletetodo){
    let todos = getTodosFromStorage(); // Local storage fonksiyonu çağırma
    todos.forEach(function(todo,index){
        if(todo === deletetodo){
           todos.splice(index,1); // Arrayden bir eleman silme
        }
    });

    localStorage.setItem("todos",JSON.stringify(todos)); // Silme sonrası listenin güncellenmesi
}


// Local Storage'deki verileri listeleme
function loadAllTodosToUl(){
    let todos = getTodosFromStorage(); // Local storage fonksiyonu çağırma
    todos.forEach(function(todo){
        addTodoToUl(todo); // ekleme fonksinonu foreach içinde kullandık
    });
}



function addTodo(e){
    let todos = getTodosFromStorage();
    const newTodo = todoInput.value.trim(); // inputtaki değeri alma
    let isThere = false;
    todos.forEach(function(item){
        if(item.indexOf(newTodo) != -1){isThere = true}
    });

    if(newTodo === ""){
        showAlert("danger","Lütfen bir todo giriniz..."); // Uyarı mesajı type/message
    } else if(isThere){
        showAlert("warning","Aynısını daha önce eklediniz!"); // Uyarı mesajı type/message
    } else {
        addTodoToUl(newTodo); // Fonksiyon atama
        addTodoToStorage(newTodo); // Local storage ekleme fonksiyonu
        showAlert("success","Todo başarıyla eklendi..."); // Uyarı mesajı 
    }

    e.preventDefault();
    todoInput.value = ""; // Ekleme sonrası text'in boşaltılması
}


// Genel kullanım için local storage fonksiyonu
function getTodosFromStorage(){
    let todos;
    if(localStorage.getItem("todos") === null){
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}


// Local Storage ekleme
function addTodoToStorage(newTodo){
   let todos = getTodosFromStorage(); // Local storage fonksiyonu çağırma
   todos.push(newTodo); // todo ekleme
   localStorage.setItem("todos", JSON.stringify(todos)); // todoları güncelleme
}


// Uyarı Fonksiyonu
function showAlert(type,message){
   const alert = document.createElement("div");
   alert.className = `alert alert-${type}`; // class bilgisi ve classa ek gelen type classı
   alert.textContent = message; // Mesaj içeriği

   firstCardBody.appendChild(alert); // Uyarı cardbody div'ine eklendi

   // setTimeout
   setTimeout(function(){ // Belli bir süre sonra işlem yapmaya yarıyor 1000/1 saniye
       alert.remove(); // Uyarıyı kaldırma
   },1000);
}


function addTodoToUl(newTodo){ // String değerini list item olarak Ul'ye ekleme
    // List Item oluşturma
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between";
    
    // Link oluşturma
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class='fa fa-remove'></i>";

    // İçerikleri ekleme
    listItem.appendChild(document.createTextNode(newTodo)); // Inputtan gelen değeri li'nin içine ekleme
    listItem.appendChild(link); // linki ekleme

    // Todo List'e Item'ı ekleme
    todoList.appendChild(listItem);


 }



//-----------------------------------------------------------------------------------

