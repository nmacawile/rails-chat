export function scrollPositionFromBottom(el: Element): number {
  const ch = el.clientHeight;
  const st = el.scrollTop;
  const sh = el.scrollHeight;
  return Math.abs((ch + st) - sh);
}