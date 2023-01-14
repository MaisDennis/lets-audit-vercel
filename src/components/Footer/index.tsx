import styles from './styles.module.scss';
import Link from 'next/link'
// -----------------------------------------------------------------------------
export function Footer() {
  return (
    <div className={styles.div_01}>
      <div className={styles.div_01_A}>
        <Link href="/privacy">Política de Privacidade</Link>
        <Link href="/terms">Termos e Condições</Link>
        <p>© 2023</p>
      </div>
    </div>
  )
}