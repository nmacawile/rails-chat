import { Message } from './message';
import { Cluster } from './cluster';

export function createClusters(messages: Message[]): Cluster[] {
  const clusters: Cluster[] = [];
  messages.forEach((message: Message) => {
    addIntoClusters(clusters, message);
  });
  return clusters;
}

export function addIntoClusters(clusters: Cluster[], message: Message) {
  if (clusters.length > 0 && lastOf(clusters).userId === message.user.id) {
    lastOf(clusters).messages.push(message);
  } else {
    const cluster = { userId: message.user.id, messages: [message] };
    clusters.push(cluster);
  }
}

export function combineClusters(c1: Cluster[], c2: Cluster[]): Cluster[] {
  if (lastOf(c1).userId === firstOf(c2).userId) {
    const c1Copy = c1.slice();
    const c2Copy = c2.slice(1);    
    lastOf(c1Copy).messages.push(...firstOf(c2).messages);
    return [...c1Copy, ...c2Copy];
  } else {
    return [...c1, ...c2];
  }
}

function firstOf(array: Array<any>) {
  return array[0];
}

function lastOf(array: Array<any>) {
  return array[array.length - 1];
}
