const $formSignIn = document.querySelector("#form-log");
const $formSignUp = document.querySelector("#form-sign-up");
const $formForgotPass = document.querySelector("#form-forgot-passsword");
const $writeComment = document.querySelector("#write-comment");
const $formAlert = document.getElementById("alert-accept");

let dataComments = JSON.parse(localStorage.getItem("comments")) || [];
dataComments = dataComments.map(
  (elem) => (elem = { ...elem, expanded_thread: false })
);

const sendReply = debounce((e) => {
  catchDataComment(e);
}, 500);

$writeComment.addEventListener("submit", (e) => {
  e.preventDefault();
  sendReply(e);
});

$formSignIn.addEventListener("submit", getUserSignIn);

$formSignUp.addEventListener("submit", getUserSignUp);
$formForgotPass.addEventListener("submit", getUserForgot);

$formSignUp.addEventListener("click", ({ target }) => {
  if (target.getAttribute("aria-label") === "Selected all") {
    $formSignUp.querySelectorAll('input[type="checkbox"]').forEach((elem) => {
      valuesSignUp = {
        ...valuesSignUp,
        [elem.name]: (elem.checked = true),
      };
    });
  }
});

let acceptAlert = false;
let valuesSignIn = {};
let valuesSignUp = {};
let valuesForgotPass = {};

function handleInputsSignUp() {
  document.querySelectorAll(".form-sign-up input").forEach((elem) =>
    elem.addEventListener("change", ({ target }) => {
      if (
        target.type === "email" &&
        !target.value.trim().match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)
      ) {
        target.style = `box-shadow: 0 0 0 2px  rgba(255, 51, 51, .4)`;
        return;
      }
      if (target.type !== "checkbox" && target.value.trim().length > 2) {
        target.style = `box-shadow: 0 0 0 2px rgba(51, 255, 128, .4)`;
        valuesSignUp = {
          ...valuesSignUp,
          [target.name]: target.value.trim(),
        };
      } else if (target.type === "checkbox") {
        valuesSignUp = {
          ...valuesSignUp,
          [target.name]: target.checked,
        };
      } else {
        target.style = `box-shadow: 0 0 0 2px  rgba(255, 51, 51, .4)`;
      }
    })
  );
}
handleInputsSignUp();

function handleInputsSignIn() {
  document.querySelectorAll("#form-log input").forEach((elem) =>
    elem.addEventListener(
      "input",
      ({ target }) =>
        (valuesSignIn = {
          ...valuesSignIn,
          [target.name]: target.value.trim(),
        })
    )
  );
}
handleInputsSignIn();

function handleInputsForgot() {
  document.querySelector("#form-forgot-passsword input").addEventListener(
    "input",
    ({ target }) =>
      (valuesForgotPass = {
        ...valuesForgotPass,
        [target.name]: target.value.trim(),
      })
  );
}handleInputsForgot()
function getUserForgot(e) {
  e.preventDefault();
  e.submitter.querySelector("svg").classList.toggle("d-none");
  setTimeout(() => {
    e.submitter.querySelector("svg").classList.toggle("d-none");
    e.submitter.querySelector(".icon-tabler").classList.toggle("d-none");
    e.submitter.querySelector('span').textContent = "Enviado"
      console.log(valuesForgotPass)
      e.target.reset(); 
 
  }, 1000);
}

function checkLog() {
  if (localStorage.getItem("log")) {
    [...document.querySelectorAll("[data-log]")].forEach((elem) => {
      elem.setAttribute("hidden", true);
    });
  } else {
    [...document.querySelectorAll("[data-log]")].forEach((elem) => {
      elem.removeAttribute("hidden");
    });
  }
}
// checkLog();

