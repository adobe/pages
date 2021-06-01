async function fetch_sheet() {
  window.hlx.dependencies.push('content.json');
  const resp=await fetch('content.json');
  const json=await resp.json();
  return (Array.isArray(json) ? json : json.data);
}