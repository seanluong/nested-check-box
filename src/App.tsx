import './App.css'
import { NestedCheckboxData, NestedCheckbox } from './NestedCheckbox';

const dataOne: NestedCheckboxData = {
  foo: true,
  bar: false,
  group1: {
    level2: true,
    level2option2: false,
    nested: {
      option: false
    } as NestedCheckboxData
  } as NestedCheckboxData
}

const dataTwo: NestedCheckboxData = {
  foo: true,
  bar: {
    test: {
      hello: {
        world: false,
        hi: true,
      } as NestedCheckboxData
    } as NestedCheckboxData,
    testTwo: false,
  },
  group1: {
    level2: true,
    level2option2: false,
    nested: {
      option: false
    } as NestedCheckboxData
  } as NestedCheckboxData
}

// Generate a big data object for testing and optimization

function App() {
  return (
    <div className="App">
      <NestedCheckbox data={dataTwo} />
    </div>
  )
}

export default App
