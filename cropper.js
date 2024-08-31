export function cropImage(cropButtonId, backgroundImageClass, croppedImageContainerId, svgMaskId) {
	const cropButton = document.getElementById(cropButtonId);
	const backgroundImage = document.querySelector(`.${backgroundImageClass}`);
	const croppedImageContainer = document.getElementById(croppedImageContainerId);
	const svgMask = document.getElementById(svgMaskId);

	cropButton.addEventListener("click", performCrop);

	function performCrop() {
		const maskRect = svgMask.getBoundingClientRect();
		const imageRect = backgroundImage.getBoundingClientRect();

		const scaleX = backgroundImage.naturalWidth / imageRect.width;
		const scaleY = backgroundImage.naturalHeight / imageRect.height;

		const x = (maskRect.left - imageRect.left) * scaleX;
		const y = (maskRect.top - imageRect.top) * scaleY;
		const width = maskRect.width * scaleX;
		const height = maskRect.height * scaleY;

		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;

		const ctx = canvas.getContext("2d");
		ctx.drawImage(backgroundImage, x, y, width, height, 0, 0, width, height);

		const croppedImage = document.createElement("img");
		croppedImage.src = canvas.toDataURL();
		croppedImage.style.width = "100%";

		croppedImageContainer.innerHTML = "";
		croppedImageContainer.appendChild(croppedImage);
	}
}
