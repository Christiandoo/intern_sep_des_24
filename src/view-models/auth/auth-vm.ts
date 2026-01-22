// 'use client'

// import  { useEffect, useState } from "react";
// import { getPokemon } from "@/models/auth/auth-model";

//  const AuthVm = () => {
//     const [idPokemon, setIdPokemon] = useState(1);
//     const [gambar, setGambar] = useState("");
  
//     const handlePokemon = async () => {
//       const newId = idPokemon;
//       const pokemon = await getPokemon(newId);
//       setGambar(pokemon.sprites.other["official-artwork"].front_default);
//     };
//     useEffect(() => {
//       handlePokemon();
//     }, [idPokemon]);
    
//     return{
//         setIdPokemon, gambar, idPokemon, handlePokemon
//     }
// }
// export default AuthVm;