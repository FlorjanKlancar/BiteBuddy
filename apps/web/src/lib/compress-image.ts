const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export async function compressImage(
	file: File,
	maxDimension = 1024,
	quality = 0.7,
): Promise<string> {
	if (file.size > MAX_FILE_SIZE) {
		throw new Error("Image is too large. Please use an image under 20MB.");
	}

	const bitmap = await createImageBitmap(file);
	const { width, height } = bitmap;

	let targetWidth = width;
	let targetHeight = height;

	if (width > maxDimension || height > maxDimension) {
		const ratio = Math.min(maxDimension / width, maxDimension / height);
		targetWidth = Math.round(width * ratio);
		targetHeight = Math.round(height * ratio);
	}

	const canvas = new OffscreenCanvas(targetWidth, targetHeight);
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Failed to create canvas context");

	ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
	bitmap.close();

	const blob = await canvas.convertToBlob({ type: "image/jpeg", quality });
	const buffer = await blob.arrayBuffer();
	const bytes = new Uint8Array(buffer);

	let binary = "";
	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
}
