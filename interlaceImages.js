// Función para manejar el clic en el botón de interlace
export function interlaceImages() {
	// Verificar si hay imágenes en los contenedores
	const croppedImage1 = document.querySelector("#croppedImageContainer1 img");
	const croppedImage2 = document.querySelector("#croppedImageContainer2 img");

	if (!croppedImage1 || !croppedImage2) {
		alert("Por favor, asegúrate de que ambas imágenes estén recortadas antes de continuar.");
		return;
	}

	// Obtener el nombre del cliente
	const clientName = document.getElementById("clientTextInput").value.trim();
	if (!clientName) {
		alert("Por favor, rellena el campo de texto del cliente.");
		return;
	}

	// Obtener el modelo de teléfono seleccionado
	const phoneModel = document.getElementById("dropDown").value;

	// Convertir imágenes a base64
	const image1Base64 = getBase64Image(croppedImage1);
	const image2Base64 = getBase64Image(croppedImage2);

	// Verificar si se debe enviar a Telegram
	const sendToTelegram = document.getElementById("sendToTelegram").checked;

	// Preparar los datos para la API
	const data = {
		user_name: clientName,
		phone_model: phoneModel,
		image_1_base64: image1Base64,
		image_2_base64: image2Base64,
		send_to_telegram: sendToTelegram,
	};

	console.log(data);

	// Modificar la llamada a la API
	fetch("https://flipcase-api.onrender.com/interlace", {
		method: "POST",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
		redirect: "manual", // Cambiar a manual para manejar redirecciones nosotros mismos
	})
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			if (response.status === 307) {
				// Si hay una redirección, intentamos seguirla manualmente
				const newUrl = response.headers.get("Location");
				console.log("Redirigiendo a:", newUrl);
				return fetch(newUrl, {
					method: "POST",
					mode: "cors",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				});
			}
			throw new Error(`Error de red: ${response.status} ${response.statusText}`);
		})
		.then((response) => response.json())
		.then((data) => {
			console.log("Éxito:", data);
			if (data.status === "ok") {
				showMessage("Éxito: Imágenes enviadas correctamente", true);

				// Crear imagen a partir del base64
				const img = new Image();
				img.src = "data:image/tiff;base64," + data.image_interlaced_base64;

				// Crear botón de descarga
				const downloadButton = document.createElement("button");
				downloadButton.textContent = "Descargar imagen";
				downloadButton.style.marginLeft = "10px";
				downloadButton.onclick = () => {
					const link = document.createElement("a");
					link.href = img.src;
					link.download = "imagen_entrelazada.tiff";
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				};

				// Añadir botón junto al botón de entrelazar
				const interlaceButton = document.getElementById("interlaceButton");
				interlaceButton.parentNode.insertBefore(downloadButton, interlaceButton.nextSibling);
			} else {
				showMessage("Error: Hubo un problema al procesar las imágenes", false);
			}
		})
		.catch((error) => {
			console.error("Error detallado:", error);
			showMessage("Error: " + error.message, false);
		});
}

// Función auxiliar para convertir imagen a base64
function getBase64Image(img) {
	const canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);
	return canvas.toDataURL("image/png").split(",")[1];
}

function showMessage(mensaje, esExito) {
	const mensajeElement = document.getElementById("mensajeResultado");
	mensajeElement.textContent = mensaje;
	mensajeElement.className = esExito ? "mensaje-exito" : "mensaje-error";
	mensajeElement.style.display = "block";
}
