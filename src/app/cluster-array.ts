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

export function addToCluster(cluster: Array<Array<any>>, member: any, previous: Function) {
  if (cluster.length === 0 || previous(last_element(cluster)))
    cluster.push([member]);
  else last(cluster).push(member);
}

function last(array: Array<any>) {
  return array[array.length - 1];
}

function last_element(array: Array<Array<any>>) {
  return last(last(array));
}

