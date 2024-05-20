const DECISION_THRESHOLD = 75
let isAnimating = false
let pullDeltaX = 0 //distancia que la card se esta

const onEnd = () => {}

function startDrag(event) {
	if (isAnimating) return

	// get the first article element
	const actualCard = event.target.closest('article')
	if (!actualCard) return

	// get initial position of mouse or finger
	const startX = event.pageX ?? event.touches[0].pageX

	function onMove(event) {
		// current position of mouse or finger
		const currentX = event.pageX ?? event.touches[0].pageX

		// calculate distance between the initial position and current position
		pullDeltaX = currentX - startX

		// if the distance is equal to 0, nothing is done
		if (pullDeltaX === 0) return

		// calculate the rotation of the card using the distance
		const deg = pullDeltaX / 14

		isAnimating = true

		// apply the transformation to the card
		actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`

		// change cursor to grabbing
		actualCard.style.cursor = 'grabbing'

		// change opacity of the choice indicator
		const opacity = Math.abs(pullDeltaX) / 100
		const isRight = pullDeltaX > 0

		const choiceEl = isRight
			? actualCard.querySelector('.choice.like')
			: actualCard.querySelector('.choice.nope')

		choiceEl.style.opacity = opacity
	}

	function onEnd() {
		document.removeEventListener('mousemove', onMove)
		document.removeEventListener('touchmove', onMove)

		document.removeEventListener('mouseup', onEnd)
		document.removeEventListener('touchend', onEnd)

		// Check if the user took a decision
		const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD

		if (decisionMade) {
			const goRight = pullDeltaX > 0
			const goLeft = !goRight

			// add class according to the decision
			actualCard.classList.add(goRight ? 'go-right' : 'go-left')

			actualCard.addEventListener('transitionend', () => {
				actualCard.remove()
			})
		} else {
			actualCard.classList.add('reset')
			actualCard.classList.remove('go-left', 'go-right')
		}

		// reset variables
		actualCard.addEventListener('transitionend', () => {
			actualCard.removeAttribute('style')
			actualCard.classList.remove('reset')

			pullDeltaX = 0
			isAnimating = false
		})
	}

	// listen the mouse and touch movements
	document.addEventListener('mousemove', onMove)
	document.addEventListener('touchmove', onMove, { passive: true })

	// listen the mouse and touch up events
	document.addEventListener('mouseup', onEnd)
	document.addEventListener('touchend', onEnd, { passive: true })
}

document.addEventListener('mousedown', startDrag)
document.addEventListener('touchstart', startDrag, { passive: true })
