const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_INPUT_BYTES = 15 * 1024 * 1024;

export const PHOTO_ACCEPT = ACCEPTED.join(',');

/**
 * Shrinks a photo in the browser before upload: at most `maxSize` px on the longest side,
 * re-encoded as JPEG. A multi-megabyte phone photo becomes ~30–80 KB, which keeps the
 * database small. Throws an Error with a user-facing message for unusable files.
 */
export const resizeImage = async (file: File, maxSize = 512): Promise<Blob> => {
  if (!ACCEPTED.includes(file.type)) throw new Error('Choose a JPEG, PNG or WebP image.');
  if (file.size > MAX_INPUT_BYTES) throw new Error('That image is too large (15 MB max).');

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error('That file could not be read as an image.');
  }

  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Your browser could not process the image.');

  // JPEG has no transparency — fill white so transparent PNG areas don't turn black.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Your browser could not process the image.'))),
      'image/jpeg',
      0.85
    )
  );
};
