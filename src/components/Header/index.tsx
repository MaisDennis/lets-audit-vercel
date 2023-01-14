import { useContext, useState } from 'react';
import { FiBell } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { RiFacebookBoxFill } from 'react-icons/ri';

//------------------------------------------------------------------------------
import { SignInButton } from '../SignInButton';
import styles from './styles.module.scss';
import { SessionContext } from '../../pages/index';
//------------------------------------------------------------------------------
export function Header({ 
  handleSignInFacebook,
  handleSignInGoogle,
  noButton,
}) {
  const [ toggleSignIn, setToggleSignIn ] = useState(false)

  function handleToggleSignIn() {
    setToggleSignIn(!toggleSignIn)
  }

  const session: any = useContext(SessionContext)

  function handleFacebookAction() {
    handleSignInFacebook()
    setToggleSignIn(false)
  }

  function handleGoogleAction() {
    handleSignInGoogle()
    setToggleSignIn(false)
  }
  // ---------------------------------------------------------------------------
  return (
    <header className={styles.headerContainer}>
      
      <div className={styles.div_01_A}>
        <img className={styles.flagIcon} src="/images/flag.jpg" alt="SomeLogo" />
        { 
          !noButton ? (
            <div className={styles.div_02_A}>
              {/* <nav>
                <a href="">Passo-a-passo</a>
              </nav>
              <button>
                <FiBell color="#17C8EB" size={28}/>
              </button> */}
              <div className={styles.div_03}>
                { session ? (
                  <img src={session.user.image} alt="avatar" />
                )
                : (
                  <img src="/images/defaultAvatar.png" alt="avatar" />
                )
                
                }
              </div>
              <SignInButton 
                handleToggleSignIn={handleToggleSignIn}
              />
            </div>
          )
          : null
        }
      </div>
      {
        toggleSignIn ? (
          <div className={styles.div_01_B}>
            <div className={styles.div_02_B}>
              
              <button 
                className={styles.facebookButton}
                onClick={() => handleFacebookAction()}
              >
                <RiFacebookBoxFill/>
                <p>Entrar com Facebook</p>
              </button>
              <button 
                className={styles.googleButton}
                onClick={() => handleGoogleAction()}
              >
                <FcGoogle/>
                <p>Entrar com Google</p>
              </button>
            </div>
          </div>
        )
        : (
          null
        )
      }

    </header>
  )
}