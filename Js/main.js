// main.js here i have added the client side code for the shopping cart functionality, 
// as well as some utility functions for formatting currency and managing the cart state in localStorage.
(function () {
  const cartKey = "zilk-cart";
  const products = [
    {
      id: "macbook-air-m2",
      name: "Apple MacBook Air M2",
      brand: "Apple",
      type: "Laptop",
      condition: "Brand new",
      price: 1099,
      oldPrice: 1199,
      tag: "New arrival",
      image: "https://images.wsj.net/im-581987?width=1950&height=1463"
    },
    {
      id: "asus-zenbook-ux334",
      name: "ASUS ZenBook UX334",
      brand: "ASUS",
      type: "Laptop",
      condition: "Used - excellent",
      price: 649,
      oldPrice: 799,
      tag: "Used deal",
      image: "https://upload.wikimedia.org/wikipedia/commons/c/ce/ASUS_ZenBook_UX334_20190601.jpg"
    },
    {
      id: "airpods-pro-2",
      name: "Apple AirPods Pro 2nd Gen",
      brand: "Apple",
      type: "Earbuds",
      condition: "Brand new",
      price: 219,
      oldPrice: 249,
      tag: "Popular",
      image: "https://static.vecteezy.com/system/resources/previews/015/192/978/non_2x/kharkiv-ukraine-january-27-2022-apple-airpods-pro-on-a-white-background-wireless-headphones-with-charging-case-and-a-box-apple-inc-is-an-american-technology-company-free-photo.JPG"
    },
    {
      id: "sony-wf-1000xm4",
      name: "Sony WF-1000XM4 Earbuds",
      brand: "Sony",
      type: "Earbuds",
      condition: "Used - good",
      price: 179,
      oldPrice: 229,
      tag: "Sony audio",
      image: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Sony_WF-1000XM4.jpg"
    },
    {
      id: "razer-deathadder",
      name: "Razer DeathAdder Mouse",
      brand: "Razer",
      type: "Mouse",
      condition: "Used - excellent",
      price: 59,
      oldPrice: 79,
      tag: "Gaming gear",
      image: "https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/e32e3a4b2b824892b332068661f8dbf5~tplv-fhlh96nyum-crop-webp:2000:2000.webp?dr=12190&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=e1be8f53&idc=useast5&from=2378011839"
    }
  ];