import React, { useReducer, useMemo, useRef } from 'react'
import styled from 'styled-components'
import posed from 'react-pose'

const triggerDistance = 90

const SwipeableForegroundPose = posed.div({
  draggable: 'x',
  dragBounds: { left: '-100%', right: '100%' },
  dragEnd: {
    transition: ({ from, to, velocity }) => {
      if (from <= -triggerDistance) {
        return {
          type: 'tween',
          ease: 'linear',
          from,
          // for some reason, transitioning
          // to "100%" doesn't work properly
          // in real life, make sure to use "window.innerWidth" instead
          to: -window.innerWidth,
          duration: 280,
        }
      }
      return {
        type: 'spring',
        from,
        to,
        velocity,
        stiffness: 750,
        damping: 50,
      }
    },
  },
  flip: {
    scale: 1,
    transition: {
      default: {
        type: 'tween',
        duration: 200,
      },
    },
  },
})

const SwipeableStyled = styled.div`
  user-select: none;
  display: flex;
  height: inherit;
`

const SwipeableBackgoundStyled = styled.div`
  padding-right: 24px;
  background: #f00;
  height: inherit;
  flex: 1;
`

const SwipeableForegroundStyled = styled(SwipeableForegroundPose)`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #ffffff;
  width: inherit;
  height: inherit;
  padding-left: 24px;
  padding-right: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
`

export function useDraggable(
  initialValue = {},
  { onDragEnd, onDragStart } = {}
) {
  function reducer(state, action) {
    switch (action.type) {
      case 'IS_DRAGGIND': {
        return {
          ...state,
          isDragging: action.isDragging,
        }
      }

      case 'DRAG_START': {
        return {
          ...state,
          dragStart: action.dragStart,
        }
      }

      case 'DRAG_END': {
        return {
          ...state,
          dragEnd: action.dragEnd,
        }
      }

      default:
        return state
    }
  }

  const initialState = {
    isDragging: false,
    dragStart: {
      x: 0,
      y: 0,
    },
    dragEnd: {
      x: 0,
      y: 0,
    },
    ...initialValue,
  }

  const [{ dragEnd, dragStart, ...draggable }, dispatch] = useReducer(
    reducer,
    initialState
  )
  return useMemo(
    () => ({
      dragEnd,
      dragStart,
      ...draggable,
      draggable: 'true',
      onDragEnd,
      onDragStart,
      dispatch,
      distance: {
        x: dragEnd.x === 0 ? 0 : dragEnd.x - dragStart.x,
        y: dragEnd.y === 0 ? 0 : dragEnd.y - dragStart.y,
      },
    }),
    [dragEnd, dragStart, draggable, dispatch]
  )
}

export function Swipeable({ children, onDragEnd, onDragStart, ...propsRest }) {
  return (
    <SwipeableStyled className="Swipeable" {...propsRest}>
      <SwipeableBackgound>{children[0]}</SwipeableBackgound>
      <SwipeForeground
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
        {...propsRest}
      >
        {children[1]}
      </SwipeForeground>
    </SwipeableStyled>
  )
}

function SwipeableBackgound({ children, ...propsRest }) {
  return (
    <SwipeableBackgoundStyled className="SwipeableBackgound" {...propsRest}>
      {children}
    </SwipeableBackgoundStyled>
  )
}

export function SwipeForeground({
  axis,
  children,
  onDragEnd,
  onDragStart,
  uid,
  ...propsRest
}) {
  const { distance, dispatch, ...swipe } = useDraggable(
    {},
    {
      axis,
      onDragEnd: handleDragEnd,
      onDragStart: handleDragStart,
    }
  )

  const swipeableForegroundRef = useRef()

  async function handleDragEnd(e, gestureState) {
    dispatch({
      type: 'IS_DRAGGING',
      isDragging: false,
    })

    dispatch({
      type: 'DRAG_END',
      dragEnd: {
        x: e.clientX,
        y: e.clientY,
      },
    })
    console.log(arguments)

    if (e.clientX >= swipe.dragStart.x + 100) {
      // let translate = {
      //   ...(axis !== 'y'
      //     ? { translateX: swipeableForegroundRef.current.offsetWidth }
      //     : {}),
      //   ...(axis !== 'x'
      //     ? { translateY: swipeableForegroundRef.current.offsetHeight }
      //     : {}),
      // }
      // await anime({
      //   targets: swipeableForegroundRef.current,
      //   ...translate,
      //   easing: 'spring(0, 50, 10, 0)',
      // }).finished.then(() => {
      //   //NOT FIRING
      // })
    }
  }

  function handleDragStart(e) {
    //set id on drag object
    // e.dataTransfer.setData('text/plain', e.target.dataset.uid)

    dispatch({
      type: 'IS_DRAGGING',
      isDragging: true,
    })
    dispatch({
      type: 'DRAG_START',
      dragStart: {
        x: e.clientX,
        y: e.clientY,
      },
    })

    onDragStart && onDragStart(e)
  }

  return (
    <SwipeableForegroundStyled
      className="SwipeForeground"
      data-uid={uid}
      ref={swipeableForegroundRef}
      {...swipe}
      {...propsRest}
    >
      {children}
    </SwipeableForegroundStyled>
  )
}
