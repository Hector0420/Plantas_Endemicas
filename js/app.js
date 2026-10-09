// ============================================================================ // CONFIGURACIÓN DE CONEXIÓN A SUPABASE // ============================================================================ // IMPORTANTE: Utiliza únicamente la anon key (clave pública para el cliente web)
const SUPABASE_URL = 'https://emrbtwvxbavxubvcsgsx.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtcmJ0d3Z4YmF2eHVidmNzZ3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0OTI1MTcsImV4cCI6MjEwNzA2ODUxN30.R8yEKXwPzFVq8ZLgxUKa3p8z3srMM33iI0QdMYwX2cI';
// Inicializar el cliente Supabase const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// Referencias a los elementos del DOM
const searchInput = document.getElementById('search-input'); 
const searchBtn = document.getElementById('search-btn'); 
const resultsGrid = document.getElementById('results-grid'); 
const loader = document.getElementById('loader'); const statusMessage = document.getElementById('status-message'); 
const btnShowAll = document.getElementById('btn-show-all'); 
const tagButtons = document.querySelectorAll('.tag-btn:not(#btn-show-all)'); // ============================================================================ // FUNCIÓN PRINCIPAL: CONSULTAR EL BACKEND // ============================================================================ async function fetchCatalog(query = '') { showLoader(true); resultsGrid.innerHTML = ''; statusMessage.classList.add('hidden');
try { // Consultamos la vista creada previamente en el backend de Supabase let request = supabaseClient .from('vista_catalogo_consultas') .select('\*');
// Si el usuario ingresó un término, aplicamos el filtro por síntomas, afección o producto if (query.trim() !== '') { const searchTerm = \`%${query.trim()}%\`;
request = request.or( 
`sintomas_asociados.ilike.${searchTerm},nombre_afeccion.ilike.${searchTerm},nombre_producto.ilike.${searchTerm}` 
);
} 
const { data, error } = await request;
if (error) { 
throw error;
} 
renderResults(data);
} catch (err) {
console.error('Error al consultar Supabase:', err); showStatus('Ocurrió un error al conectar con la base de datos. Verifica tu conexión.');
} finally { 
showLoader(false); 
}
 } // ============================================================================ // FUNCIÓN PARA RENDERIZAR LAS TARJETAS EN EL DOM // ============================================================================ function renderResults(products) { if (!products || products.length === 0) { showStatus('No se encontraron productos o prescripciones asociadas a esa búsqueda.'); return;
} products.forEach(item =>; { const card = document.createElement('article'); card.className = 'card'; 
// Estructura de la tarjeta del producto card.innerHTML =`
<div class="card-header">
 	<div class="card-tags"> 
<span class="tag tag-

 tipo">${escapeHtml(item.forma_farmaceutica)}</span>
<span class="tag tag-
via">${escapeHtml(item.via_administracion_gral)}</span> 
</div> 
<h2> class="card-
title"${escapeHtml(item.nombre_producto)}</h2> 
</div> 
<div class="card-body">
<p><strong>Indicado para:</strong>
${escapeHtml(item.nombre_afeccion)}</p> 
<p><strong>Dosis recomendada:</strong>
${escapeHtml(item.dosis_sugerida)}</p> 
<p><strong>Frecuencia:</strong> 
${escapeHtml(item.frecuencia_aplicacion)}</p>
<div class="alert-contraindicacion">
 <div> <strong>⚠️ Precaución:</strong>
 ${escapeHtml(item.contraindicaciones)}
  </div>
   </div> 
  ; 
resultsGrid.appendChild(card);
 });
 }
// ============================================================================ // UTILIDADES Y EVENTOS DE INTERACCIÓN // ============================================================================ function showLoader(isLoading) { 
loader.classList.toggle('hidden', !isLoading);
 } 
function showStatus(message) {
statusMessage.textContent = message;
statusMessage.classList.remove('hidden'); 
}

 // Evita inyecciones de código malicioso en los textos 
    Renderizados
    function escapeHtml(text) {
    if (!text) return '';
  return text 
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;'")
      .replace(/'/g, "&#039; ");

} 
    // Escuchadores de eventos 
      searchBtn.addEventListener('click', () => {
      fetchCatalog(searchInput.value);
});
    searchInput.addEventListener('keypress', (e) =>; {
    if (e.key === 'Enter') { 
    fetchCatalog(searchInput.value);
 } });
  btnShowAll.addEventListener('click', () =>; {
      searchInput.value = '';
      fetchCatalog('');
});
  tagButtons.forEach(btn =>; {
  btn.addEventListener('click', () => {
      const query = btn.getAttribute('data-query');
      searchInput.value = query;
      fetchCatalog(query);
    });
}); 
    // Carga inicial automática de todos los registros al abrir la página
      document.addEventListener('DOMContentLoaded', () => {
          fetchCatalog('');
 });
