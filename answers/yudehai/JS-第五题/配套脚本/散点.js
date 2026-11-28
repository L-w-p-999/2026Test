const initialCenters = [[3,3],[6,2],[8,5]];
const inks = ['#176eaa','#cb591b','#16806c'];
const pen = scatter.getContext('2d');
let centers, labels, previous, round, assigning;

// 两个坐标轴采用相同的单位长度。
const scale = Math.min(660/12, 335/8);
const px = x => 95 + (x+1)*scale;
const py = y => 365 - (y+1)*scale;
function drawPlot() {
  pen.clearRect(0,0,760,420);
  pen.font='15px system-ui';
  pen.fillStyle='#405867';
  for (let x=-1;x<=10;x++) {
    pen.fillText(String(x),px(x)-4,390);
    pen.fillStyle='#e1e7e9';pen.fillRect(px(x),py(7),1,py(-1)-py(7));pen.fillStyle='#405867';
  }
  for (let y=-1;y<=7;y++) {
    pen.fillText(String(y),64,py(y)+5);
    pen.fillStyle='#e1e7e9';pen.fillRect(px(-1),py(y),px(10)-px(-1),1);pen.fillStyle='#405867';
  }
  pen.fillText('横坐标 x',px(10)+9,387);pen.fillText('纵坐标 y',22,22);
  samples.forEach(([x,y],i)=>{
    pen.fillStyle=labels ? inks[labels[i]] : '#82939a';
    pen.beginPath();pen.arc(px(x),py(y),3.6,0,2*Math.PI);pen.fill();
  });
  centers.forEach(([x,y],j)=>{
    pen.strokeStyle=inks[j];pen.lineWidth=3;
    if(previous){
      pen.beginPath();pen.moveTo(px(previous[j][0]),py(previous[j][1]));
      pen.lineTo(px(x),py(y));pen.stroke();
    }
    pen.save();pen.translate(px(x),py(y));pen.rotate(Math.PI/4);
    pen.fillStyle='white';pen.fillRect(-9,-9,18,18);pen.strokeRect(-9,-9,18,18);pen.restore();
    pen.fillStyle='#203843';pen.fillText(String(j),px(x)-4,py(y)+5);
    const count=labels ? ' · '+labels.filter(v=>v===j).length+' 个点' : '';
    pen.fillStyle=inks[j];pen.fillText(['蓝组','橙组','绿组'][j]+count,610,100+40*j);
  });
}
function startPlot(){
  centers=initialCenters.map(pair=>pair.slice());labels=null;previous=null;
  round=1;assigning=true;step.disabled=false;step.textContent='给散点分组';
  plotMessage.textContent='300 个灰点还没有分组。点击“给散点分组”，观察三个中心附近的颜色。';drawPlot();
}
step.onclick=()=>{
  try {
    if(assigning){
      const next=findClosestCentroids(samples,centers);
      if(next.length!==samples.length || !Array.from(next).every(j=>Number.isInteger(j)&&j>=0&&j<3))
        throw Error('每个点都需要一个有效的中心编号。请检查分组函数的返回值。');
      const stable=labels && next.every((j,i)=>j===labels[i]);
      labels=next;previous=null;
      plotMessage.textContent='第 '+round+' 轮：每个点已按你的函数返回的组别着色。';
      if(new Set(labels).size===1){
        plotMessage.textContent+=' 所有点都进了同一组。看看另外两个菱形旁边的点：比较距离时，你的代码会更新中心编号吗？请检查 findClosestCentroids。';
        step.disabled=true;
      }else if(stable){
        plotMessage.textContent+=' 每个点都留在上一轮的组里，聚类结束。';step.disabled=true;
      }
      step.textContent='移动三个中心';
    }else{
      const next=computeCentroids(samples,labels,centers);
      if(next.length!==3 || !next.every(p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)))
        throw Error('每个中心都需要两个有限的坐标值。请检查组内坐标和与点数。');
      previous=centers;centers=next;
      plotMessage.textContent='第 '+round+' 轮：菱形移到了算出的新位置。线段连接旧中心与新中心。';
      if(new Set(centers.map(p=>p.join(','))).size===1){
        plotMessage.textContent+=' 三个中心重合了。请检查 computeCentroids 是否分别累加并平均每组坐标。';step.disabled=true;
      }
      round++;step.textContent='再次给散点分组';
    }
    assigning=!assigning;drawPlot();
  }catch(error){plotMessage.textContent=error.message;}
};
restart.onclick=startPlot;
startPlot();
