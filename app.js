const KEY="unboxlove_products";const defaults=[
{name:"Love Resin Keychain",price:299,cat:"Keychains",desc:"A cute personalised resin keychain.",image:""},
{name:"Mini Gift Hamper",price:799,cat:"Gift Hampers",desc:"A sweet little hamper for someone special.",image:""},
{name:"Resin Name Art",price:699,cat:"Resin Art",desc:"Handmade resin art with a personalised touch.",image:""},
{name:"Ribbon Love Bouquet",price:599,cat:"Ribbon Bouquets",desc:"A forever bouquet made with beautiful ribbons.",image:""}
];
function getProducts(){let p=JSON.parse(localStorage.getItem(KEY));if(!p){p=defaults;localStorage.setItem(KEY,JSON.stringify(p))}return p}
function money(n){return "₹"+Number(n).toLocaleString("en-IN")}
function render(cat="All"){let p=getProducts().filter(x=>cat==="All"||x.cat===cat);let g=document.querySelector("#productGrid");g.innerHTML=p.length?p.map(x=>`<article class="card"><div class="pic" ${x.image?`style="background-image:url('${x.image.replaceAll("'","%27")}')"`:""}>${x.image?"":"🎁"}</div><div class="card-body"><small>${x.cat}</small><h3>${x.name}</h3><p class="desc">${x.desc||""}</p><div class="price">${money(x.price)}</div></div></article>`).join(""):`<div class="empty">No products in this category yet.</div>`}
function filters(){let cats=["All",...new Set(getProducts().map(x=>x.cat))];document.querySelector("#filters").innerHTML=cats.map(c=>`<button class="${c==="All"?"active":""}" onclick="setCat('${c.replaceAll("'","\\'")}',this)">${c}</button>`).join("")}
function setCat(c,b){document.querySelectorAll(".filters button").forEach(x=>x.classList.remove("active"));b.classList.add("active");render(c)}
function init(){filters();render()}init();