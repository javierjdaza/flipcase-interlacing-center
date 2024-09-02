const phoneOptions = ["iPhone 11.svg", "iPhone 12.svg", "iPhone 13.svg", "iPhone 14.svg", "iPhone 12 Pro.svg", "iPhone 13 Pro.svg", "iPhone 14 Pro.svg", "iPhone 15 Pro.svg", "iPhone 15 Plus.svg", "iPhone 12 Pro Max.svg", "iPhone 13 Pro Max.svg", "iPhone 14 Pro Max.svg", "iPhone 15 Pro Max.svg", "Samsung S22 Ultra.svg", "Samsung S23 Ultra.svg"];

export function fillDropdown($dropDown) {
	for (const file of phoneOptions) {
		const option = document.createElement("option");
		option.value = `statics/phone_svgs/${file}`;
		option.textContent = file.split(".")[0];
		$dropDown.appendChild(option);
	}
}
