export async function getPublicKey() {
  const data = await fetch('/api/subscriptions/publickey');
  const jsonData = await data.json();
  return jsonData.publickey;
}