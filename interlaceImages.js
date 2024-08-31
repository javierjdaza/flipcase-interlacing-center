// Función para manejar el clic en el botón de interlace
export function interlaceImages() {
	// Verificar si hay imágenes en los contenedores
	const croppedImage1 = document.querySelector("#croppedImageContainer1 img");
	const croppedImage2 = document.querySelector("#croppedImageContainer2 img");

	if (!croppedImage1 || !croppedImage2) {
		alert("Please make sure both images are cropped before continuing.");
		return;
	}

	// Obtener el nombre del cliente
	const clientName = document.getElementById("clientTextInput").value.trim();
	if (!clientName) {
		alert("Please fill in the client text field.");
		return;
	}

	// Obtener el modelo de teléfono seleccionado
	const phoneModel = document
		.getElementById("dropDown")
		.value.replace(/^.*[\\\/]/, "")
		.replace(".svg", "");

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

	// Mostrar el spinner y ocultar el botón
	document.getElementById("loadingSpinner").style.display = "block";
	document.getElementById("interlaceButton").style.display = "none";

	fetch("https://flipcase-api.onrender.com/interlace/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	})
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			throw new Error(`Network error: ${response.status} ${response.statusText}`);
		})
		.then((data) => {
			console.log("Success:", data);
			if (data.status === "ok") {
				showMessage("Success: Your Tiff is ready", true);

				// Crear imagen a partir del base64
				const img = new Image();
				img.src = "data:image/tiff;base64," + data.image_interlaced_base64;

				// Crear botón de descarga
				const downloadButton = document.createElement("button");
				downloadButton.textContent = "Download .tiff";
				downloadButton.id = "download-button";

				downloadButton.style.marginLeft = "10px";
				downloadButton.onclick = () => {
					const link = document.createElement("a");
					link.href = img.src;
					link.download = `${clientName}_${phoneModel}.tiff`;
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				};

				// Añadir botón junto al botón de entrelazar
				const interlaceButton = document.getElementById("interlaceButton");
				interlaceButton.parentNode.insertBefore(downloadButton, interlaceButton.nextSibling);

				// Ocultar el spinner y mostrar el botón
				document.getElementById("loadingSpinner").style.display = "none";
				document.getElementById("interlaceButton").style.display = "block";
			} else {
				showMessage("Error: Problem processing images", false);
			}
		})
		.catch((error) => {
			console.error("Detailed error:", error);
			showMessage("Error: " + error.message, false);

			// Ocultar el spinner y mostrar el botón en caso de error
			document.getElementById("loadingSpinner").style.display = "none";
			document.getElementById("interlaceButton").style.display = "block";
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

function showMessage(message, isSuccess) {
	const messageElement = document.getElementById("resultMessage");
	messageElement.textContent = message;
	messageElement.className = isSuccess ? "success-message" : "error-message";
	messageElement.style.display = "block";
}
