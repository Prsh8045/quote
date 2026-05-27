"use client";

import { useState } from "react";

export default function ProductForm() {

 const [name,setName] =
 useState("");

 const createProduct =
 async () => {

  await fetch("/api/products",{
   method:"POST",

   body:JSON.stringify({
    name
   })
  });

 };

 return (
  <>
   <input
    value={name}
    onChange={(e)=>
     setName(e.target.value)
    }
   />

   <button
    onClick={createProduct}
   >
    Save
   </button>
  </>
 );
}