// notificacoes-atualizacao.js
// Popup global: avisa QUALQUER usuario logado, em QUALQUER modulo do GBS,
// assim que alguem faz upload/atualiza uma planilha (grava em uploads_log).
// Inclua em todas as paginas, de preferencia perto do auto-logout.js:
//   <script src="/controles/notificacoes-atualizacao.js"></script>
// Nao depende do "sb" da pagina — cria seu proprio client Supabase.

(function(){
  if(typeof supabase === 'undefined') return;

  var SUPABASE_URL = 'https://ndwivbhqglpnfyqwjbzu.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_IhuNziyT5VYrMKRixcPGjA_LAn5ku-7';

  var NOMES_TIPO = {
    jornada: 'Jornada',
    leituras_acertadas: 'Leituras Acertadas',
    calendario: 'Calendário de Transmissões',
    leituras: 'Leituras (Transmissões)',
    releituras: 'Releituras Pendentes',
    velocidade: 'Velocidade',
    erros: 'Erros de Leitura',
    reclamacoes: 'Reclamações',
    fotos: 'Fotos'
  };

  function nomeAmigavel(tipo){
    return NOMES_TIPO[tipo] || tipo;
  }

  function garantirEstilo(){
    if(document.getElementById('gbs-popup-style')) return;
    var style = document.createElement('style');
    style.id = 'gbs-popup-style';
    style.textContent =
      '#gbs-popup-container{position:fixed;top:16px;right:16px;z-index:999999;display:flex;flex-direction:column;gap:8px;max-width:320px}' +
      '.gbs-popup-item{background:#1f5c2e;color:#fff;padding:12px 16px;border-radius:8px;box-shadow:0 4px 14px rgba(0,0,0,.25);font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.4;opacity:0;transform:translateX(20px);transition:opacity .25s,transform .25s}' +
      '.gbs-popup-item.gbs-show{opacity:1;transform:translateX(0)}' +
      '.gbs-popup-item b{display:block;font-size:13px;margin-bottom:2px}' +
      '.gbs-popup-item span{font-size:11px;color:#cfe8d3}';
    document.head.appendChild(style);
  }

  function mostrarPopup(tipo, por){
    garantirEstilo();
    var container = document.getElementById('gbs-popup-container');
    if(!container){
      container = document.createElement('div');
      container.id = 'gbs-popup-container';
      document.body.appendChild(container);
    }
    var item = document.createElement('div');
    item.className = 'gbs-popup-item';
    item.innerHTML = '<b>🔔 ' + nomeAmigavel(tipo) + ' foi atualizado</b><span>por ' + (por || '—') + '</span>';
    container.appendChild(item);
    requestAnimationFrame(function(){ item.classList.add('gbs-show'); });
    setTimeout(function(){
      item.classList.remove('gbs-show');
      setTimeout(function(){ item.remove(); }, 300);
    }, 8000);
  }

  function iniciar(){
    var client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    client.channel('gbs-uploads-log-popup')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'uploads_log' }, function(payload){
        var row = payload.new;
        if(!row) return;
        mostrarPopup(row.tipo, row.atualizado_por);
      })
      .subscribe();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
