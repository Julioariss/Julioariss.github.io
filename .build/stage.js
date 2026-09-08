<script>
(function(){
  var root=document.documentElement, canvas=document.getElementById('three');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SHOTS={
    dark:["img/shot-d1.jpg","img/shot-d2.jpg","img/shot-d3.jpg","img/shot-d4.jpg","img/shot-d5.jpg"],
    light:["img/shot-l1.jpg","img/shot-l2.jpg","img/shot-l3.jpg","img/shot-l4.jpg","img/shot-l5.jpg"]
  };
  /* cuerpo del telefono: grafito en oscuro, titanio claro en modo claro */
  var SKIN={dark:{body:0x151920,rim:0x4a5260,key:0xffffff,fill:0x7fa8cc,p1:0x4fd8f0,p2:0xf2a33a,amb:0.5,keyI:1.4,p1I:2,p2I:1.2},
            light:{body:0xE4E1DC,rim:0xFFFFFF,key:0xffffff,fill:0xE9DEDF,p1:0xE60023,p2:0xC05621,amb:1.15,keyI:1.6,p1I:1.1,p2I:.7}};
  if(!window.THREE||(!canvas.getContext('webgl2')&&!canvas.getContext('webgl'))){root.classList.add('no3d');return}
  var renderer,scene,camera,phones=[],rim,amber,ambient,keyL,fillL,W2=1,H2=2.167,D=0.12,mx=0,my=0,loader,mode='';
  function rr(w,h,r){var s=new THREE.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s}
  function phone(){var g=new THREE.Group();
    var body=new THREE.ExtrudeGeometry(rr(W2,H2,0.17),{depth:D,bevelEnabled:true,bevelThickness:.03,bevelSize:.03,bevelSegments:4});body.center();
    var bm=new THREE.MeshStandardMaterial({color:0x151920,metalness:.95,roughness:.3});
    g.add(new THREE.Mesh(body,bm));
    var rimG=new THREE.ExtrudeGeometry(rr(W2+.02,H2+.02,.18),{depth:D*.6,bevelEnabled:true,bevelThickness:.02,bevelSize:.02,bevelSegments:2});rimG.center();
    var rmM=new THREE.MeshStandardMaterial({color:0x4a5260,metalness:1,roughness:.22});
    var rm=new THREE.Mesh(rimG,rmM);rm.position.z=-.01;g.add(rm);
    var sm=new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false});
    var scr=new THREE.Mesh(new THREE.PlaneGeometry(W2-.1,H2-.1),sm);scr.position.z=D/2+.04;g.add(scr);
    var gl=new THREE.Mesh(new THREE.PlaneGeometry(W2-.1,H2-.1),new THREE.MeshPhysicalMaterial({color:0xffffff,transparent:true,opacity:.06,roughness:.05,metalness:0,clearcoat:1}));gl.position.z=D/2+.045;g.add(gl);
    g.userData.bm=bm;g.userData.rmM=rmM;g.userData.sm=sm;
    return g}
  function skin(m){
    if(mode===m)return; mode=m; var s=SKIN[m];
    phones.forEach(function(p,i){
      p.userData.bm.color.setHex(s.body); p.userData.rmM.color.setHex(s.rim);
      var tx=loader.load(SHOTS[m][i]); tx.anisotropy=8; tx.minFilter=THREE.LinearFilter;
      if(p.userData.sm.map)p.userData.sm.map.dispose();
      p.userData.sm.map=tx; p.userData.sm.needsUpdate=true;
    });
    ambient.intensity=s.amb; keyL.intensity=s.keyI; fillL.color.setHex(s.fill);
    rim.color.setHex(s.p1); rim.intensity=s.p1I; amber.color.setHex(s.p2); amber.intensity=s.p2I;
  }
  window.__orbSkin=function(light){ if(phones.length) skin(light?'light':'dark'); };
  function init(){
    renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true});renderer.setPixelRatio(Math.min(2,devicePixelRatio||1));
    scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(30,1,.1,100);camera.position.set(0,0,6.6);
    loader=new THREE.TextureLoader();
    for(var i=0;i<5;i++){var p=phone();scene.add(p);phones.push(p)}
    ambient=new THREE.AmbientLight(0xffffff,.5);scene.add(ambient);
    keyL=new THREE.DirectionalLight(0xffffff,1.4);keyL.position.set(3,4,5);scene.add(keyL);
    fillL=new THREE.DirectionalLight(0x7fa8cc,.6);fillL.position.set(-4,-2,3);scene.add(fillL);
    rim=new THREE.PointLight(0x4fd8f0,2,16);rim.position.set(-2.5,1.5,2.5);scene.add(rim);
    amber=new THREE.PointLight(0xf2a33a,1.2,14);amber.position.set(3,-2,2);scene.add(amber);
    skin(root.getAttribute('data-theme')==='light'?'light':'dark');
    resize();addEventListener('resize',resize);
    addEventListener('pointermove',function(e){mx=(e.clientX/innerWidth-.5)*2;my=(e.clientY/innerHeight-.5)*2},{passive:true});
  }
  function resize(){var r=canvas.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();
    var narrow=r.width<860,tiny=r.width<560;phones.forEach(function(p){p.userData.s=tiny?.5:(narrow?.56:.95);p.userData.ox=narrow?0:1.55;p.userData.oy=narrow?-.92:0})}
  var stage=document.querySelector('.stage'),copy=document.getElementById('heroCopy'),caps=document.querySelectorAll('.actcap .cap'),t0=performance.now(),cur=-1;
  function render(now){
    var t=now-t0,ent=reduce?1:Math.min(1,t/1600);ent=1-Math.pow(1-ent,3);
    var sp=Math.max(0,Math.min(1,-stage.getBoundingClientRect().top/(stage.offsetHeight-innerHeight)));
    var idx=sp*(phones.length-1);
    for(var i=0;i<phones.length;i++){var p=phones[i],dx=i-idx,c=Math.max(0,1-Math.abs(dx));
      var x=p.userData.ox*(1-Math.min(1,idx))+dx*3.4;if(i===0)x+=(-4)*(1-ent);
      p.position.x=x;p.position.y=p.userData.oy+(reduce?0:Math.sin(now/2400+i)*.06);p.position.z=-Math.abs(dx)*.9;
      p.rotation.y=dx*.6+(reduce?0:Math.sin(now/3200+i)*.06*c)+mx*.18*c+(i===0?-1.3*(1-ent):0);
      p.rotation.x=(reduce?0:-my*.1*c);p.rotation.z=dx*-.06;
      p.scale.setScalar(p.userData.s*(.74+.26*c));p.visible=Math.abs(dx)<1.8}
    copy.style.opacity=Math.max(0,1-idx*1.6);copy.style.transform='translateY('+(-idx*40)+'px)';copy.style.pointerEvents=idx>.5?'none':'auto';
    var near=Math.round(idx);if(near!==cur){cur=near;caps.forEach(function(c){c.classList.toggle('on',+c.dataset.i===near)})}
    rim.position.x=Math.cos(now/2200)*3;rim.position.z=2.5+Math.sin(now/2200)*1.2;
    renderer.render(scene,camera);requestAnimationFrame(render)}
  try{init();requestAnimationFrame(render)}catch(e){root.classList.add('no3d')}
})();
</script>
