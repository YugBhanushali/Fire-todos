import { AuthContext } from "@/context/authContext";
import { app } from "@/utils/firebase";
import React, { useContext, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  query,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import { MdOutlineDoneOutline } from "react-icons/md";
import { set } from "firebase/database";
import { BarLoader } from "react-spinners";

const Notes = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [todos, setTodos] = useState<any>([]);
  const [eachTodo, setEachTodo] = useState<any>("");

  //for common todos
  const addTodo = async(e:any) => {
    e.preventDefault();
    const docRef = await addDoc(collection(db, "to-do"), {
      task: eachTodo,
    });
    console.log("Document written with ID: ", docRef.id);
  };

  //for common todos
  const getData = async () => {
    const test = query(collection(db, "to-do"));
    const tempTest = onSnapshot(test, (querySnapshot) => {
        const temp:any = [];
      querySnapshot.forEach((doc) => {
        const tempObj:any = {
            id: doc.id,
            task:doc.data().task
        };
        temp.push(tempObj);
    });
        setTodos(temp);
    });
  };

//for common todos
  const deleteTodo = async(id:any) => {
    const docRef = doc(db, "to-do", id);
    const deleteTodo = await deleteDoc(docRef);
    console.log(deleteTodo);
    };

    //for user specific todos
    const addTodoUser = async(e:any) => {
        setIsLoading(true);
        e.preventDefault();
        //i want to store array of todos in user document
        const docRef = doc(db, "to-do", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            const temp = docSnap.data();
            temp.todos.push({
                id:temp.todos.length+1,
                task:eachTodo
            });
            await setDoc(docRef, temp);
            getDataUser();
        }
        else {
            const makeDoc = await setDoc(docRef, {
                todos: [{
                    id:1,
                    task:eachTodo
                }]
            });
            getDataUser();
            console.log("No such document!");
        }
        setEachTodo("");
    };

    //for user specific todos
    const getDataUser = async () => {
        setIsLoading(true);
        const docRef = doc(db, "to-do", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            const temp = docSnap.data();
            setTodos(temp.todos);
          }
        setIsLoading(false);
    }

    //for user specific todos
    const deleteTodoUser = async(id:any) => {
        setIsLoading(true);
        const docRef = doc(db, "to-do", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            const temp = docSnap.data();
            const tempTodos = temp.todos.filter((todo:any) => todo.id !== id);
            temp.todos = tempTodos;
            await setDoc(docRef, temp);
          }
        getDataUser();
    }


  useEffect(() => {
    if(user){
        getDataUser();
    }
    else{
        setTodos([]);
    }
  }, [user]);

  return (
    <div className="flex flex-col mt-3">
      {user ? (
        <>
          {/* <h1>Todos</h1> */}
          <form className="flex flex-row gap-x-2">
            <input 
                className="bg-[white] px-4 py-1 border-2 border-black focus:outline-2 focus:outline-black focus:outline-offset-[4px]"
                onChange={(e)=>setEachTodo(e.target.value)} type="text" value={eachTodo} placeholder="Add a todo" />
            <button 
                className="bg-[#c3c3c3] px-3 py-2 border-2 border-black hover:bg-slate-100"
                onClick={addTodoUser} 
            >
                Add Todo
            </button>
          </form>

          <div className="mt-2">
              {
                  isLoading ?
                  <div className="flex flex-col items-center justify-center mt-2">
                    <BarLoader loading={isLoading} color="#000000" />
                  </div>
                  :
                  <>
                    {todos.length !== 0 ?
                      todos.map((todo:any,index:number) => {
                      return(
                          <div
                              className="flex flex-row items-center justify-start gap-x-2"
                          >
                              <div className="flex">
                                  <button 
                                      className="bg-[#c3c3c3]  hover:bg-slate-100 border-2 border-black p-2 ease-in-out duration-300"
                                      onClick={()=>deleteTodoUser(todo.id)}
                                  >
                                      <MdOutlineDoneOutline
                                          className="text-[30px]"
                                      />
                                  </button>
                              </div>
                              <div
                                  key={todo.id}
                                  className="flex flex-col items-start justify-start bg-[#c3c3c3] px-4 py-2 my-1 border-2 border-black"
                              >
                              {index+1}: {todo.task}
                              </div>
                              
                          </div>
                      )
                      })
                      : 
                      <div className="flex justify-center items-center">
                          <p>No todos yet</p>
                      </div>
                    }
                  </>
              }

          </div>
        </>
      ) : null}
      
    </div>
  );
};

export default Notes;