function getUserSignIn(e) {
  e.preventDefault();
  const rootMsg = document.querySelector(".btn-socials");
  const { email, password } = JSON.parse(localStorage.getItem("log")) || {
    email: null,
    password: null,
  };
  const { email: inputEmail, password: inputPassword } = valuesSignIn;

  if (email === inputEmail && password === inputPassword) {
    e.target.querySelector(".animate-spin").classList.toggle("d-none");
    setTimeout(() => {
      checkLog();
      e.target.querySelector(".animate-spin").classList.toggle("d-none");
      e.target.reset();
    }, 1000);
  } else if (email === inputEmail && password !== inputPassword) {
    msgUser(
      `Contraseña incorrecta. Vuelve a intentarlo o selecciona "¿Has olvidado tu contraseña?" para cambiarla.`,
      rootMsg
    );
  } else {
    msgUser(`No se ha podido encontrar tu cuenta.`, rootMsg);
  }
}
function msgUser(msg, rootMsg) {
  if (document.querySelector(".msg-user"))
    document.querySelector(".msg-user").remove();

  const div = document.createElement("div");
  div.className = "msg-user";
  div.style = `
    color: red;
    font-size: .9rem;
    font-weight: 400;
    margin: .5rem 0;
  `;
  div.textContent = msg;
  rootMsg.appendChild(div);
}

function getUserSignUp(e) {
  e.preventDefault();
  e.target
    .querySelectorAll("input")
    .forEach((elem) => elem.removeAttribute("style"));
  localStorage.setItem("log", JSON.stringify(valuesSignUp));
  e.submitter.querySelector("svg").classList.remove("d-none");
  setTimeout(() => {
    e.submitter.querySelector("svg").classList.add("d-none");
    e.target.reset();
    checkLog();
  }, 1000);
}

function acceptNorms() {
  const $btnAcceptNorms = [...document.querySelectorAll("[data-accept-norms]")];
  const inputAccept = document.getElementById("norms");
  inputAccept.addEventListener("change", (e) => {
    if (e.target.checked)
      e.target.parentElement.setAttribute("aria-selected", "true");
    else e.target.parentElement.setAttribute("aria-selected", "false");
  });
  $btnAcceptNorms.forEach((btnAccept) => {
    btnAccept.addEventListener("click", () => {
      inputAccept.checked = true;
      inputAccept.parentElement.setAttribute("aria-selected", "true");
    });
  });
}
acceptNorms();

function dialog(selector, openSelector) {
  const element = document.querySelector(selector);
  let openers = [...document.querySelectorAll(openSelector)];
  openers.forEach((opener) =>
    opener.addEventListener("click", () => showDialog(element))
  );
  let closers = [...element.querySelectorAll("[data-dialog-hide]")];
  closers.forEach((closer) =>
    closer.addEventListener("click", (e) => hiddenDialog(e, element))
  );
  let options = [...element.querySelectorAll("[data-option]")];
  options.forEach((option) => {
    optionState(element);
    option.addEventListener("click", (e) => optionSelected(e, element));
  });

  element.addEventListener("keydown", (e) => handleKeyDown(e, element));
}
dialog("#community-norms", "[data-community-norms-open]");
dialog("#sign-up", "[data-sign-up-open]");
dialog("#forgot-passsword", "[data-forgot-pass-open]");

function handleKeyDown(e, element) {
  if (e.key === "Escape")
    element.querySelector("[data-dialog-hide]").setAttribute("hidden", true);
}

function showDialog(element) {
  element.querySelector("[data-dialog-hide]").removeAttribute("hidden");
  if (element.querySelector("input")) element.querySelector("input").focus();
}

function hiddenDialog(e, element) {
  if (e.target.getAttribute("data-dialog-hide") === "") {
    element.querySelector("[data-dialog-hide]").setAttribute("hidden", true);
  }
}

/* comentarios */

function init() {
  localStorage.setItem("comments", JSON.stringify(dataComments));

  const listCommentsRoot = document.getElementById("list-comments");
  listCommentsRoot.innerHTML = "";
  dataComments.forEach((elem) => {
    const li = cardItemComment(elem);
    listCommentsRoot.appendChild(li);
    if (elem.thread.length > 0) {
      const ulThread = document.createElement("ul");
      const btnCount = document.createElement("button");
      btnCount.addEventListener("click", hiddenAnswers);
      btnCount.title = "Mostrar respuestas";
      btnCount.setAttribute("role", "button");
      btnCount.setAttribute("aria-selected", elem.expanded_thread);
      btnCount.className =
        "badge font-semibold btn d-flex text-muted align-items-center  px-2 btn-reply outline-light rounded-xs ml-3 mt-2 mb-4";
      btnCount.innerHTML = `
      <span>-</span>
      <span id="count-answers" class="d-inline-block ml-2"></span>
      `;
      ulThread.className = "thread border-left pl-4 mt-2 mb-5";
      elem.thread.forEach((comment_thread) => {
        ulThread.appendChild(cardItemComment(comment_thread));
      });
      li.appendChild(btnCount);
      li.appendChild(ulThread);
      countAnswers(btnCount);
    }
  });
  headlineCountComments();
  dialog("#log-comments", "[data-dialog-open]");
}
init();

