import './App.css'
import { NestedCheckbox } from './NestedCheckbox'
import { NestedCheckboxData } from './types'
import { generateData } from './util'

const dataOne: NestedCheckboxData = {
  foo: true,
  bar: false,
  foobar: {
    hello: true,
    hi: false,
    greetings: {
      tom: false
    } as NestedCheckboxData
  } as NestedCheckboxData
}

const data = generateData(5, 2);

function App() {
  return (
    <div className="App">
      <NestedCheckbox data={data} />
    </div>
  )
}

export default App
