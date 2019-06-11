export function cluster(array: Array<any>, condition: Function) {
  const clusteredArray = [];
  array.forEach((member: any) => {
    condition(member)
      ? addToCluster(clusteredArray, member, prev => {
          return !condition(prev);
        })
      : addToCluster(clusteredArray, member, condition);
  });
  return clusteredArray;
}

export function addToCluster(
  cluster: Array<Array<any>>,
  member: any,
  previous: Function,
) {
  if (cluster.length === 0 || previous(last_element(cluster)))
    cluster.push([member]);
  else last(cluster).push(member);
}

export function clusterCombine(
  clusterA: Array<Array<any>>,
  clusterB: Array<Array<any>>,
  previous: Function,
) {
    return [...clusterA, ...clusterB];
}

function first(array: Array<any>) {
  return array[0];
}

function last(array: Array<any>) {
  return array[array.length - 1];
}

function last_element(array: Array<Array<any>>) {
  return last(last(array));
}
