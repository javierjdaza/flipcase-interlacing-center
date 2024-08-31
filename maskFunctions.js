export function initializeMask(maskId, containerId) {
	let isDragging = false;
	let startX, startY;
	const svgMask = document.getElementById(maskId);
	const container = document.querySelector(`.${containerId}`);

	// Eventos para mouse
	svgMask.addEventListener("mousedown", startDragging);
	document.addEventListener("mousemove", moveMask);
	document.addEventListener("mouseup", stopDragging);

	// Eventos para touch
	svgMask.addEventListener("touchstart", startDragging);
	document.addEventListener("touchmove", moveMask);
	document.addEventListener("touchend", stopDragging);

	function startDragging(e) {
		isDragging = true;
		if (e.type === "mousedown") {
			startX = e.clientX - svgMask.offsetLeft;
			startY = e.clientY - svgMask.offsetTop;
		} else if (e.type === "touchstart") {
			startX = e.touches[0].clientX - svgMask.offsetLeft;
			startY = e.touches[0].clientY - svgMask.offsetTop;
		}
		svgMask.style.cursor = "grabbing";
		e.preventDefault(); // Prevenir comportamiento predeterminado
	}

	function moveMask(e) {
		if (!isDragging) return;
		e.preventDefault();
		let x, y;
		if (e.type === "mousemove") {
			x = e.clientX - startX;
			y = e.clientY - startY;
		} else if (e.type === "touchmove") {
			x = e.touches[0].clientX - startX;
			y = e.touches[0].clientY - startY;
		}

		const containerRect = container.getBoundingClientRect();
		const maskRect = svgMask.getBoundingClientRect();

		const maxX = containerRect.width - maskRect.width;
		const maxY = containerRect.height - maskRect.height;

		x = Math.max(0, Math.min(x, maxX));
		y = Math.max(0, Math.min(y, maxY));

		svgMask.style.left = x + "px";
		svgMask.style.top = y + "px";
	}

	function stopDragging() {
		isDragging = false;
		svgMask.style.cursor = "grab";
	}
}

export function updateMasks() {
	const dropDown = document.getElementById("dropDown");
	const svgPath = dropDown.value;
	document.getElementById("svgMask1").src = svgPath;
	document.getElementById("svgMask2").src = svgPath;

	adjustMask("svgMask1", "background-image-1");
	adjustMask("svgMask2", "background-image-2");
}

export function adjustMask(maskId, imageClass) {
	const mask = document.getElementById(maskId);
	const image = document.querySelector(`.${imageClass}`);

	function updateMaskSize() {
		const imageHeight = image.offsetHeight;
		const aspectRatio = mask.naturalWidth / mask.naturalHeight;
		// Calculamos el 80% del alto de la imagen
		const newHeight = imageHeight * 0.9;
		const newWidth = newHeight * aspectRatio;

		mask.style.height = `${newHeight}px`;
		mask.style.width = `${newWidth}px`;
	}

	// Update initial size
	updateMaskSize();

	// Update size when the image loads or changes
	image.addEventListener("load", updateMaskSize);

	// Observe changes in image size
	const observer = new ResizeObserver(updateMaskSize);
	observer.observe(image);
}
