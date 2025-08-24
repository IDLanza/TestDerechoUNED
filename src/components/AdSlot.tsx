'use client';
import React, { useEffect } from 'react';

export default function AdSlot({ position='inline' }:{position?:'top'|'inline'|'sidebar'}){
  const show = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';
  useEffect(()=>{
    // Aquí iría el script de la red de anuncios cuando lo configures y acepten cookies
  },[]);
  if (!show) return null;
  return (
    <div className="my-4 border rounded p-4 text-center text-slate-500">
      <span>Espacio publicitario ({position})</span>
    </div>
  );
}
