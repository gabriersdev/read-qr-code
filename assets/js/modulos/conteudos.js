const html_base = ``;

const conteudo_botao = `<i class="bi bi-upload"></i>&nbsp;&nbsp;Carregar Arquivo</button>`;
const spinner = `<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>`;

const erro_carregamento = `  <main class="container" data-conteudo="area-loading-conteudo"><div class="alert alert-loading d-flex align-items-center justify-content-center" role="alert"><div><i class="bi bi-exclamation-triangle-fill icon error"></i>&nbsp;<span>Ocorreu um erro no carregamento do conteúdo da página. <a href="mailto:devgabrielribeiro@gmail.com" class="link-visivel">Entre em contato com o desenvolvedor.</a></span></div></div></main>`;

export const conteudos = {html_base, erro_carregamento, spinner, conteudo_botao};