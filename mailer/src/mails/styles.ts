import type { CSSProperties } from "react"

const style =
  (style: CSSProperties) =>
  (override: CSSProperties = {}): CSSProperties => ({
    ...style,
    ...override,
  })

const COLOUR_BLACK = "#333333"
const COLOUR_GREY = "#555555"

const styles = {
  heading: {
    h1: style({
      fontSize: "36px",
      fontWeight: "700",
      color: COLOUR_BLACK,
    }),
    h6: style({
      fontSize: "16px",
      fontWeight: "700",
      color: COLOUR_BLACK,
    }),
  },
  text: {
    small: style({
      fontWeight: "400",
      fontSize: "10px",
      color: COLOUR_GREY,
      lineHeight: "normal",
    }),
  },
  button: style({
    cursor: "pointer",
    backgroundColor: "#000000",
    borderRadius: "8px",
    color: "#FFFFFF",
    padding: "12px 24px 12px 24px",
    fontSize: "18px",
  }),
  link: style({
    fontSize: "12px",
    fontWeight: "400",
    color: COLOUR_GREY,
    textDecoration: "underline",
  }),
  body: style({
    padding: "0px",
    margin: "0px",
  }),
  container: style({
    padding: "20px",
  }),
}

export default styles
