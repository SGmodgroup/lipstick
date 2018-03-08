var zr=null,bgDpi=.2,zrDpi=1,width=0,height=0,lipstickData=null;function init(){width=window.innerWidth*bgDpi,height=window.innerHeight*bgDpi;var t=document.getElementById("bg");t.setAttribute("width",width),t.setAttribute("height",height);var e=document.getElementById("zr");e.setAttribute("width",window.innerWidth*zrDpi),e.setAttribute("height",window.innerHeight*zrDpi),zr=zrender.init(e),$.getJSON("dist/lipstick.json",function(e){updateLipstickData(e);var i=getMinMax(lipstickData);renderBackground(t,i),renderDataPoints(lipstickData,i),hover({target:lipstickData[0].group.childAt(0)}),updateUi(lipstickData[0]),document.getElementById("ui").setAttribute("style","display:block")})}function updateLipstickData(t){lipstickData=[];for(var e=0,i=t.brands.length;e<i;++e)for(var a=t.brands[e],r=0,n=a.series.length;r<n;++r){var o=a.series[r].lipsticks;lipstickData=lipstickData.concat(o);for(var l=0,s=o.length;l<s;++l)o[l].series=a.series[r],o[l].brand=a}}function getMinMax(t){for(var e=Number.MAX_VALUE,i=Number.MIN_VALUE,a=Number.MAX_VALUE,r=Number.MIN_VALUE,n=0;n<t.length;++n){var o=tinycolor(t[n].color).toHsl();o.l*=100,t[n]._hsl=o;var l=encodeHue(o.h);if(!(l<165||l>220)){l>i&&(i=l),l<e&&(e=l);var s=o.l;s>r&&(r=s),s<a&&(a=s)}}return{minHue:e-2,maxHue:i+2,minLight:Math.max(a-10,0),maxLight:Math.min(r+5,100)}}function renderBackground(t,e){for(var i=t.getContext("2d"),a=i.createImageData(width,height),r=a.data,n=0;n<height;++n)for(var o=0;o<width;++o){var l=(height-n)/height*(e.maxLight-e.minLight)+e.minLight,s=o/width*(e.maxHue-e.minHue)+e.minHue,d=tinycolor({h:encodeHue(s),s:80,l:l}).toRgb(),p=4*(n*width+o);r[p]=d.r,r[p+1]=d.g,r[p+2]=d.b,r[p+3]=255}i.putImageData(a,0,0)}function renderDataPoints(t,e){for(var i=0;i<t.length;++i){var a=getDataCoord(t[i],e),r=[a.x*zrDpi,a.y*zrDpi],n=new zrender.Circle({shape:{cx:0,cy:0,r:5},style:{fill:t[i].color,stroke:"rgba(255, 255, 255, 0.8)",lineWidth:1},position:r,z:1}),o=new zrender.Text({style:{text:t[i].name,textAlign:"center",textVerticalAlign:"middle",fontSize:12,textFill:"rgba(255, 255, 255, 0.5)"},position:[r[0],r[1]+16]}),l=new zrender.Group;l.add(n),l.add(o),zr.add(l),l.lipstick=t[i],l.lipstick.group=l}zr.on("mousemove",hover),zr.on("click",function(){lastEmphasisGroup||(normal(notNormalGroups),notNormalGroups=[])})}var lastEmphasisGroup=null,notNormalGroups=[];function hover(t){if(t.target&&t.target.parent===lastEmphasisGroup||!notNormalGroups.length||(normal(notNormalGroups),notNormalGroups=[]),t.target){if(lastEmphasisGroup!==t.target.parent){var e=t.target.parent;emphasis(e),notNormalGroups=[e];for(var i=e.lipstick,a=i.series.lipsticks,r=0;r<lipstickData.length;++r){var n=lipstickData[r];n!==i&&(a.indexOf(n)>-1?(relate(n.group),notNormalGroups.push(n.group)):downplay(n.group))}lastEmphasisGroup=t.target.parent}}else if(lastEmphasisGroup){for(r=0;r<lipstickData.length;++r)undownplay(lipstickData[r].group);lastEmphasisGroup=null}}function emphasis(t){undownplay(t);var e=t.childAt(0);e.attr("z",11),e.stopAnimation(!0),e.animateTo({shape:{r:30},style:{lineWidth:3,stroke:"#fff",shadowBlur:20,shadowColor:"rgba(0, 0, 0, 0.4)"}},200,0,"bounceOut");var i=t.childAt(1);i.attr("z",10),i.attr("style",{text:"#"+t.lipstick.id+" "+t.lipstick.name,textPadding:[62,0,0,0]}),i.stopAnimation(!0),i.animateTo({style:{textFill:t.lipstick.color,fontSize:16,textStrokeWidth:3,textStroke:"#fff"}},200,0,"bounceOut"),updateUi(t.lipstick)}function relate(t){undownplay(t);var e=t.childAt(0);e.stopAnimation(!0),e.attr("style",{lineWidth:2}),e.attr("z",9),e.attr("shape",{r:10}),e.animateTo({style:{shadowBlur:8,shadowColor:"rgba(0, 0, 0, 0.2)"}},200,0,"bounceOut");var i=t.childAt(1);i.attr("style",{text:"#"+t.lipstick.id+" "+t.lipstick.name,textPadding:[12,0,0,0]}),i.attr("z",8),i.stopAnimation(!0),i.animateTo({style:{textFill:t.lipstick.color,textStrokeWidth:2,textStroke:"rgba(255, 255, 255, 0.75)"}},200,0,"bounceOut")}function normal(t){for(var e=0;e<t.length;++e){var i=t[e].childAt(0);i.attr("z",1),i.stopAnimation(!0),i.animateTo({shape:{r:5},style:{stroke:"rgba(255, 255, 255, 0.8)",lineWidth:1,shadowBlur:0}},200,0,"linear");var a=t[e].childAt(1);a.stopAnimation(!0),a.attr("style",{text:t[e].lipstick.name,textPadding:0}),a.attr("z",0),a.animateTo({style:{fontSize:12,textStrokeWidth:0,textShadowBlur:0,textFill:"rgba(255, 255, 255, 0.5)"}},200,0,"linear")}}function downplay(t){var e=t.childAt(0);e.stopAnimation(!0),e.animateTo({style:{opacity:.6}},200,0,"linear");var i=t.childAt(1);i.stopAnimation(!0),i.animateTo({style:{opacity:0}},200,0,"linear")}function undownplay(t){var e=t.childAt(0);e.stopAnimation(!0),e.animateTo({style:{opacity:1}},200,0,"linear");var i=t.childAt(1);i.stopAnimation(!0),i.animateTo({style:{opacity:1}},200,0,"linear")}function getDataCoord(t,e){var i=encodeHue(t._hsl.h),a=t._hsl.l;return{x:(i-e.minHue)*width/(e.maxHue-e.minHue)/bgDpi,y:height/bgDpi-(a-e.minLight)*height/(e.maxLight-e.minLight)/bgDpi}}function encodeHue(t){return t<180?180-t:540-t}function updateUi(t){document.getElementById("brand-name").innerText=t.brand.name,document.getElementById("series-name").innerText=t.series.name,document.getElementById("lipstick-id").innerText=t.id,document.getElementById("lipstick-name").innerText=t.name,document.getElementById("lipstick-info").setAttribute("style","color:"+t.color);var e=document.getElementById("series-colors");e.innerText="";for(var i=t.series.lipsticks,a=0;a<i.length;++a){var r=document.createElement("div");r.setAttribute("style","background-color:"+i[a].color);var n=i[a]===t?"series-color active":"series-color";r.setAttribute("class",n),e.appendChild(r)}}