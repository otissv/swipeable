import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import './styles.css'
import { Swipeable } from './Swipeable'

const ListStyled = styled.ul`
  margin: 0;
  padding: 0;
  width: 100%;
`

const ListItemStyled = styled.li`
  position: relative;
  width: inherit;
  height: 60px;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
`

function List({ items, ...propsRest }) {
  function handleDragEnd(e) {
    console.log(e)
  }

  const Background = () => 'Delete'

  return (
    <ListStyled className="List" {...propsRest}>
      {items.map(({ content, id }) => (
        <ListItem key={id}>
          <Swipeable uid={id} axis="x" onDragEnd={handleDragEnd}>
            <Background />
            {content}
          </Swipeable>
        </ListItem>
      ))}
    </ListStyled>
  )
}

function ListItem({ children, ...propsRest }) {
  return (
    <ListItemStyled className="ListItem" {...propsRest}>
      {children}
    </ListItemStyled>
  )
}

function App() {
  const items = [
    { id: '1', content: 'React' },
    { id: '2', content: 'JavaScript Library' },
    { id: '3', content: 'React-Pose' },
    { id: '4', content: 'Animations' },
    { id: '5', content: 'Material-UI' },
    { id: '6', content: 'Material Design' },
  ]

  return <List items={items} />
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
