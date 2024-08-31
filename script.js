import { initializeMask, updateMasks, adjustMask } from "./maskFunctions.js";
import { cropImage } from "./cropper.js";
import { uploadImage } from "./uploadImage.js";
import { fillDropdown } from "./dropdownFiller.js";

// Importar la función interlaceImages desde el nuevo archivo
import { interlaceImages } from "./interlaceImages.js";
document.addEventListener("DOMContentLoaded", () => {
	const $dropDown = document.getElementById("dropDown");

	if ($dropDown) {
		fillDropdown($dropDown);

		// Add event to dropdown
		$dropDown.addEventListener("change", updateMasks);

		// Initialize with the first value
		updateMasks();
	} else {
		console.error("El elemento dropdown no se encontró en el DOM");
	}
	try {
		uploadImage();
	} catch (error) {
		console.error("Error al ejecutar uploadImage:", error);
	}
	initializeMask("svgMask1", "image-1");
	initializeMask("svgMask2", "image-2");

	adjustMask("svgMask1", "background-image-1");
	adjustMask("svgMask2", "background-image-2");

	cropImage("cropButton1", "background-image-1", "croppedImageContainer1", "svgMask1");
	cropImage("cropButton2", "background-image-2", "croppedImageContainer2", "svgMask2");

	const $interlaceButton = document.getElementById("interlaceButton");

	// Agregar el event listener al botón de interlace
	document.getElementById("interlaceButton").addEventListener("click", interlaceImages);
});
