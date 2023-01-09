async function run() {
  const root = document.getElementById('root');

  const textnode = document.createTextNode('Coffee');

  if (root) root.appendChild(textnode);
}

run();