function cardItemComment(elem) {
  const liReply = document.createElement("li");
  liReply.className = "cards-comments__item ";
  liReply.setAttribute("aria-label", "Respuesta de comentario");
  elem.parent_id && liReply.setAttribute("data-thread-id", elem.parent_id);
  liReply.dataset.id = elem.id;
  liReply.innerHTML = `
    <div class="cards-comments__header d-flex align-items-center my-2 position-relative">
      <img src="${
        elem.image ??
        "//www.eleconomista.es/cmm/avatar/cmm/avatar/sinavatar_0_m.png"
      }" alt="Imagen Usuario" height="40" width="40" class="mr-2" pinger-seen="true">
      <div class="d-flex flex-column">
        <h6 class="h6 m-0 username" aria-label="Nombre de Usuario" id="@${
          elem.nameUser
        }">
        ${elem.nameUser}
        </h6>
        <strong class="date">
          <small>
            <time datetime="${elem.created_at}">${timeSince(
    new Date(elem.created_at)
  )}</time>
          </small>
        </strong>
      </div>
    </div> 
    <div class="cards-comments__comment-content">
      <div class="cards-comments__comment-text">
      ${
        elem.mention
          ? `<a class="font-weight-bold text-gray " href="#${elem.mention}">${elem.mention}</a>`
          : ""
      } 
        ${elem.data}
      </div>
      <div class="cards-comments__options d-flex">
        <div class="button__like d-flex mr-4">
          <button data-dialog-open
          class="${
            elem.info.voted_liked
              ? "btn btn-like d-flex align-items-center justify-content-center outline-light p-0 my-auto liked"
              : "btn btn-like d-flex align-items-center justify-content-center outline-light p-0 my-auto"
          }" aria-label="Me gusta" >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events: none;">
              <path d="M7 11V19C7 19.2652 6.89464 19.5196 6.70711 19.7071C6.51957 19.8946 6.26522 20 6 20H4C3.73478 20 3.48043 19.8946 3.29289 19.7071C3.10536 19.5196 3 19.2652 3 19V12C3 11.7348 3.10536 11.4804 3.29289 11.2929C3.48043 11.1054 3.73478 11 4 11H7ZM7 11C8.06087 11 9.07828 10.5786 9.82843 9.82843C10.5786 9.07828 11 8.06087 11 7V6C11 5.46957 11.2107 4.96086 11.5858 4.58579C11.9609 4.21071 12.4696 4 13 4C13.5304 4 14.0391 4.21071 14.4142 4.58579C14.7893 4.96086 15 5.46957 15 6V11H18C18.5304 11 19.0391 11.2107 19.4142 11.5858C19.7893 11.9609 20 12.4696 20 13L19 18C18.8562 18.6135 18.5834 19.1402 18.2227 19.501C17.8619 19.8617 17.4328 20.0368 17 20H10C9.20435 20 8.44129 19.6839 7.87868 19.1213C7.31607 18.5587 7 17.7956 7 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
          <span class="total-like d-inline-flex justify-content-center align-items-center justify-content-center ml-1">${
            elem.like
          }</span>
        </div>
        <div class="button__like d-flex">
          <button data-dialog-open class="btn btn-like d-flex align-items-center justify-content-center   p-0 my-auto outline-light ${
            elem.dislike > 0 && "liked"
          }" aria-label="No me gusta">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events: none;">
              <path d="M7 12.9999V4.99993C7 4.73472 6.89464 4.48036 6.70711 4.29283C6.51957 4.10529 6.26522 3.99993 6 3.99993H4C3.73478 3.99993 3.48043 4.10529 3.29289 4.29283C3.10536 4.48036 3 4.73472 3 4.99993V11.9999C3 12.2651 3.10536 12.5195 3.29289 12.707C3.48043 12.8946 3.73478 12.9999 4 12.9999H7ZM7 12.9999C8.06087 12.9999 9.07828 13.4214 9.82843 14.1715C10.5786 14.9217 11 15.9391 11 16.9999V17.9999C11 18.5304 11.2107 19.0391 11.5858 19.4141C11.9609 19.7892 12.4696 19.9999 13 19.9999C13.5304 19.9999 14.0391 19.7892 14.4142 19.4141C14.7893 19.0391 15 18.5304 15 17.9999V12.9999H18C18.5304 12.9999 19.0391 12.7892 19.4142 12.4141C19.7893 12.0391 20 11.5304 20 10.9999L19 5.99993C18.8562 5.38646 18.5834 4.85969 18.2227 4.49897C17.8619 4.13825 17.4328 3.96311 17 3.99993H10C9.20435 3.99993 8.44129 4.316 7.87868 4.87861C7.31607 5.44122 7 6.20428 7 6.99993" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
          <span class="total-dislike d-inline-flex justify-content-center align-items-center ml-1">${
            elem.dislike
          }</span>
        </div>
        <button data-dialog-open class="btn px-2 ml-auto btn-reply outline-light rounded-xs" aria-label="Responder">
          <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 20 20" fill="currentColor" style="pointer-events: none;">
            <path fill-rule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <span class="btn-reply__span ml-1">

            Responder
          </span>
        </button>
      </div>
    </div> 
`;
  return liReply;
}

