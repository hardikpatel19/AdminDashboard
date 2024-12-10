export  const BinaryToImage = (binaryImageData)=>{
    const blob = new Blob([binaryImageData], { type: 'image/jpeg' });

    // Create an object URL
    const objectURL = URL.createObjectURL(blob);
    return objectURL
}