import crypto from 'crypto'

export const createDownloadToken = () => {
    const token = crypto.randomBytes(32).toString('hex')
    return {
        token,
        tokenHash: crypto.createHash('sha256').update(token).digest('hex')
    }
}

export const createDownloadUrl = (token) => {
    const backendUrl = process.env.BACKEND_URL
    if (!backendUrl) {
        throw new Error('BACKEND_URL must be configured to send digital download links')
    }

    return `${backendUrl.replace(/\/+$/, '')}/api/delivery/download/${token}`
}

export const getDownloadExpiry = (product) => {
    const expiryHours = Number(product.downloadExpiry ?? 48)
    if (!Number.isFinite(expiryHours) || expiryHours <= 0) {
        throw new Error(`Invalid download expiry for product ${product._id}`)
    }

    return new Date(Date.now() + expiryHours * 60 * 60 * 1000)
}

export const addProductDownloadLink = (order, product) => {
    if (!product.downloadPublicId || !product.downloadResourceType || !product.downloadFormat) {
        return null
    }

    const { token, tokenHash } = createDownloadToken()
    const downloadLink = {
        productId: product._id.toString(),
        productName: product.name,
        downloadUrl: createDownloadUrl(token),
        expiresAt: getDownloadExpiry(product),
        delivered: true,
        deliveredAt: new Date(),
        downloadTokenHash: tokenHash
    }
    const existingLinkIndex = order.downloadLinks.findIndex(
        link => link.productId === downloadLink.productId
    )

    if (existingLinkIndex >= 0) {
        order.downloadLinks[existingLinkIndex] = downloadLink
    } else {
        order.downloadLinks.push(downloadLink)
    }

    return downloadLink
}
