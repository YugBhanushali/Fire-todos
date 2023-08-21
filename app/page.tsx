'use client'
import User from './components/User'
import { AuthContext } from '@/context/authContext'
import { useState } from 'react';
import Notes from './components/Notes';
import Footer from './components/Footer';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className='flex flex-col items-center justify-center mt-[200px]'>
        <AuthContext.Provider value={{user, setUser}}>
            <User />
            <Notes />
            <Footer />
        </AuthContext.Provider>
    </div>
    </main>
  )
}
