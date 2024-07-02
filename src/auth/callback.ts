Office.onReady(function () {
  const code = getParams();

  Office.context.ui.messageParent(code);
});

function getParams() {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");

  return code ?? '';
}