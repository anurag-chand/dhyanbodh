import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
// @ts-ignore
import script from "./scripts/gita.inline"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const links = opts?.links ?? []
    return (
      <footer class={`${displayClass ?? ""}`}>
        <ul>
          {Object.entries(links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>
      </footer>
    )
  }

  Footer.css = style
  Footer.afterDOMLoaded = script
  return Footer
}) satisfies QuartzComponentConstructor
