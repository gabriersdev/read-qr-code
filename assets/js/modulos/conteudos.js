const html_base = ``;

const conteudo_botao = `<i class="bi bi-upload"></i>&nbsp;&nbsp;Carregar Arquivo</button>`;
const spinner = `<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>`;

const erro_carregamento = `  <main class="container" data-conteudo="area-loading-conteudo"><div class="alert alert-loading d-flex align-items-center justify-content-center" role="alert"><div><i class="bi bi-exclamation-triangle-fill icon error"></i>&nbsp;<span>Ocorreu um erro no carregamento do conteúdo da página. <a href="mailto:devgabrielribeiro@gmail.com" class="link-visivel">Entre em contato com o desenvolvedor.</a></span></div></div></main>`;

const conteudo_principal = `<main class="container"><form class="card" enctype="multipart/form-data" rel="noreferrer noopener" action="http://api.qrserver.com/v1/read-qr-code/" method="POST"> <div class="card-header"> <b>Ler QR Code</b> <button type="button" class="btn btn-compartilhar-app"><i class="bi bi-share-fill"></i></button> </div> <div class="card-body"> <div class="input-group trnsp"> <span class="input-group-text trnsp"><i class="bi bi-qr-code"></i></span> <button type="button" onclick="clickUpload(this)" class="btn form-control" data-action="acionar-qr-code-upload"><i class="bi bi-upload"></i>&nbsp;&nbsp;Carregar Arquivo</button><input type="file" name="file" id="file" class="trnsp" id="floating-input-group" data-action="qr-code-upload" placeholder="Seu QR Code" autocomplete="off"><input type="hidden" name="MAX_FILE_SIZE" value="1048576"><button type="reset" class="input-group-text trnsp" data-toggle="tooltip" data-bs-custom-class="custom-tooltip" data-placement="top" title="limpar"><i class="bi-x-lg"></i></button> </div> <button type="submit" class="btn btn-ler-qr-code" data-action="submit">Ler QR Code</button> </div></form></main>`;

const conteudo_modal = `  <div class="modal fade" id="modal-compartilhar-app" aria-hidden="true" aria-labelledby="modal-compartilhar-appLabel" tabindex="-1"><div class="modal-dialog modal-dialog-centered"> <div class="modal-content"> <div class="modal-header"> <h1 class="modal-title fs-5" id="modal-compartilhar-appLabel">Compartilhe</h1> <button data-modal-fecha><i class="bi bi-x-lg"></i></button> </div> <div class="modal-body" data-conteudo="modal-body"> <span class="texto-modal-body"> Compartilhe esta ideia! <br> <span class="texto-reduzido">Copie o link ou favorite esta página com CTRL + D</span> </span> <div class="input-group"> <button class="btn btn-outline-secondary disabled dashed" disabled><i class="bi bi-link"></i></button> <input type="url" class="form-control trnsp" id="link-compartilhamento" readonly value="https://www.xxx.xxx.br"> <button class="btn btn-outline-secondary" type="button" id="copiar-link-compartilhamento">Copiar</button> </div> </div> </div></div></div> `;

const conteudo_modal_resultado = `  <div class="modal fade" id="modal-resultado" aria-hidden="true" aria-labelledby="modal-resultado-appLabel" tabindex="-1"><div class="modal-dialog modal-dialog-centered"> <div class="modal-content"> <div class="modal-header"> <h1 class="modal-title fs-5" id="modal-resultado-appLabel">Resultado</h1> <button data-modal-fecha><i class="bi bi-x-lg"></i></button> </div> <div class="modal-body" data-conteudo="modal-body"> <span class="texto-modal-body"> <div class="form-group"><div class="form-control trnsp" data-conteudo="resultado-txt-qr-code">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perspiciatis libero alias ipsam voluptates, quaerat eius. Quae dignissimos excepturi voluptate? Autem repellendus laboriosam earum quod doloremque nihil, veritatis nemo molestiae dignissimos</div><button type="button" class="btn btn-copiar-resultado" id="copiar-resultado">Copiar</button></div>  </div> </div></div></div>`;

export const conteudos = {
  html_base,
  erro_carregamento,
  spinner,
  conteudo_botao,
  conteudo_principal,
  conteudo_modal,
  conteudo_modal_resultado
};