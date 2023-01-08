import React from 'react';
import { signIn } from 'next-auth/react'

import styles from './SignUpPage.module.scss'

export default function SignUpPage() {
  return (
    <div className={styles.div_01}>
      <div className={styles.div_02}>
        <h1>Sign In</h1>
        <form>
          <div className={styles.div_03}>
            <label htmlFor="email">Email</label>
            <input type="text" />
          </div>
          <div className={styles.div_03}>
            <label htmlFor="email">Email</label>
            <input type="text" />
          </div>
          <div className={styles.div_03}>
            <label htmlFor="email">Email</label>
            <input type="text" />
          </div>
          <div className={styles.div_03}>
            <label htmlFor="email">Email</label>
            <input type="text" />
          </div>
        </form>
        
      </div>    
    </div>
  )
}