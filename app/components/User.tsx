'use client'
import React, { use, useContext, useEffect, useState } from 'react'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '@/utils/firebase'
import { AuthContext } from '@/context/authContext';
import { BarLoader } from 'react-spinners';


const User = () => {
    const {user, setUser} = useContext(AuthContext);
    const [isLoading,setIsLoading] = useState<boolean>(false);

    const googleSignIn = () => {
        setIsLoading(true)
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).then((result) => {
            const tempuser:any = result.user;
            console.log(tempuser)
            setUser(tempuser)
            setIsLoading(false);
        }
        ).catch((error) => {
            console.log(error)
        })
    }

    const logout = () => {
        signOut(auth).then(() => {
            setUser(null)
        }
        ).catch((error) => {
            console.log(error)
        }
        )
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth,(user) => {
            if (user) {
                const tempuser:any = user;
                setUser(tempuser)
            } else {
                setUser(null)
            }
        })
        return unsubscribe;
        
    }, [user])


  return (
    <div className='flex flex-col item-center justify-center text-center'>
      <div>
        <h1 className='text-[45px] font-medium'>Fire-Todo App</h1>
      </div>
      <div className='flex flex-col items-center justify-center'>
        <div>
          {
            isLoading
            ?
              <>
                <div className='flex items-center justify-center my-5'>
                  <BarLoader
                    loading={isLoading}
                    color='#000000'
                  />
                </div>             
              </>
            :
            <>
              {
                user 
                ?
                <div className='flex flex-col'>
                  <p className='text-[25px]'>Welcome {user.displayName}</p><br/>
                </div> 
                : 
                <div>
                  <p className='text-[25px] mb-5'>Sign In to write your Fire-Todos</p>
                </div>
              }
            </>
          }
        </div>
        <div>
          {
            user 
            ? 
            <button className='bg-[#c3c3c3] px-3 py-2 border-2 border-black hover:bg-[white] duration-300 ease-in-out' onClick={logout}>Sign Out</button> 
            : 
            <button className='bg-[#c3c3c3] px-3 py-2 border-2 border-black hover:bg-[white] duration-300 ease-in-out' onClick={googleSignIn}>Sign In</button>
          }
        </div>
      </div>
    </div>
  )
}

export default User