function catchDataComment(e) {
  const root = e.target;
  const id = Date.now();
  acceptAlert = true;
  const user = JSON.parse(localStorage.getItem("log"));

  if (!user) {
    checkLog();
    dialog("#log-comments", "[data-dialog-open]");
    return;
  }
  let date = new Date();
  if (!root.matches(".mainComments_Form")) {
    const idThread =
      JSON.parse(
        root.parentElement.parentElement.getAttribute("data-thread-id")
      ) || JSON.parse(root.parentElement.parentElement.getAttribute("data-id"));
    dataComments.forEach((comment) => {
      if (comment.id === idThread) {
        comment.thread = [
          ...comment.thread,
          {
            parent_id: idThread,
            id: id,
            image: null,
            log: null,
            nameUser: user.alias,
            created_at: date,
            data: root.querySelector("textarea").value.trim(),
            info: { voted_liked: false, voted_disliked: false },
            like: 0,
            dislike: 0,
          },
        ];
      }
    });

    // e.target.remove();
  } else {
    dataComments = [
      ...dataComments,
      {
        id: id,
        image: null,
        log: null,
        nameUser: user.alias || dialog("#sign-up", "[data-sign-up-open]"),
        created_at: date,
        data: root.querySelector("textarea").value.trim(),
        info: { voted_liked: false, voted_disliked: false },
        like: 0,
        dislike: 0,
        thread: [],
        expanded_thread: false,
      },
    ];
    e.target.reset();
  }

  e.target
    .querySelector('button[type="submit"] svg')
    .classList.remove("d-none");
  setTimeout(() => {
    e.target.querySelector('button[type="submit"] svg').classList.add("d-none");
    init();
  }, 1000);
}

function handleEventsComments(selector) {
  const element = document.querySelector(selector);
  element.addEventListener("click", (e) => {
    const clicked = e.target;
    if (localStorage.getItem("log")) {
      switch (clicked.getAttribute("aria-label")) {
        case "Me gusta":
          likeComment(clicked);
          break;
        case "No me gusta":
          dislikeComment(clicked);
          break;
        case "Responder":
          createReply(clicked);
          break;
        case "Cancelar comentario":
          cancelReply(clicked);
          break;
        default:
          break;
      }
    }
  });
}
handleEventsComments("#comments");

