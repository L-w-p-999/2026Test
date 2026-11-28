function quantize(points,k) {
  // 固定种子，抽取不同像素位置，便于复现实验。
  const order = points.map((_,i)=>i);
  let seed = 2026;
  const centers = [];
  for (let i=0;i<k;i++) {
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;
    const j=i+Math.floor(seed/4294967296*(points.length-i));
    [order[i],order[j]]=[order[j],order[i]];
    centers.push(points[order[i]]);
  }
  let palette=centers;
  for (let t=0;t<10;t++) {
    const labels=findClosestCentroids(points,palette);
    palette=computeCentroids(points,labels,palette);
  }
  return {palette, labels:findClosestCentroids(points,palette)};
}
