const AVATAR_SIZE = 384

export async function prepareAvatar(file: File) {
  const source = URL.createObjectURL(file)

  try {
    const image = new Image()
    image.src = source
    await image.decode()

    const cropSize = Math.min(image.naturalWidth, image.naturalHeight)
    const outputSize = Math.min(cropSize, AVATAR_SIZE)
    const canvas = document.createElement('canvas')
    canvas.width = outputSize
    canvas.height = outputSize

    const context = canvas.getContext('2d')
    if (!context || cropSize === 0) throw new Error('Image could not be resized.')

    const left = (image.naturalWidth - cropSize) / 2
    const top = (image.naturalHeight - cropSize) / 2
    context.drawImage(image, left, top, cropSize, cropSize, 0, 0, outputSize, outputSize)

    return canvas.toDataURL('image/webp', 0.9)
  } finally {
    URL.revokeObjectURL(source)
  }
}