function likeComment(root) {
  const idComment = JSON.parse(
    root.parentNode.parentNode.parentNode.parentNode.getAttribute("data-id")
  );
  let is_tread =
    root.parentNode.parentNode.parentNode.parentNode.parentNode.matches(
      ".thread"
    );

  dataComments = dataComments.map((comment) => {
    if (is_tread) {
      comment.thread = comment.thread.map((elem) => {
        if (elem.id === idComment) {
          elem = {
            ...elem,
            like: !elem.info.voted_liked ? elem.like + 1 : elem.like - 1,
            info: {
              voted_liked: !elem.info.voted_liked,
              voted_disliked: false,
            },
            dislike: elem.dislike > 0 ? elem.dislike - 1 : 0,
          };
        }
        return elem;
      });
    } else if (idComment === comment.id) {
      comment = {
        ...comment,
        like: !comment.info.voted_liked ? comment.like + 1 : comment.like - 1,
        info: {
          voted_liked: !comment.info.voted_liked,
          voted_disliked: false,
        },
        dislike: comment.dislike > 0 ? comment.dislike - 1 : 0,
      };
    }
    return comment;
  });
  init();
}

function dislikeComment(root) {
  const idComment = JSON.parse(
    root.parentNode.parentNode.parentNode.parentNode.getAttribute("data-id")
  );
  let is_tread =
    root.parentNode.parentNode.parentNode.parentNode.parentNode.matches(
      ".thread"
    );

  dataComments = dataComments.map((comment) => {
    if (is_tread) {
      comment.thread = comment.thread.map((elem) => {
        if (elem.id === idComment) {
          elem = {
            ...elem,
            dislike: !elem.info.voted_disliked
              ? elem.dislike + 1
              : elem.dislike - 1,
            info: {
              voted_disliked: !elem.info.voted_disliked,
              voted_liked: false,
            },
            like: elem.dislike > 0 ? elem.dislike - 1 : 0,
          };
        }
        return elem;
      });
    } else if (idComment === comment.id) {
      comment = {
        ...comment,
        dislike: !comment.info.voted_disliked
          ? comment.dislike + 1
          : comment.dislike - 1,
        info: {
          voted_disliked: !comment.info.voted_disliked,
          voted_liked: false,
        },
        like: comment.dislike > 0 ? comment.dislike - 1 : 0,
      };
    }
    return comment;
  });

  init();
}
function createReply(btn) {
  // const replyAt = btn.parentElement.parentElement.parentElement
  //   .querySelector(".username")
  //   .textContent.trim();

  const root = btn.parentElement.parentElement;
  const form = document.createElement("form");
  form.classList.add("mt-2");
  form.dataset.reply = true;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    sendReply(e);
  });

  const textArea = document.createElement("textarea");
  // textArea.value = `@${replyAt} `;
  textArea.placeholder = "¡Escribe un comentario!";
  textArea.name = "comment-area";
  textArea.setAttribute("data-dialog-open", "");
  textArea.className = "w-100 py-3 px-3 rounded-xs";
  textArea.dataset.ariaLabel = "Area de comentarios";
  textArea.id = "comment-area-replay";
  textArea.cols = 30;
  textArea.rows = 3;
  textArea.onfocus = () => dialog("#log-comments", "[data-dialog-open]");
  form.appendChild(textArea);

  const divWrapperBtns = document.createElement("div");
  if (!acceptAlert) {
    divWrapperBtns.innerHTML = `
    <div>
    <label class="label-input mt-2 d-block w-100 px-0 mx-auto " for="alert-ter-cond" aria-label="Aceptar terminos y condiciones">
    <input required type="checkbox" name="alert-ter-cond" id="alert-ter-cond" class="focus-eE rounded-xs">
    <span> Acepto la&nbsp;<a href="https://www.eleconomista.es/politica-de-privacidad/index-2018-05-25.php"
    target="_blank" class="text-economista btn outline-light p-0 focus-eE rounded-xs border-tansparent"> política de privacidad</a>
    </span>
    </label>
    <label class="label-input mt-2 d-block w-100 px-0 mx-auto d-flex align-items-center" for="alert-norms"
    aria-label="Aceptar terminos y condiciones" aria-selected="false">
    <input required type="checkbox" name="alert-norms" id="alert-norms" class="focus-eE rounded-xs ">&nbsp;
    <span class="pointer-events-none">Normas de la </span>&nbsp;
    <button id="btn-comunidad" type="button"
    class=" border-tansparent bg-transparent text-economista btn outline-light p-0 focus-eE rounded-xs"
    data-community-norms-open="">comunidad</button>
    </label>
      
    </div>
    <div classs="btns-acept">
    
    <button type="submit" class="w-100  btn bg-economista btn-ee-leermas m-0 rounded-xs" aria-label="Enviar comentario" data-alert-open>
    <svg class="animate-spin d-none mr-2" xmlns="http://www.w3.org/2000/svg" height="18" width="18" fill="none"
    viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="black" stroke-width="4"></circle>
    <path class="opacity-75" fill="white"
    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
    </path>
    </svg>
    Enviar</button>
    <button type="button" class="w-100  mt-2 btn mr-2 rounded-xs" aria-label="Cancelar comentario">Cancelar</button>
    </div>
    
    `;
  } else {
    divWrapperBtns.className = "d-flex justify-content-end";
    divWrapperBtns.innerHTML = `
    <div>
    <button type="submit" class=" btn bg-economista btn-ee-leermas m-0 rounded-xs" aria-label="Enviar comentario" data-alert-open>
    <svg class="animate-spin d-none mr-2" xmlns="http://www.w3.org/2000/svg" height="18" width="18" fill="none"
    viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="black" stroke-width="4"></circle>
    <path class="opacity-75" fill="white"
    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
    </path>
    </svg>
    Enviar</button>
    <button type="button" class="btn ml-2 rounded-xs" aria-label="Cancelar comentario">Cancelar</button>
    </div>
    `;
  }

  form.appendChild(divWrapperBtns);
  if (!root.querySelector("form")) {
    root.appendChild(form);
    document.getElementById("comment-area-replay").focus();
  }
}
function cancelReply(btn) {
  btn.parentElement.parentElement.parentElement.remove();
}
function hiddenAnswers({ target }) {
  const idThread = JSON.parse(target.parentElement.getAttribute("data-id"));
  dataComments = dataComments.map((comment) => {
    if (comment.id === idThread) {
      comment.expanded_thread = !comment.expanded_thread;
    }
    return comment;
  });
  target.setAttribute(
    "aria-selected",
    !JSON.parse(target.getAttribute("aria-selected"))
  );
  countAnswers(target);
  init();
}
function countAnswers(element) {
  let { length: answers } = element.nextElementSibling.childNodes;
  if (JSON.parse(element.getAttribute("aria-selected"))) {
    answers === 1
      ? (answers = `Ocultar respuesta`)
      : (answers = `Ocultar respuestas`);
    element.querySelector("#count-answers").textContent = answers;
  } else {
    answers <= 1
      ? (answers = `Ver ${answers} respuesta`)
      : (answers = `Ver ${answers} respuestas`);
    element.querySelector("#count-answers").textContent = answers;
  }
}

