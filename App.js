import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
} from 'react-native';
import Header from './companents/header';
import TodoItem from './companents/todoitem';
import AddTodo from './companents/addTodo';

export default function App(){

  const[todos,setTodos]=useState([
    {text:'Kahve satın alacağım',key:'1'},
    {text:'Bir uygulama yapacağım',key:'2'},
    {text:'Kitap yazacağım',key:'3'},

  ]);
  
  const pressHandler=(key) =>{
    setTodos((prevTodos)=>{
      return prevTodos.filter(todo=>todo.key != key);
    });
  }
  const submitHandler=(text)=>{
    setTodos((prevTodos)=>{
      return[
        {text:text,key:Math.random().toString()},
        ...prevTodos
      ]
    })
  }

  return (
   
    
      <View style={styles.container}>
        <Header/>
      <View style={styles.content}>
        <AddTodo submitHandler={submitHandler}/>
      <View style={styles.list}>
      <FlatList 
      data={todos}
      renderItem={({item})=>(
      <TodoItem item={item} pressHandler={pressHandler}/>
      )}
      />
      
      </View>
      </View>
      </View>   
   
  );
}

const styles = StyleSheet.create({
container:{
  flex:1, 
  backgroundColor:'lightgray'
},
content:{
padding:40,
},
list:{
  marginTop:20,
}
});