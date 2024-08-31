export function uploadImage() {
	// Función para manejar la carga de imágenes
	function handleImageUpload(inputElement, imageClass) {
		const file = inputElement.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = function (e) {
				const img = new Image();
				img.onload = function () {
					if (img.width > img.height) {
						alert("Por favor, sube una imagen en formato vertical (altura > ancho).");
					} else {
						const backgroundImage = document.querySelector(`.${imageClass}`);
						backgroundImage.src = e.target.result;
					}
				};
				img.src = e.target.result;
			};
			reader.readAsDataURL(file);
		}
	}

	// Configurar los event listeners para los inputs de carga de imágenes
	["uploadImage1", "uploadImage2"].forEach((id, index) => {
		document.getElementById(id).addEventListener("change", (e) => {
			handleImageUpload(e.target, `background-image-${index + 1}`);
		});
	});

	// Configurar los event listeners para los botones de carga
	document.querySelectorAll(".button-upload").forEach((button, index) => {
		button.addEventListener("click", () => {
			document.getElementById(`uploadImage${index + 1}`).click();
		});
	});
}
