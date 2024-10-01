import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import List from './List';

const Home = () => {  
    const [inputValue, setInputValue] = useState("");  
    const [todos, setTodos] = useState([]);  
    const [showAlert, setShowAlert] = useState(false); 
    const user = "bryon-dani"; 
    const todosUrl = "https://playground.4geeks.com/todo/todos/"; 
    
    

    //Llamamos funcion que cargará las tareas cuando el componente se muestre por 1ª vez
    useEffect(() => {  
        loadTodos();  
    }, []);  
    

    // función de cargar las tareas del usuario 
    const loadTodos = () => {  
        fetch(`https://playground.4geeks.com/todo/users/${user}`) 
            .then(response => response.json())  
            .then(data => {  
                setTodos(data.todos || []);  
            })  
            .catch(error => {       //Si hay un error al cargar las tareas, muestralo en consola.
                console.error("Error adding task:", error);  
            });  
    };  
    

    // funcion para agregar una tarea nueva
    const addTodo = () => {  
        if (inputValue.trim() === "") {        //Si el campo de entrada esta vacio, mostrara alerta.
            setShowAlert(true);  
            return;  
        }  

        setShowAlert(false);  // Si hay valor, no mostrar alerta
        

        //metodo POST para enviar nueva tarea
        const newTodo = { label: inputValue, is_done: false };  
        fetch(todosUrl + user, { 
            method: 'POST',  
            headers: {  
                'Content-Type': 'application/json',  
            },  
            body: JSON.stringify(newTodo),  
        })  
            .then(response => response.json())  
            .then(data => {  
                setTodos([...todos, data]);     // actualiza la lista de tareas con la nueva tarea 
                setInputValue("");  
            });  
    };  
    


    //funcion para borrar una tarea
    const deleteTodo = (id) => {  
        fetch(`${todosUrl}${id}`, {    // se llama al servidor para borrar la tarea por su id.
            method: 'DELETE',  
            headers: {  
                'accept': 'application/json'  
            }  
        })  

             // nos aseguramos de que la tarea esta borrada, si no error de consola.
            .then(response => {  
                if (response.ok) {  
                    setTodos(todos.filter(todo => todo.id !== id));  
                } else {  
                    console.error('Error deleting todo:', response);  
                }  
            });  
    };  
    

    //funcion para borrar todas las tareas
    const deleteAllTodos = () => {  
        const deletePromises = todos.map(todo =>      //creammos una lista de promesas para borrar cada tarea
            fetch(`${todosUrl}${todo.id}`, {  
                method: 'DELETE',  
                headers: {  
                    'accept': 'application/json'  
                }  
            })  
        );  

        Promise.all(deletePromises)     //esperamos que todas las promesas se completen
            .then(() => setTodos([]))      //cuando todas las tareas se eliminan, lipiamos la lista
            .catch(error => console.error('Error deleting all todos:', error));  
    }; 
    

    // funcion para saber cuando se pulsa una tecla
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {     // si presiona Enter llamaos la funcion addTodo
            addTodo();
        }
    };

    return (  

    <>
        <div className="container todo">
            <h1>To Do List</h1>

        </div>
        <div className="container tasks">
            {showAlert && (
                <div className = "alert alert-danger" role="alert">
                    Sorry, you have to write some tasks.
                </div>
            )}
            <input type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}    //cada cambio se actualiza el valor de inputValue segun el valor del evento
                onKeyDown={handleKeyDown}
                placeholder="Add a new task"
                className="newTask"
            />
            <List values={todos}>
                {todo => (
                    <li key={todo.id || todo.label}>
                        {todo.label}{" "}
                        <i
                            className="fa-solid fa-x"
                            onClick={() => deleteTodo(todo.id)}
                        ></i>
                    </li>
                )}
            </List>
            <div className='footer'>
                {todos.length} item left
            </div>
            <div className="button d-flex justify-content-center">  
                <button className="btn btn-warning" onClick={deleteAllTodos}>Delete All</button>  
            </div>
        </div>
    </>
);
};




export default Home;
