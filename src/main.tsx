import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './App.tsx'
import './index.css'

export const createRoot = ViteReactSSG(
  { routes },
  () => {
    // Analytics can be wrapped here or just injected globally via root component wrapper
  }
)
