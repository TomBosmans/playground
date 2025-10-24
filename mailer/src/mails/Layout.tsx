import { Body, Font, Head, Html, Preview } from "@react-email/components"
import type { ReactNode } from "react"
import fonts from "./fonts.ts"
import styles from "./styles.ts"

type Props = {
  children: ReactNode
  language?: "en" | "nl"
  preview: string
}

export function Layout({ children, preview, language = "en" }: Props) {
  return (
    <Html lang={language}>
      <Head>
        <Font {...fonts.roboto} />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={styles.body()}>{children}</Body>
    </Html>
  )
}
