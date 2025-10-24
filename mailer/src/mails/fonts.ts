import type { FontProps } from "@react-email/components"

const font = (props: FontProps): FontProps => props

const fonts = {
  roboto: font({
    fontFamily: "Roboto",
    fallbackFontFamily: "Verdana",
    webFont: {
      url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
      format: "woff2",
    },
    fontWeight: 400,
    fontStyle: "normal",
  }),
}

export default fonts
