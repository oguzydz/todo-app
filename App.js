import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Components
import Header from './companents/header';
import TodoItem from './companents/todoitem';
import AddTodo from './companents/addTodo';


const TODO_APP_DATA = "TODO_APP_DATA"

export default function App() {
  // local storage / yerel depolama

  /**
   * Kullanıcı girdi.
   * Local Storage'den datayı oku.
   * 
   * Data varsa; datayı javascript'e çevir.
   *  1- Bunları listele
   *  2- İşleme yapabilmesi button'ları set et.
   * 
   * Data yoksa; kullancıya data'nın olmadığını göster.
   *  1- Input göster.
   */

  const [todos, setTodos] = useState([]);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);


  const storeLocalTodoData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(TODO_APP_DATA, jsonValue)
    } catch (e) {
      console.log(e)
    }
  }


  const getLocalTodoData = async () => {
    try {
      const value = await AsyncStorage.getItem(TODO_APP_DATA)

      if (value !== null) {
        const jsonValue = JSON.parse(value)

        if (jsonValue.length > 0) {
          setTodos(jsonValue);
        }

        if (!jsonValue.length > 0) {
          setIsOnboarding(true)
          setTodos([]);
        }
      }

      if (value == null) {
        setIsOnboarding(true)
        setTodos([]);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    getLocalTodoData();
  }, []);

  const pressHandler = (key) => {
    const filteredData = todos.filter(todo => todo.key != key)

    setTodos(filteredData);
    storeLocalTodoData(filteredData)
  }

  const submitHandler = (text) => {
    if (text.length > 3) {

      const key = Math.random().toString();

      const newTodo = {
        text: text,
        key: key
      }

      const newTodos = [newTodo, ...todos];

      setTodos(newTodos);
      storeLocalTodoData(newTodos)

    }

    if (text.length <= 3) {
      alert("3 karakterden büyük değer girin!")
    }
  }


  if (loading) {
    return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={styles.emptyText}>Loading</Text>
    </View>
  }


  return (<View style={styles.container}>
    <Header />
    <View style={styles.content}>
      {!isOnboarding && <AddTodo submitHandler={submitHandler} />}
      <View style={styles.list}>
        {todos.length > 0 &&
          <FlatList
            data={todos}
            extraData={todos}
            renderItem={({ item }) => (
              <TodoItem item={item} pressHandler={pressHandler} />
            )}
          />}
        {todos.length === 0 && isOnboarding &&
          <TouchableOpacity onPress={() => setIsOnboarding(false)} style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Empty Todo {"\n"} Please start to add!</Text>
          </TouchableOpacity>
        }
      </View>
    </View>
  </View>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  content: {
    padding: 40,
  },
  list: {
    marginTop: 20,
  },
  emptyContainer: {
    padding: 30,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 20,
    borderColor: 'red',
    justifyContent: "center",
    alignItems: "center"
  },
  emptyText: {
    color: 'red',
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center"
  }
});