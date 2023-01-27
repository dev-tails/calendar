export async function getPublicKey() {
  const data = await fetch('/api/subscriptions/publickey');
  const jsonData = await data.json();
  return jsonData.publickey;
}

export async function saveSubscription(subscription: any) {
  const response = await fetch('/api/subscriptions', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json',
    },
  });
  return response.json();
}

export async function deleteSubscription() {
  await fetch('/api/subscriptions', {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
    },
  });
}
