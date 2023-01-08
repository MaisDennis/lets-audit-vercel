import { useContext } from 'react';
import Link from 'next/link'
import { signOut } from "next-auth/react";
//------------------------------------------------------------------------------
import styles from './styles.module.scss'
import { SessionContext } from '../../pages/index'
//------------------------------------------------------------------------------
export function SignInButton({ 
  handleToggleSignIn
  // session
}) {

const session = useContext(SessionContext)
// console.log('SignInButton', session)

return ( 
  session === null
    ? (
      <button 
        type="button"
        className={styles.logIn}
        onClick={() => handleToggleSignIn()}
      >
        {/* <Link href="/signUp">Logar</Link> */}
        Log In

      </button>
    ) 
    : (
      <button 
        type="button"
        className={styles.logIn}
        onClick={() => signOut({
          redirect: true,
          callbackUrl: "http://localhost:3000"
        })}
      >
        Sair
      </button>
    )
  )
}