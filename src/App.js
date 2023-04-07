import { useEffect, useState } from "react"
import ScoreBoard from "./components/ScoreBoard"

import brownCandy from './images/brownCandy.png'
import greenCandy from './images/greenCandy.png'
import orangeCandy from './images/orangeCandy.png'
import pinkCandy from './images/pinkCandy.png'
import purpleCandy from './images/purpleCandy.png'
import redCandy from './images/redCandy.png'

import blank from './images/blank.png'





const width = 8
const candyColor = [
    brownCandy,
    greenCandy,
    orangeCandy,
    pinkCandy,
    purpleCandy,
    redCandy,
        
]

const  App = ()=> {
    const[currentColorArrangement,setCurrentColorArrangement] = useState([])
    const[squareBeingDragged, setSquareBeingDragged ] = useState(null)
    const[squareBeingReplaced, setSquareBeingReplaced ] = useState(null)
    const [scoreDisplay ,setScoreDisplay] = useState(0)
    
    ///// create Game Canva 

    ////check for 4 coloum
    const checkForColoumOfFour = () => {
        for(let i = 0 ; i<= 39 ; i++){
            const columOfFour = [i , i+width, i+width * 2 , i + width * 3]
            const decidedColor = currentColorArrangement[i]
            const isBlank = currentColorArrangement[i] === blank

            if(columOfFour.every(square => currentColorArrangement[square] === decidedColor && ! isBlank)){
                setScoreDisplay((score)=> score + 4)
                columOfFour.forEach(square => currentColorArrangement[square] = blank)
                return true
            }
        }

    }

    ////check for 4 Row 
    const checkForRowOfFour = () => {
        for(let i = 0 ; i < 64 ; i++){
            const rowOfFour = [i ,i + 1 , i + 2 , i + 3]
            const decidedColor = currentColorArrangement[i]
            const isBlank = currentColorArrangement[i] === blank

            const notValid = [5,6,7,13,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,45,55,62,63,64]
            
            if(notValid.includes(i)) continue

            if(rowOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)){
                setScoreDisplay((score)=> score + 4)

                rowOfFour.forEach(square => currentColorArrangement[square] = blank)
                return true
            }
        }

    }

    ////check for 3 coloum
    const checkForColoumOfthree = () => {
        for(let i = 0 ; i<= 47 ; i++){
            const columOfThree = [i , i+width, i+width * 2]
            const decidedColor = currentColorArrangement[i]
            const isBlank = currentColorArrangement[i] === blank

            if(columOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank )){
                setScoreDisplay((score)=> score + 3)

                columOfThree.forEach(square => currentColorArrangement[square] = blank)
                return true
            }
        }

    }

    ////check for 3 row 
    const checkForRowOfthree = () => {
        for(let i = 0 ; i< 64 ; i++){
            const rowOfThree = [i ,i +1 , i +2 ]
            const decidedColor = currentColorArrangement[i]
            const notValid = [6,7,14,15,22,23,30,31,38,39,46,47,45,55,63,64]
            const isBlank = currentColorArrangement[i] === blank
            
            if(notValid.includes(i)) continue

            if(rowOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank )){
                setScoreDisplay((score)=> score + 3)

                rowOfThree.forEach(square => currentColorArrangement[square] = blank)
                return true
            }
        }

    }


    //// replace the empty square
    const moveIntoSquareBelow = ()=>{
        for(let i =0 ; i<= 64 - width ; i++){
            const firstRow = [0,1,2,3,4,5,6,7]
            const isFirstRow = firstRow.includes(i)
            //// genrate random color
            if(isFirstRow && currentColorArrangement[i] === blank ){
               let randomNumber = Math.floor(Math.random() * candyColor.length)
                currentColorArrangement[i] =candyColor[randomNumber]
            }


            if((currentColorArrangement[i + width]) === blank){
                currentColorArrangement[i+width] = currentColorArrangement[i]
                currentColorArrangement[i] = blank
            }
        }
    }

    /////// drag function 
    const dragStart = (e) => {
        setSquareBeingDragged(e.target)
    }

    const dragDrop = (e) => {
        setSquareBeingReplaced(e.target)
    }

    const dragEnd = () => {
        const squareBeingDraggedId = parseInt( squareBeingDragged.getAttribute('data-id'))
        const squareBeingReplacedId = parseInt( squareBeingReplaced.getAttribute('data-id'))

        currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute('src')
        currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src')

        //// move the square just by the closs square && and valid square
        const validMoves = [
            squareBeingDraggedId -1,
            squareBeingDraggedId +1,
            squareBeingDraggedId - width,
            squareBeingDraggedId + width,
        ]

        const validMove = validMoves.includes(squareBeingReplacedId)

        const isAColumnOfFour = checkForColoumOfFour()
        const isARowOfFour = checkForRowOfFour()
        const isAColumnOfThree = checkForColoumOfthree()
        const isARowOfThree = checkForRowOfthree()

        if(squareBeingReplaced && validMove && 
            (isAColumnOfFour || isARowOfFour || isAColumnOfThree || isARowOfThree )) {
                setSquareBeingDragged(null)
                setSquareBeingReplaced(null)
            }
            else {
                currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src')
                currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
                setCurrentColorArrangement([...currentColorArrangement])
            }
    }


    
    ///// create squre with color
    const createBoard = ()=> {
        const randomColorArrangement = []
        for(let i= 0 ; i < width * width ; i++ ){
            const randomColor = candyColor[Math.floor(Math.random()*candyColor.length)]
            randomColorArrangement.push(randomColor)
        }
        setCurrentColorArrangement(randomColorArrangement)
    }
    
    useEffect(()=>{
    createBoard()

    },[])

    //////// use effect hook 
    useEffect(() => {
        const timer = setInterval(()=> {
            checkForColoumOfFour()
            checkForRowOfFour()
            checkForColoumOfthree()
            checkForRowOfthree()
            moveIntoSquareBelow()
            setCurrentColorArrangement([...currentColorArrangement])
        },100)

        return ()=> clearInterval(timer)

    },[checkForColoumOfFour,checkForRowOfFour,checkForColoumOfthree,checkForRowOfthree,moveIntoSquareBelow,currentColorArrangement])



    return(
        <div className="app" >
            <div className="game" >
                {
                currentColorArrangement.map((candyColor, index )=> (
                    < img
                            key={index} 
                            src = {candyColor}
                            alt = {candyColor}
                            data-id = {index}
                            draggable = {true}
                            onDragStart = {dragStart}
                            onDragOver = {(e ) => e.preventDefault()}
                            onDragEnter = {(e) => e.preventDefault()}
                            onDragLeave = {(e) => e.preventDefault()}
                            onDrop = {dragDrop}
                            onDragEnd = {dragEnd}
                    />
                ))}
            </div>
            <ScoreBoard  score={scoreDisplay}/>
        </div>
    )
}

export default App