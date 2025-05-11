/**
 * 获取一组云存储图片的临时访问 URL。
 * @param {string[]} images - 图片路径数组，可能包含云存储路径（以 'cloud' 开头）。
 * @returns {Promise<string[]>} - 返回替换了云存储路径的临时访问 URL 的图片路径数组。
 */
export async function getCloudImageTempUrl(images) {
  const handledIndexToOriginIndex = new Map(); // 映射处理后图片索引到原始图片索引
  const shouldBeHandledImages = []; // 需要处理的云存储图片路径数组

  images.forEach((x, index) => {
    if (!x.startsWith('cloud')) return; // 如果不是云存储路径，跳过

    const handleIndex = shouldBeHandledImages.length;
    shouldBeHandledImages.push(x); // 添加到需要处理的图片数组
    handledIndexToOriginIndex.set(handleIndex, index); // 记录处理索引与原始索引的映射
  });

  // 获取云存储图片的临时访问 URL
  const handledImages = (
    await wx.cloud.getTempFileURL({
      fileList: shouldBeHandledImages,
    })
  ).fileList.map((x) => x.tempFileURL);

  const ret = [...images]; // 创建返回结果的副本
  handledImages.forEach((image, handleIndex) => (ret[handledIndexToOriginIndex.get(handleIndex)] = image)); // 替换云存储路径为临时 URL

  return ret;
}

/**
 * 获取单个云存储图片的临时访问 URL。
 * @param {string} image - 图片路径，可能是云存储路径（以 'cloud' 开头）。
 * @returns {Promise<string>} - 返回替换了云存储路径的临时访问 URL。
 */
export async function getSingleCloudImageTempUrl(image) {
  if (!image.startsWith('cloud')) return image; // 如果不是云存储路径，直接返回原路径
  return (
    await wx.cloud.getTempFileURL({
      fileList: [image],
    })
  ).fileList[0].tempFileURL; // 返回云存储图片的临时访问 URL
}
