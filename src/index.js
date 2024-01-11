const UPDATE_IMAGE_ALT_POPUP_CSS = {
  position: "fixed",
  boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.5)",
  border: "1px solid #BBBBBB",
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "6px 8px",
  fontSize: "16px",
  lineHeight: "16px",
  zIndex: "1000",
  background: "#fff",
};

const UPDATE_IMAGE_ALT_INPUT_CSS = {
  color: "#1C2024",
  padding: "4px 6px",
  borderRadius: "4px",
  backgroundColor: "#fff",
  border: "1px solid #E2E1DE",
};

const UPDATE_IMAGE_ALT_BUTTON_CSS = {
  background: "#208368",
  padding: "4px 6px",
  marginLeft: "8px",
  color: "#fff",
  borderRadius: "4px",
  border: "none",
};

const applyCSS = (node, css) => {
  for (const [property, value] of Object.entries(css)) {
    node.style[property] = value;
  }
};

const getRandomImagesAlt = async (count = 1) => {
  const res = await fetch(`https://random-word-api.herokuapp.com/word?number=${count}`, {
    method: "GET",
  });
  return res.json();
};

const highlightImage = (img, color = "#30A46C") => {
  const highlightedShadow = "0 10px 15px -3px rgb(0 0 0 / 0.2), 0 4px 6px -4px rgb(0 0 0 / 0.2)";

  img.style.border = `3px solid ${color}`;
  img.style.boxShadow = highlightedShadow;
};

const replaceImageAlt = (img, alt, color) => {
  img.alt = alt;
  highlightImage(img, color);
};

const createUpdateImageAltPopup = (event) => {
  event.preventDefault();
  event.stopPropagation();

  const { srcElement } = event;

  const popups = document.querySelectorAll("#replaceImgAltPopup");
  popups.forEach((popupNode) => popupNode.remove());

  const srcElementRect = srcElement.getBoundingClientRect();

  document.body.style.overflow = "hidden";

  const popup = document.createElement("div");
  applyCSS(popup, UPDATE_IMAGE_ALT_POPUP_CSS);
  popup.id = "replaceImgAltPopup";
  popup.role = "popup";
  popup.style.top = `${srcElementRect.bottom + 4}px`;
  popup.style.left = `${srcElementRect.left}px`;
  popup.width = `${srcElementRect.width}px`;

  const input = document.createElement("input");
  applyCSS(input, UPDATE_IMAGE_ALT_INPUT_CSS);

  const button = document.createElement("button");
  applyCSS(button, UPDATE_IMAGE_ALT_BUTTON_CSS);
  button.innerText = "Replace";

  popup.appendChild(input);
  popup.appendChild(button);

  button.addEventListener("click", () => {
    replaceImageAlt(srcElement, input.value, "#5151CD");
    input.value = "";
    popup.remove();
    document.body.style.overflow = "auto";
  });

  document.addEventListener("click", (e) => {
    if (
      e.srcElement.id !== "replaceImgAltPopup" &&
      e.srcElement.parentElement.id !== "replaceImgAltPopup"
    ) {
      popup.remove();
      document.body.style.overflow = "auto";
    }
  });

  srcElement.parentElement.append(popup);
};

const replaceInitialImagesAlt = async () => {
  const images = document.querySelectorAll("img");
  const alts = await getRandomImagesAlt(images.length);

  images.forEach((img) => img.addEventListener("click", createUpdateImageAltPopup));

  images.forEach((img, index) => {
    replaceImageAlt(img, alts[index]);
  });
};

const observeImagesTargetNode = document.body;
const observeImagesConfig = {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["src"],
};

const handleNewImageNodes = async (nodes) => {
  const alts = await getRandomImagesAlt(nodes.length);

  nodes.forEach((img) => img.addEventListener("click", createUpdateImageAltPopup));
  nodes.forEach((img, index) => {
    replaceImageAlt(img, alts[index]);
  });
};

const observeImages = () => {
  const observer = new MutationObserver((mutationsList) => {
    const imageNodes = [];

    for (const mutation of mutationsList) {
      if (mutation.type === "attributes" && mutation.target.nodeName === "IMG") {
        imageNodes.push(mutation.target);
      }
    }

    handleNewImageNodes(imageNodes);
  });

  observer.observe(observeImagesTargetNode, observeImagesConfig);
};

replaceInitialImagesAlt();
observeImages();
