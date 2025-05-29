import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Header from './Header';

const API = 'https://to-do-backend-q9sw.onrender.com/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);

  // Fetch user info on mount
  useEffect(() => {
    axios.get('https://to-do-backend-q9sw.onrender.com/auth/user', { withCredentials: true })
      .then(res => {
        if (res.data && res.data.displayName) {
          setUser(res.data);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, []);

  // Fetch todos for logged-in users, or from localStorage for guests
  useEffect(() => {
    if (user) {
      fetch("https://to-do-backend-q9sw.onrender.com/api/todos", { credentials: 'include' })
        .then(res => res.json())
        .then(data => setTodos(data));
    } else {
      // For guests, use localStorage
      const localTodos = JSON.parse(localStorage.getItem('guestTodos') || '[]');
      setTodos(localTodos);
    }
  }, [user]);

  // Save guest todos to localStorage when changed and not logged in
  useEffect(() => {
    if (!user) {
      localStorage.setItem('guestTodos', JSON.stringify(todos));
    }
  }, [todos, user]);

  const toggleTheme = () => setDarkMode(prev => !prev);

  const addTodo = () => {
    if (!text.trim()) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 1800);
      return;
    }
    if (user) {
      // Send all fields: task, userId, completed
      axios.post(
        API,
        {
          task: text,
          userId: user._id,      // or user.id depending on your backend user object
          completed: false
        },
        { withCredentials: true }
      )
        .then(res => {
          setTodos([res.data, ...todos]);
          setText('');
        })
        .catch(err => {
          setShowPopup(true);
          setTimeout(() => setShowPopup(false), 1800);
        });
    } else {
      // For guests, add to local state and localStorage
      const newTodo = {
        _id: Date.now().toString(),
        text: text,
        completed: false
      };
      const updatedTodos = [newTodo, ...todos];
      setTodos(updatedTodos);
      localStorage.setItem('guestTodos', JSON.stringify(updatedTodos));
      setText('');
    }
  };

  const deleteTodo = id => {
    if (user) {
      axios.delete(`${API}/${id}`, { withCredentials: true }).then(() => {
        setTodos(todos.filter(todo => todo._id !== id));
      });
    } else {
      setTodos(todos.filter(todo => todo._id !== id));
    }
  };

  const toggleComplete = (id, current) => {
    if (user) {
      axios.put(`${API}/${id}`, { completed: !current }, { withCredentials: true }).then(res => {
        setTodos(todos.map(todo => (todo._id === id ? res.data : todo)));
      });
    } else {
      setTodos(todos.map(todo =>
        todo._id === id ? { ...todo, completed: !todo.completed } : todo
      ));
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    document.body.className = !darkMode ? 'dark' : 'light';
  };

  return (
    <div className={darkMode ? 'app dark' : 'app light'}>
      <Header
        user={user}
        setUser={setUser}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <div className="App-header">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', position: 'relative' }}>
          <h1 style={{ marginBottom: 24, textAlign: 'center', width: '100%' }}>To-Do List</h1>
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, justifyContent: 'center', width: '100%', position: 'relative' }}>
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Add a new task..."
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                border: darkMode ? '1px solid #444' : '1px solid #ccc',
                fontSize: 16,
                minWidth: 200,
                background: darkMode ? '#23272f' : '#fff',
                color: darkMode ? '#fff' : '#23272f',
                outline: 'none',
                transition: 'background 0.2s, color 0.2s, border 0.2s',
              }}
            />
            <button
              onClick={addTodo}
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                border: 'none',
                background: '#27ae60',
                color: '#fff',
                fontWeight: 500,
                fontSize: 16,
                cursor: 'pointer',
              }}
            >
              Add
            </button>
            {showPopup && (
              <div className="popup">
                Please enter a task
              </div>
            )}
          </div>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, width: '100%', maxWidth: 400, margin: '0 auto' }}>
          {todos.map(todo => (
            <li
              key={todo._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: darkMode ? '#23272f' : '#f3f4f6',
                color: darkMode ? '#fff' : '#23272f',
                borderRadius: 8,
                padding: '10px 16px',
                marginBottom: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              <span
                onClick={() => toggleComplete(todo._id, todo.completed)}
                style={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  cursor: 'pointer',
                  flex: 1,
                  color: todo.completed
                    ? darkMode ? '#888' : '#aaa'
                    : darkMode ? '#fff' : '#333',
                  fontSize: 16,
                  textAlign: 'left',
                  transition: 'color 0.2s',
                }}
              >
                {todo.text || todo.task}
              </span>
              <button
                onClick={() => deleteTodo(todo._id)}
                style={{
                  marginLeft: 12,
                  background: '#ff4f4f',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: 14,
                }}
                title="Delete"
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