function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return `${
      Math.floor(interval) > 1
        ? `Hace ${Math.floor(interval)} años`
        : `Hace ${Math.floor(interval)} año`
    }`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return `${
      Math.floor(interval) > 1
        ? `Hace ${Math.floor(interval)} meses`
        : `Hace ${Math.floor(interval)} mes`
    }`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return `${
      Math.floor(interval) > 1
        ? `Hace ${Math.floor(interval)} días`
        : `Hace ${Math.floor(interval)} día`
    }`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return `${
      Math.floor(interval) > 1
        ? `Hace ${Math.floor(interval)} horas`
        : `Hace ${Math.floor(interval)} hora`
    }`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return `${
      Math.floor(interval) > 1
        ? `Hace ${Math.floor(interval)} minutos`
        : `Hace ${Math.floor(interval)} minuto`
    }`;
  }
  return `${
    Math.floor(seconds) > 1
      ? `Hace ${Math.floor(seconds)} segundos`
      : `Hace ${Math.floor(seconds)} segundo`
  }`;
}
function headlineCountComments() {
  const totalComentarios = document.getElementById("total-comments");
  let comments = [...document.querySelectorAll(".cards-comments__item")];
  totalComentarios.textContent = comments.length;
}

function debounce(callback, wait, callFirst) {
  let timerId;
  let call = callFirst;
  return (...args) => {
    if (call) {
      callback(...args);
      call = false;
      return;
    }
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      callback(...args);
      call = callFirst;
    }, wait);
  };
}
