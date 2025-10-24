import { Container, Section } from "@react-email/components"
import { Layout } from "./Layout.tsx"
import styles from "./styles.ts"

export default function WelcomeEmail(props: { name: string }) {
  return (
    <Layout preview="Welcome email">
      <Container style={styles.container()}>
        <Section style={{ textAlign: "center" }}>Welcome to this test email {props.name}</Section>
      </Container>
    </Layout>
  )
}
