export function checkOverflow(elementId, elementSize, maxSize) {
  const textElement = document.getElementById(elementId);
  if (textElement)
    if (elementSize >= maxSize) textElement.classList.add("overflow");
    else textElement.classList.remove("overflow");
}
